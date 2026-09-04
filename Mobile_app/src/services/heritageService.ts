import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { MONUMENTS, MARKETS, BADGES, HERITAGE_APPS, USER_PROFILE, CITIES } from '../data/mockData';
import { Monument, MarketItem, HeritageBadge, HeritageAppService, UserProfile, CityItem, TrailItem } from '../types';

/**
 * Auto-detect backend URL:
 * - If EXPO_PUBLIC_API_URL is set in .env, use it.
 * - Otherwise derive the host from Metro bundler (works for both
 *   physical devices AND emulators automatically).
 * Metro's hostUri looks like "192.168.43.133:8081". We strip the
 * port and replace it with the backend port 4000.
 */
function getApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  // Derive from Metro bundler host (works on real device & emulator)
  const metroHost: string | undefined =
    (Constants.expoConfig as any)?.hostUri ||
    (Constants as any).manifest?.debuggerHost ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;
  if (metroHost) {
    const host = metroHost.split(':')[0]; // strip Metro port
    return `http://${host}:4000/api/v1`;
  }
  // Final fallback
  return Platform.OS === 'android'
    ? 'http://10.0.2.2:4000/api/v1'
    : 'http://localhost:4000/api/v1';
}

export const API_BASE_URL = getApiBaseUrl();
console.log('[API] Base URL:', API_BASE_URL);

class HeritageService {
  private monuments: Monument[] = [...MONUMENTS];
  private markets: MarketItem[] = [...MARKETS];
  private favorites: Set<string> = new Set(['rajwada-palace']);
  private visitedIds: Set<string> = new Set(['rajwada-palace', 'lal-bagh-palace']);
  private token: string | null = null;

  /**
   * Set JWT Authentication Token
   */
  setToken(token: string | null) {
    this.token = token;
  }

  /**
   * Helper headers
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  /**
   * Login user to live backend
   */
  async login(email: string, password: string): Promise<{ success: boolean; token?: string; refreshToken?: string; user?: any; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await response.json();
      if (response.ok && json.success) {
        this.token = json.data.tokens?.access_token || null;
        return {
          success: true,
          token: json.data.tokens?.access_token,
          refreshToken: json.data.tokens?.refresh_token,
          user: json.data.user,
        };
      }
      return { success: false, error: json.error?.message || json.message || 'Login failed' };
    } catch (err: any) {
      console.error('[Auth] Login network error:', err?.message, err?.code);
      const isNetworkErr = err?.message?.includes('Network request failed') ||
        err?.message?.includes('fetch') ||
        err?.message?.includes('ECONNREFUSED');
      return {
        success: false,
        error: isNetworkErr
          ? 'Cannot reach server. Open a terminal and run: cd backend && npm start'
          : err.message || 'Login failed',
      };
    }
  }

  /**
   * Register new user on backend
   */
  async register(full_name: string, email: string, password: string): Promise<{ success: boolean; token?: string; refreshToken?: string; user?: any; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, password }),
      });
      const json = await response.json();
      if (response.ok && json.success) {
        this.token = json.data.tokens?.access_token || null;
        return {
          success: true,
          token: json.data.tokens?.access_token,
          refreshToken: json.data.tokens?.refresh_token,
          user: json.data.user,
        };
      }
      return { success: false, error: json.error?.message || json.message || 'Registration failed' };
    } catch (err: any) {
      console.error('[Auth] Register network error:', err?.message, err?.code);
      const isNetworkErr = err?.message?.includes('Network request failed') ||
        err?.message?.includes('fetch') ||
        err?.message?.includes('ECONNREFUSED');
      return {
        success: false,
        error: isNetworkErr
          ? 'Cannot reach server. Make sure backend is running on port 4000'
          : err.message || 'Registration failed',
      };
    }
  }

  /**
   * Fetch all registered cities from backend
   */
  async getCities(): Promise<CityItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cities?limit=50`, {
        headers: this.getHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success && Array.isArray(json.data?.items) && json.data.items.length > 0) {
          return json.data.items.map((item: any) => ({
            id: item._id || item.id,
            name: item.name,
            state: item.state_id ? 'Madhya Pradesh' : item.state || 'Madhya Pradesh',
            countryCode: item.country_code || 'IN',
            description: item.description,
            shortDescription: item.short_description,
            culturalSummary: item.cultural_summary,
            highlights: item.highlights || [],
            isFeatured: item.is_featured ?? true,
          }));
        }
      }
    } catch (error) {
      // Fallback
    }
    return [...CITIES];
  }

  /**
   * Fetch monuments from backend with optional city filter (with local fallback)
   */
  async getMonuments(cityId?: string, limit: number = 100): Promise<Monument[]> {
    try {
      let url = `${API_BASE_URL}/places?limit=${limit}`;
      if (cityId && cityId !== 'All') {
        const formattedCityId = cityId.startsWith('city_') ? cityId : `city_${cityId.toLowerCase().replace(/\s+/g, '_')}_mp`;
        url += `&city_id=${encodeURIComponent(formattedCityId)}`;
      }
      const response = await fetch(url, {
        headers: this.getHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success && Array.isArray(json.data?.items) && json.data.items.length > 0) {
          const apiMonuments: Monument[] = json.data.items.map((item: any) =>
            this.normalizePlaceToMonument(item)
          );
          return apiMonuments;
        }
      }
    } catch (error) {
      // Backend unreachable, fallback to local data
    }
    return this.monuments
      .filter((m) => {
        if (!cityId || cityId === 'All') return true;
        const normFilter = cityId.replace(/^city_/, '').replace(/_[a-z0-9]+$/, '').replace(/_/g, ' ').toLowerCase();
        return m.city.toLowerCase().includes(normFilter) || normFilter.includes(m.city.toLowerCase());
      })
      .map((m) => ({
        ...m,
        isFavorite: this.favorites.has(m.id),
      }));
  }

  /**
   * Fetch monument by unique ID
   */
  async getMonumentById(id: string): Promise<Monument | undefined> {
    try {
      const response = await fetch(`${API_BASE_URL}/places/${id}`, {
        headers: this.getHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          return this.normalizePlaceToMonument(json.data);
        }
      }
    } catch (error) {
      // Fallback
    }

    const item = this.monuments.find((m) => m.id === id);
    if (!item) return undefined;
    return {
      ...item,
      isFavorite: this.favorites.has(item.id),
    };
  }

  /**
   * Fetch all markets with optional city filter
   */
  async getMarkets(cityId?: string, limit: number = 50): Promise<MarketItem[]> {
    try {
      let url = `${API_BASE_URL}/markets?limit=${limit}`;
      if (cityId && cityId !== 'All') {
        const formattedCityId = cityId.startsWith('city_') ? cityId : `city_${cityId.toLowerCase().replace(/\s+/g, '_')}_mp`;
        url += `&city_id=${encodeURIComponent(formattedCityId)}`;
      }
      const response = await fetch(url, {
        headers: this.getHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success && Array.isArray(json.data?.items) && json.data.items.length > 0) {
          return json.data.items.map((item: any) => this.normalizeMarket(item));
        }
      }
    } catch (error) {
      // Fallback
    }
    return this.markets.filter((m) => {
      if (!cityId || cityId === 'All') return true;
      const normFilter = cityId.replace(/^city_/, '').replace(/_[a-z0-9]+$/, '').replace(/_/g, ' ').toLowerCase();
      return m.city.toLowerCase().includes(normFilter) || normFilter.includes(m.city.toLowerCase());
    });
  }

  /**
   * Fetch market by ID
   */
  async getMarketById(id: string): Promise<MarketItem | undefined> {
    try {
      const response = await fetch(`${API_BASE_URL}/markets/${id}`, {
        headers: this.getHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          return this.normalizeMarket(json.data);
        }
      }
    } catch (error) {
      // Fallback
    }
    return this.markets.find((m) => m.id === id);
  }

  /**
   * Fetch cultural and pilgrimage trails
   */
  async getTrails(cityId?: string): Promise<TrailItem[]> {
    try {
      let url = `${API_BASE_URL}/trails?limit=50`;
      if (cityId && cityId !== 'All') {
        const formattedCityId = cityId.startsWith('city_') ? cityId : `city_${cityId.toLowerCase().replace(/\s+/g, '_')}_mp`;
        url += `&city_id=${encodeURIComponent(formattedCityId)}`;
      }
      const response = await fetch(url, {
        headers: this.getHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success && Array.isArray(json.data?.items) && json.data.items.length > 0) {
          return json.data.items.map((t: any) => ({
            id: t._id || t.id,
            name: t.name,
            cityId: t.city_id,
            stateId: t.state_id,
            description: t.description,
            theme: t.theme,
            estimatedDurationMins: t.estimated_duration_mins,
            distanceKm: t.distance_km,
            stops: t.stops || [],
            tags: t.tags || [],
          }));
        }
      }
    } catch (error) {
      // Fallback
    }
    return [];
  }

  /**
   * Search places by query and category filter
   */
  async searchPlaces(query: string, categoryFilter?: string): Promise<Monument[]> {
    const normalizedQuery = query.toLowerCase().trim();
    try {
      if (normalizedQuery) {
        const response = await fetch(
          `${API_BASE_URL}/search?q=${encodeURIComponent(normalizedQuery)}`,
          { headers: this.getHeaders() }
        );
        if (response.ok) {
          const json = await response.json();
          if (json.success && Array.isArray(json.data?.results)) {
            const placesOnly = json.data.results
              .filter((r: any) => r.entity_type === 'PLACE' || !r.entity_type)
              .map((item: any) => this.normalizePlaceToMonument(item));
            if (placesOnly.length > 0) {
              return placesOnly;
            }
          }
        }
      }
    } catch (error) {
      // Fallback to local filtering
    }

    return this.monuments.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.city.toLowerCase().includes(normalizedQuery) ||
        item.state.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery);

      const matchesCategory =
        !categoryFilter ||
        categoryFilter === 'All' ||
        categoryFilter === 'Popular' ||
        item.category.toLowerCase() === categoryFilter.toLowerCase() ||
        item.categoryTag.toLowerCase().includes(categoryFilter.toLowerCase());

      return matchesQuery && matchesCategory;
    });
  }

  /**
   * Helper: Calculate distance in kilometers between two coordinates
   */
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  }

  /**
   * Get Nearby Monuments from Backend Geo API or calculated relative to user GPS
   */
  async getNearbyMonuments(lng: number, lat: number, radiusMeters: number = 25000): Promise<Monument[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/near?lng=${lng}&lat=${lat}&radiusMeters=${radiusMeters}&type=places`,
        { headers: this.getHeaders() }
      );
      if (response.ok) {
        const json = await response.json();
        if (json.success && Array.isArray(json.data?.results) && json.data.results.length > 0) {
          return json.data.results.map((item: any) => ({
            ...this.normalizePlaceToMonument(item),
            distanceKm: item.distance_meters
              ? parseFloat((item.distance_meters / 1000).toFixed(1))
              : item.latitude && item.longitude
              ? this.calculateDistanceKm(lat, lng, item.latitude, item.longitude)
              : 1.2,
          }));
        }
      }
    } catch (error) {
      // Fallback
    }

    const allMons = await this.getMonuments();
    return allMons
      .map((m) => {
        const mLat = m.latitude ?? 22.7196;
        const mLng = m.longitude ?? 75.8577;
        const dist = this.calculateDistanceKm(lat, lng, mLat, mLng);
        return {
          ...m,
          distanceKm: dist,
        };
      })
      .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  }

  /**
   * Fetch Digital Passport summary from backend
   */
  async getUserPassport(): Promise<UserProfile> {
    try {
      const response = await fetch(`${API_BASE_URL}/passport/summary`, {
        headers: this.getHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          const d = json.data;
          const visitedIds = (d.visited_places || []).map((v: any) =>
            typeof v.place_id === 'object' ? v.place_id?._id || v.place_id?.id : v.place_id
          ).filter(Boolean);

          this.visitedIds = new Set(visitedIds);

          return {
            name: d.name || USER_PROFILE.name,
            role: d.role || USER_PROFILE.role,
            level: d.level || USER_PROFILE.level,
            location: USER_PROFILE.location,
            explorerId: d.explorer_id || USER_PROFILE.explorerId,
            monumentsVisited: d.stats?.monuments_visited ?? visitedIds.length,
            badgesCount: d.stats?.badges_count ?? 0,
            savedCount: d.stats?.saved_count ?? this.favorites.size,
            avatarUrl: d.avatar_url || USER_PROFILE.avatarUrl,
            visitedPlaceIds: visitedIds,
          };
        }
      }
    } catch (error) {
      // Fallback
    }

    return {
      ...USER_PROFILE,
      savedCount: this.favorites.size,
      visitedPlaceIds: Array.from(this.visitedIds),
    };
  }

  /**
   * Toggle visited status on backend
   */
  async toggleVisitedPlace(placeId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/passport/toggle-visit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ place_id: placeId }),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success) {
          if (json.action === 'added') {
            this.visitedIds.add(placeId);
            return true;
          } else {
            this.visitedIds.delete(placeId);
            return false;
          }
        }
      }
    } catch (error) {
      // Local toggle fallback
    }

    if (this.visitedIds.has(placeId)) {
      this.visitedIds.delete(placeId);
      return false;
    } else {
      this.visitedIds.add(placeId);
      return true;
    }
  }

  /**
   * Toggle favorite status (backend + local sync)
   */
  async toggleFavorite(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/saved-items/toggle`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ entity_type: 'PLACE', entity_id: id }),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success) {
          const isSaved = json.data?.action === 'added';
          if (isSaved) this.favorites.add(id);
          else this.favorites.delete(id);
          return isSaved;
        }
      }
    } catch (error) {
      // Fallback
    }

    if (this.favorites.has(id)) {
      this.favorites.delete(id);
      return false;
    } else {
      this.favorites.add(id);
      return true;
    }
  }

  /**
   * Fetch featured documentary reels from backend
   */
  async getFeaturedReels(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/reels/featured`, {
        headers: this.getHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (error) {
      // Fallback
    }
    return [
      {
        id: 'reel-rajwada-01',
        title: 'Rajwada Palace & The Royal Heart',
        category_tag: 'INDORE • ARCHITECTURAL LEGACY',
        city: 'Indore',
        state: 'Madhya Pradesh',
        description: 'Cinematic visual chronicle of the 7-story Maratha fortress & living heritage',
        thumbnail_url: 'https://images.unsplash.com/photo-1599831104321-4f10115e5743?w=800&auto=format&fit=crop&q=80',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        is_4k_hdr: true,
        is_live_loop: true,
        chapters: [
          { title: '01 Rajwada Palace', start_time_seconds: 0, place_id: 'rajwada-palace' },
          { title: '02 Sarafa By Night', start_time_seconds: 45, place_id: 'sarafa-bazaar' },
          { title: '03 Mandu Gates', start_time_seconds: 90, place_id: 'mandu-fort' },
        ],
      },
    ];
  }

  /**
   * Fetch location weather status from backend (supports city and coordinates)
   */
  async getWeatherStatus(city?: string, lat?: number, lng?: number): Promise<{ city: string; temp: string; icon: string }> {
    const defaultCity = city || 'Indore';
    try {
      const queryParams = new URLSearchParams();
      if (city) queryParams.append('city', city);
      if (lat !== undefined) queryParams.append('lat', lat.toString());
      if (lng !== undefined) queryParams.append('lng', lng.toString());

      const response = await fetch(`${API_BASE_URL}/utilities/weather?${queryParams.toString()}`, {
        headers: this.getHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          return {
            city: json.data.city || defaultCity,
            temp: `${json.data.temperature_celsius}°C`,
            icon: json.data.icon || '☀️',
          };
        }
      }
    } catch (error) {
      // Direct Open-Meteo fallback if coordinates available
      if (lat !== undefined && lng !== undefined) {
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.current_weather) {
              const t = Math.round(data.current_weather.temperature);
              return { city: defaultCity, temp: `${t}°C`, icon: '☀️' };
            }
          }
        } catch {
          // fallback
        }
      }
    }
    return { city: defaultCity, temp: '28°C', icon: '☀️' };
  }

  /**
   * Fetch user badges
   */
  async getBadges(): Promise<HeritageBadge[]> {
    return [...BADGES];
  }

  /**
   * Fetch companion apps
   */
  async getHeritageApps(): Promise<HeritageAppService[]> {
    return [...HERITAGE_APPS];
  }

  /**
   * Check if an item is favorited
   */
  isFavorite(id: string): boolean {
    return this.favorites.has(id);
  }

  /**
   * Helper: Resolve city name from city_id or string
   */
  private getCityNameFromId(cityId?: string): string {
    if (!cityId) return 'Indore';
    const cityMap: Record<string, string> = {
      city_indore_mp: 'Indore',
      city_ujjain_mp: 'Ujjain',
      city_bhopal_mp: 'Bhopal',
      city_jabalpur_mp: 'Jabalpur',
      city_omkareshwar_mp: 'Omkareshwar',
      city_maheshwar_mp: 'Maheshwar',
      city_dewas_mp: 'Dewas',
      city_ratlam_mp: 'Ratlam',
      city_sehore_mp: 'Sehore',
    };
    if (cityMap[cityId]) return cityMap[cityId];
    return cityId
      .replace(/^city_/, '')
      .replace(/_[a-z0-9]+$/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  /**
   * Helper: Get high quality photo for place based on name and category
   */
  private getPhotoForPlace(name: string, placeType?: string, cityId?: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('rajwada')) return 'https://images.unsplash.com/photo-1599831104321-4f10115e5743?w=800';
    if (n.includes('lal bagh') || n.includes('lalbagh')) return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800';
    if (n.includes('mahakal')) return 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800';
    if (n.includes('ram ghat') || n.includes('gwarighat') || n.includes('kali ghat') || n.includes('ghat')) return 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800';
    if (n.includes('marble rocks') || n.includes('bhedaghat')) return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800';
    if (n.includes('dhuandhar') || n.includes('waterfall') || n.includes('falls')) return 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800';
    if (n.includes('omkareshwar') || n.includes('mamleshwar') || n.includes('siddhanath') || n.includes('kedareshwar')) return 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800';
    if (n.includes('maheshwar') || n.includes('ahilyabai') || n.includes('ahilyeshwar')) return 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=800';
    if (n.includes('madan mahal')) return 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800';
    if (n.includes('taj-ul') || n.includes('masjid')) return 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800';
    if (n.includes('upper lake') || n.includes('bada talab') || n.includes('meetha talab') || n.includes('lotus')) return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800';
    if (n.includes('salkanpur') || n.includes('vindhyavasini')) return 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800';
    if (n.includes('dewas') || n.includes('tekri') || n.includes('chamunda') || n.includes('tulja')) return 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800';
    if (n.includes('ratlam') || n.includes('sailana') || n.includes('cactus')) return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800';
    if (n.includes('bhimbetka') || n.includes('cave')) return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800';
    if (n.includes('museum')) return 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800';
    if (n.includes('temple') || n.includes('mandir') || n.includes('dham') || placeType === 'RELIGIOUS_SITE') return 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800';
    if (n.includes('fort') || n.includes('palace') || placeType === 'HERITAGE') return 'https://images.unsplash.com/photo-1599831104321-4f10115e5743?w=800';
    if (placeType === 'NATURE' || placeType === 'NATURAL_SITE') return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800';
    return 'https://images.unsplash.com/photo-1599831104321-4f10115e5743?w=800';
  }

  /**
   * Helper: Get high quality photo for market based on name
   */
  private getPhotoForMarket(name: string, cityId?: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('sarafa')) return 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800';
    if (n.includes('chappan')) return 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800';
    if (n.includes('handloom') || n.includes('saree') || n.includes('cloth')) return 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800';
    if (n.includes('ghat') || n.includes('prasad') || n.includes('temple')) return 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800';
    return 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800';
  }

  /**
   * Helper: Normalize Place schema from MongoDB into Mobile Monument model
   */
  private normalizePlaceToMonument(item: any): Monument {
    const id = item._id || item.id;
    const localMatch = this.monuments.find((m) => m.id === id);
    if (localMatch) {
      return { ...localMatch, isFavorite: this.favorites.has(id) };
    }

    const cityName = this.getCityNameFromId(item.city_id || item.city || item.address?.city_id);
    const categoryName = item.category || (item.place_type ? item.place_type.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Heritage');
    const image = item.imageUrl || item.media?.[0]?.url || this.getPhotoForPlace(item.name, item.place_type, item.city_id);

    return {
      id,
      name: item.name || item.title || 'Heritage Site',
      subtitle: item.subtitle || item.short_description || item.architectural_style || `${cityName} Landmark`,
      city: cityName,
      state: item.state || 'Madhya Pradesh',
      category: categoryName,
      categoryTag: item.categoryTag || (item.tags && item.tags.length ? item.tags[0].replace(/_/g, ' ').toUpperCase() : categoryName.toUpperCase()),
      description: item.description || item.short_description || 'Explore the rich cultural history and architecture of this landmark.',
      detailedStory: item.detailedStory || item.historical_significance || item.description || 'Built with architectural excellence and cultural resonance.',
      imageUrl: image,
      rating: item.rating || 4.8,
      isFavorite: this.favorites.has(id),
      latitude: item.location?.coordinates ? item.location.coordinates[1] : item.latitude,
      longitude: item.location?.coordinates ? item.location.coordinates[0] : item.longitude,
      highlights: item.highlights || (item.tags && item.tags.length
        ? item.tags.slice(0, 4).map((t: string, i: number) => ({
            id: `h${i}`,
            title: t.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
            description: 'Significant cultural and architectural hallmark of this site.',
            iconName: 'account-balance',
          }))
        : [
            { id: 'h1', title: 'Architectural Marvel', description: 'Intricate design and heritage craftsmanship.', iconName: 'account-balance' },
          ]),
      visitingInfo: item.visitingInfo || {
        openingHours: item.visiting_hours || item.opening_hours || '6:00 AM – 8:00 PM',
        closedDays: item.closed_days || 'Open Daily',
        entryFeeIndian: item.entry_fee || 'Free Entry',
        entryFeeForeigner: item.entry_fee || 'Free Entry',
        bestTimeToVisit: item.best_time_to_visit || 'October – March',
      },
    };
  }

  /**
   * Helper: Normalize Market schema from MongoDB into Mobile MarketItem model
   */
  private normalizeMarket(item: any): MarketItem {
    const id = item._id || item.id;
    const localMatch = this.markets.find((m) => m.id === id);
    if (localMatch) return localMatch;

    const cityName = this.getCityNameFromId(item.city_id || item.city || item.address?.city_id);
    const categoryName = item.category || (item.market_type ? item.market_type.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'Cultural Market');
    const image = item.imageUrl || item.media?.[0]?.url || this.getPhotoForMarket(item.name, item.city_id);

    return {
      id,
      name: item.name || 'Traditional Market',
      subtitle: item.subtitle || (item.best_known_for?.length ? item.best_known_for.slice(0, 3).join(' • ') : `${cityName} Traditional Market`),
      city: cityName,
      state: item.state || 'Madhya Pradesh',
      category: categoryName,
      description: item.description || 'Vibrant traditional bazaar known for authentic regional delicacies, textiles, and local crafts.',
      detailedStory: item.detailedStory || item.description || 'A focal point of regional commerce and centuries-old artisan traditions.',
      imageUrl: image,
      culinarySignatures: item.culinarySignatures || (item.best_known_for && item.best_known_for.length
        ? item.best_known_for.map((name: string, i: number) => ({
            id: `c${i}`,
            title: name,
            description: 'Authentic specialty cherished by locals and travellers alike.',
          }))
        : [
            { id: 'c1', title: 'Local Delicacies', description: 'Freshly prepared traditional regional foods.' },
          ]),
      visitingInfo: item.visitingInfo || {
        marketHours: item.operating_hours || '9:00 AM – 9:00 PM',
        setupTime: 'Morning opening',
        peakCrowd: 'Evening (6:00 PM – 9:00 PM)',
        gettingThere: item.address?.line1 || `${cityName} central access via auto or cab.`,
      },
    };
  }
}

export const heritageService = new HeritageService();
