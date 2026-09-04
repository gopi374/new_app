import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { MONUMENTS, MARKETS, BADGES, HERITAGE_APPS, USER_PROFILE } from '../data/mockData';
import { Monument, MarketItem, HeritageBadge, HeritageAppService, UserProfile } from '../types';

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
   * Fetch all monuments from backend (with local fallback)
   */
  async getMonuments(): Promise<Monument[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/places?limit=50`, {
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
    return this.monuments.map((m) => ({
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
   * Fetch all markets
   */
  async getMarkets(): Promise<MarketItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/markets?limit=50`, {
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
    return [...this.markets];
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
   * Helper: Normalize Place schema from MongoDB into Mobile Monument model
   */
  private normalizePlaceToMonument(item: any): Monument {
    const id = item._id || item.id;
    const localMatch = this.monuments.find((m) => m.id === id);
    if (localMatch) {
      return { ...localMatch, isFavorite: this.favorites.has(id) };
    }

    return {
      id,
      name: item.name || item.title || 'Heritage Site',
      subtitle: item.subtitle || item.category || 'Historical Monument',
      city: item.city || item.location_name?.split(',')[0] || 'India',
      state: item.state || 'Madhya Pradesh',
      category: item.category || 'Heritage',
      categoryTag: item.categoryTag || item.tags?.[0] || 'Historical Landmark',
      description: item.description || 'Explore the rich history and architecture of this landmark.',
      detailedStory: item.detailedStory || item.description || 'Built with architectural excellence.',
      imageUrl:
        item.imageUrl ||
        item.media?.[0]?.url ||
        'https://images.unsplash.com/photo-1599831104321-4f10115e5743?w=800',
      rating: item.rating || 4.8,
      isFavorite: this.favorites.has(id),
      latitude: item.location?.coordinates ? item.location.coordinates[1] : item.latitude,
      longitude: item.location?.coordinates ? item.location.coordinates[0] : item.longitude,
      highlights: item.highlights || [
        { id: 'h1', title: 'Architectural Marvel', description: 'Intricate design and heritage stone craft.', iconName: 'account-balance' },
      ],
      visitingInfo: item.visitingInfo || {
        openingHours: item.opening_hours || '10:00 AM – 5:00 PM',
        closedDays: 'Open Daily',
        entryFeeIndian: '₹10 (Indians)',
        entryFeeForeigner: '₹250 (Foreigners)',
        bestTimeToVisit: 'October – March',
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

    return {
      id,
      name: item.name || 'Traditional Market',
      subtitle: item.subtitle || 'Night Market & Food Paradise',
      city: item.city || 'Indore',
      state: item.state || 'Madhya Pradesh',
      category: item.category || 'Cultural Night Market',
      description: item.description || 'Vibrant night bazaar known for authentic delicacies and handicrafts.',
      detailedStory: item.detailedStory || item.description || 'Famous heritage market.',
      imageUrl: item.imageUrl || item.media?.[0]?.url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
      culinarySignatures: item.culinarySignatures || [
        { id: 'c1', title: 'Local Delicacies', description: 'Freshly prepared traditional street food.' },
      ],
      visitingInfo: item.visitingInfo || {
        marketHours: '8:00 PM – 2:00 AM',
        setupTime: '7:30 PM',
        peakCrowd: '10:00 PM – 12:00 AM',
        gettingThere: 'Central city access via local auto or taxi.',
      },
    };
  }
}

export const heritageService = new HeritageService();
