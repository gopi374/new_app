import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { MONUMENTS } from '../data/mockData';
import { Monument } from '../types';
import { heritageService } from '../services/heritageService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MapWebView = WebView as any;

interface NearbyScreenProps {
  onSelectMonument: (monumentId: string) => void;
}

type MapLayerType = 'satellite' | 'street' | 'topo';

export const NearbyScreen: React.FC<NearbyScreenProps> = ({ onSelectMonument }) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: 22.7196,
    longitude: 75.8577,
  });
  const [userCity, setUserCity] = useState<string>('Indore');
  const [locationLoading, setLocationLoading] = useState<boolean>(true);
  const [selectedPin, setSelectedPin] = useState<string>('rajwada-palace');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [nearbyMonuments, setNearbyMonuments] = useState<Monument[]>(MONUMENTS);
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(50);
  const [mapLayer, setMapLayer] = useState<MapLayerType>('satellite');

  const webViewRef = useRef<any>(null);
  const carouselScrollRef = useRef<ScrollView>(null);

  // Fetch real user location on mount
  const fetchUserLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setUserLocation({ latitude: lat, longitude: lng });

        // Reverse geocode to get city
        const [addr] = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });

        if (addr) {
          const detected = addr.city || addr.subregion || addr.district || addr.region || 'Current Location';
          setUserCity(detected);
        }

        // Fetch monuments relative to user GPS
        const data = await heritageService.getNearbyMonuments(lng, lat, selectedRadiusKm * 1000);
        if (data && data.length > 0) {
          setNearbyMonuments(data);
          setSelectedPin(data[0].id);
        }

        // Pan WebView map to user location
        injectJs(`window.setUserPosition && window.setUserPosition(${lat}, ${lng}, "${userCity}");`);
      } else {
        loadMonumentsForLocation(userLocation.latitude, userLocation.longitude);
      }
    } catch {
      loadMonumentsForLocation(userLocation.latitude, userLocation.longitude);
    } finally {
      setLocationLoading(false);
    }
  };

  const loadMonumentsForLocation = async (lat: number, lng: number) => {
    try {
      const data = await heritageService.getNearbyMonuments(lng, lat, selectedRadiusKm * 1000);
      if (data && data.length > 0) {
        setNearbyMonuments(data);
      }
    } catch {
      // Keep default
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, [selectedRadiusKm]);

  // Helper to execute JS in WebView map
  const injectJs = (jsCode: string) => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(jsCode + '; true;');
    }
  };

  // Update map layer
  const handleSetLayer = (layer: MapLayerType) => {
    setMapLayer(layer);
    injectJs(`window.setMapLayer && window.setMapLayer("${layer}");`);
  };

  const categories = ['All', 'Popular', 'Heritage', 'UNESCO Site', 'Palace', 'Museum', 'Nature', 'Ancient History'];

  const getMarkerIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('palace') || cat.includes('fort')) return '🏰';
    if (cat.includes('temple') || cat.includes('ashram')) return '🛕';
    if (cat.includes('museum')) return '🖼️';
    if (cat.includes('nature')) return '🌳';
    if (cat.includes('food') || cat.includes('market')) return '🍜';
    return '🏛️';
  };

  // Filter monuments based on category and search query
  const filteredMonuments = nearbyMonuments.filter((m) => {
    const matchesSearch =
      !searchQuery.trim() ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      m.city.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase().trim());

    const matchesCategory =
      selectedCategory === 'All' ||
      m.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Select place from Map or Carousel
  const handleSelectPlace = (placeId: string, shouldPanMap: boolean = true) => {
    setSelectedPin(placeId);
    const found = nearbyMonuments.find((m) => m.id === placeId);
    if (found && shouldPanMap && found.latitude && found.longitude) {
      injectJs(`window.focusMonument && window.focusMonument("${placeId}", ${found.latitude}, ${found.longitude});`);
    }

    // Scroll carousel to index
    const index = filteredMonuments.findIndex((m) => m.id === placeId);
    if (index >= 0 && carouselScrollRef.current) {
      carouselScrollRef.current.scrollTo({
        x: index * (SCREEN_WIDTH * 0.78 + 12),
        animated: true,
      });
    }
  };

  // Handle messages from WebView (e.g. Marker clicked)
  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'MARKER_CLICK') {
        handleSelectPlace(data.id, false);
      } else if (data.type === 'MAP_READY') {
        // Update markers in webview
        updateWebViewMarkers();
      }
    } catch {
      // ignore
    }
  };

  // Update markers in Leaflet map
  const updateWebViewMarkers = () => {
    const markersData = filteredMonuments.map((m) => ({
      id: m.id,
      name: m.name,
      city: m.city,
      category: m.category,
      lat: m.latitude ?? 22.7196,
      lng: m.longitude ?? 75.8577,
      distanceKm: m.distanceKm ?? 0,
      rating: m.rating ?? 4.8,
      icon: getMarkerIcon(m.category),
    }));

    const js = `window.renderMonuments && window.renderMonuments(${JSON.stringify(markersData)}, "${selectedPin}");`;
    injectJs(js);
  };

  // Re-render markers when filtered places or selection changes
  useEffect(() => {
    updateWebViewMarkers();
  }, [filteredMonuments.length, selectedPin, userLocation]);

  // Handle open map directions
  const handleOpenDirections = (place: Monument) => {
    const destination = place.latitude && place.longitude
      ? `${place.latitude},${place.longitude}`
      : encodeURIComponent(`${place.name}, ${place.city}`);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://maps.google.com/?q=${destination}`);
    });
  };

  // Generate HTML for interactive satellite map
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #map { width: 100%; height: 100%; background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        
        .user-pulse-wrap {
          position: relative;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
        }
        .user-pulse-ring {
          position: absolute; width: 100%; height: 100%;
          border-radius: 50%; background: rgba(59, 130, 246, 0.4);
          animation: userPulse 2s infinite ease-out;
        }
        .user-pulse-dot {
          width: 14px; height: 14px; border-radius: 50%;
          background: #2563EB; border: 2.5px solid #FFFFFF;
          box-shadow: 0 0 6px rgba(0,0,0,0.5); z-index: 2;
        }
        @keyframes userPulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        .monument-marker-badge {
          background: #FFFFFF;
          border: 2px solid #9E2016;
          border-radius: 20px;
          padding: 4px 8px;
          display: flex; align-items: center; gap: 4px;
          font-weight: 700; font-size: 11px; color: #111827;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          white-space: nowrap; transition: all 0.25s ease;
          cursor: pointer;
        }
        .monument-marker-badge.active {
          background: #9E2016; color: #FFFFFF;
          border-color: #FFFFFF; transform: scale(1.18);
          box-shadow: 0 6px 16px rgba(158, 32, 22, 0.6);
        }

        .leaflet-popup-content-wrapper {
          border-radius: 14px; padding: 4px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .popup-card { padding: 4px; }
        .popup-title { font-weight: 800; font-size: 13px; color: #9E2016; }
        .popup-sub { font-size: 10px; color: #4B5563; margin-top: 2px; }
        .popup-dist { font-size: 10px; font-weight: 700; color: #059669; margin-top: 2px; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map;
        var currentLayer;
        var userMarker;
        var markersGroup = L.layerGroup();

        // Tile layer definitions
        var layers = {
          satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            attribution: 'Esri World Imagery'
          }),
          street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'OpenStreetMap'
          }),
          topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
            attribution: 'OpenTopoMap'
          })
        };

        function initMap() {
          var initialLat = ${userLocation.latitude};
          var initialLng = ${userLocation.longitude};

          map = L.map('map', {
            center: [initialLat, initialLng],
            zoom: 11,
            zoomControl: false,
            attributionControl: false
          });

          currentLayer = layers['${mapLayer}'];
          currentLayer.addTo(map);
          markersGroup.addTo(map);

          // Create User Pulse Marker
          var userIcon = L.divIcon({
            className: 'custom-user-icon',
            html: '<div class="user-pulse-wrap"><div class="user-pulse-ring"></div><div class="user-pulse-dot"></div></div>',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          userMarker = L.marker([initialLat, initialLng], { icon: userIcon }).addTo(map);
          userMarker.bindPopup('<div class="popup-card"><div class="popup-title">📍 Your Location</div><div class="popup-sub">${userCity}</div></div>');

          // Notify React Native ready
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MAP_READY' }));
          }
        }

        window.setMapLayer = function(layerName) {
          if (layers[layerName] && map) {
            map.removeLayer(currentLayer);
            currentLayer = layers[layerName];
            currentLayer.addTo(map);
          }
        };

        window.setUserPosition = function(lat, lng, cityName) {
          if (map && userMarker) {
            userMarker.setLatLng([lat, lng]);
            userMarker.setPopupContent('<div class="popup-card"><div class="popup-title">📍 Your Location</div><div class="popup-sub">' + (cityName || 'Current Location') + '</div></div>');
            map.flyTo([lat, lng], 13, { duration: 1.2 });
          }
        };

        window.focusMonument = function(id, lat, lng) {
          if (map) {
            map.flyTo([lat, lng], 14, { duration: 1.0 });
          }
        };

        window.renderMonuments = function(monumentsList, activeId) {
          if (!map || !markersGroup) return;
          markersGroup.clearLayers();

          monumentsList.forEach(function(place) {
            var isActive = (place.id === activeId);
            var markerHtml = '<div class="monument-marker-badge ' + (isActive ? 'active' : '') + '">' +
                             '<span>' + place.icon + '</span>' +
                             '<span>' + place.name + '</span>' +
                             '</div>';

            var customIcon = L.divIcon({
              className: 'custom-monument-icon',
              html: markerHtml,
              iconSize: [null, null],
              iconAnchor: [30, 15]
            });

            var m = L.marker([place.lat, place.lng], { icon: customIcon });
            
            var popupContent = '<div class="popup-card">' +
                               '<div class="popup-title">' + place.icon + ' ' + place.name + '</div>' +
                               '<div class="popup-sub">' + place.city + ' • ★ ' + place.rating + '</div>' +
                               '<div class="popup-dist">📍 ' + place.distanceKm + ' km away</div>' +
                               '</div>';

            m.bindPopup(popupContent);

            m.on('click', function() {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'MARKER_CLICK',
                  id: place.id
                }));
              }
            });

            markersGroup.addLayer(m);
          });
        };

        window.zoomIn = function() { if (map) map.zoomIn(); };
        window.zoomOut = function() { if (map) map.zoomOut(); };
        window.recenter = function() {
          if (map && userMarker) {
            var latlng = userMarker.getLatLng();
            map.flyTo(latlng, 13, { duration: 1.0 });
          }
        };

        window.onload = initMap;
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* Interactive Full-Screen Satellite/Map WebView */}
      <View style={styles.mapCanvas}>
        <MapWebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          style={styles.webViewMap}
          onMessage={handleWebViewMessage}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          renderLoading={() => (
            <View style={styles.mapLoadingWrap}>
              <ActivityIndicator size="large" color="#9E2016" />
              <Text style={styles.mapLoadingText}>Loading Satellite Map...</Text>
            </View>
          )}
        />
      </View>

      {/* Top Floating Search & Category Chips */}
      <View style={styles.topFloatHeader}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search nearby heritage places..."
            placeholderTextColor="#8D706C"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, selectedCategory === cat && styles.activeChip]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.chipText, selectedCategory === cat && styles.activeChipText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Left Map Layer Switcher (Satellite / Street / Topo) */}
      <View style={styles.layerSwitcher}>
        <TouchableOpacity
          style={[styles.layerBtn, mapLayer === 'satellite' && styles.activeLayerBtn]}
          onPress={() => handleSetLayer('satellite')}
        >
          <Text style={styles.layerBtnIcon}>🛰️</Text>
          <Text style={[styles.layerBtnText, mapLayer === 'satellite' && styles.activeLayerBtnText]}>
            Satellite
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.layerBtn, mapLayer === 'street' && styles.activeLayerBtn]}
          onPress={() => handleSetLayer('street')}
        >
          <Text style={styles.layerBtnIcon}>🗺️</Text>
          <Text style={[styles.layerBtnText, mapLayer === 'street' && styles.activeLayerBtnText]}>
            Street
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.layerBtn, mapLayer === 'topo' && styles.activeLayerBtn]}
          onPress={() => handleSetLayer('topo')}
        >
          <Text style={styles.layerBtnIcon}>⛰️</Text>
          <Text style={[styles.layerBtnText, mapLayer === 'topo' && styles.activeLayerBtnText]}>
            Topo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Right Floating Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity
          style={styles.controlCircleBtn}
          onPress={() => {
            fetchUserLocation();
            injectJs('window.recenter && window.recenter();');
          }}
          activeOpacity={0.8}
        >
          {locationLoading ? (
            <ActivityIndicator size="small" color="#9E2016" />
          ) : (
            <Text style={styles.controlIcon}>🎯</Text>
          )}
        </TouchableOpacity>

        <View style={styles.zoomPill}>
          <TouchableOpacity
            style={styles.zoomBtn}
            onPress={() => injectJs('window.zoomIn && window.zoomIn();')}
          >
            <Text style={styles.zoomBtnText}>+</Text>
          </TouchableOpacity>
          <View style={styles.zoomDivider} />
          <TouchableOpacity
            style={styles.zoomBtn}
            onPress={() => injectJs('window.zoomOut && window.zoomOut();')}
          >
            <Text style={styles.zoomBtnText}>−</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Horizontal Carousel over Map */}
      <View style={styles.bottomCarouselArea}>
        <View style={styles.carouselHeaderRow}>
          <View style={styles.headerLocationPill}>
            <Text style={styles.foundText}>
              {filteredMonuments.length} Heritage Sites Near {userCity}
            </Text>
          </View>
          <Text style={styles.radiusPill}>Radius: {selectedRadiusKm} km</Text>
        </View>

        <ScrollView
          ref={carouselScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselCardsRow}
        >
          {filteredMonuments.map((place) => {
            const isSelected = selectedPin === place.id;
            return (
              <TouchableOpacity
                key={place.id}
                style={[styles.nearbyCard, isSelected && styles.nearbyCardActive]}
                activeOpacity={0.9}
                onPress={() => handleSelectPlace(place.id, true)}
              >
                <View style={styles.cardTopImage}>
                  <Image source={{ uri: place.imageUrl }} style={styles.placeImage} />
                  <View style={styles.imageOverlay} />

                  {/* Top Badge */}
                  <View style={styles.placeBadge}>
                    <Text style={styles.placeBadgeText}>
                      {getMarkerIcon(place.category)} {place.category}
                    </Text>
                  </View>

                  {/* Bottom of Image Info */}
                  <View style={styles.cardImageFooter}>
                    <View style={styles.titleRow}>
                      <Text style={styles.nearbyTitle} numberOfLines={1}>
                        {place.name}
                      </Text>
                      <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>★ {place.rating}</Text>
                      </View>
                    </View>
                    <Text style={styles.distanceText}>
                      📍 {place.distanceKm} km away • {place.city}, {place.state}
                    </Text>
                    <Text style={styles.nearbyDesc} numberOfLines={1}>
                      {place.description}
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.cardActionsRow}>
                  <TouchableOpacity
                    style={styles.directionsBtn}
                    onPress={() => handleOpenDirections(place)}
                  >
                    <Text style={styles.directionsBtnText}>↗ Directions</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.visitBtn}
                    onPress={() => onSelectMonument(place.id)}
                  >
                    <Text style={styles.visitBtnText}>🧭 View Details</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  mapCanvas: {
    ...StyleSheet.absoluteFillObject,
  },
  webViewMap: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  mapLoadingWrap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  mapLoadingText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  topFloatHeader: {
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  clearIcon: {
    fontSize: 14,
    color: '#9CA3AF',
    padding: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
  },
  chipsRow: {
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 4,
  },
  activeChip: {
    backgroundColor: '#9E2016',
    borderColor: '#9E2016',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  layerSwitcher: {
    position: 'absolute',
    left: 16,
    top: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 4,
    gap: 4,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  layerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  activeLayerBtn: {
    backgroundColor: '#9E2016',
  },
  layerBtnIcon: {
    fontSize: 12,
  },
  layerBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  activeLayerBtnText: {
    color: '#FFFFFF',
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: 130,
    gap: 12,
    zIndex: 10,
  },
  controlCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  controlIcon: {
    fontSize: 20,
  },
  zoomPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  zoomBtn: {
    width: 44,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  zoomDivider: {
    height: 1,
    width: 26,
    backgroundColor: '#E5E7EB',
  },
  bottomCarouselArea: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  carouselHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  headerLocationPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  foundText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9E2016',
  },
  radiusPill: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1F2937',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  carouselCardsRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  nearbyCard: {
    width: SCREEN_WIDTH * 0.78,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 4,
  },
  nearbyCardActive: {
    borderColor: '#9E2016',
    borderWidth: 2.5,
  },
  cardTopImage: {
    height: 140,
    position: 'relative',
  },
  placeImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  placeBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  placeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cardImageFooter: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nearbyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  ratingBadge: {
    backgroundColor: 'rgba(217, 119, 6, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginLeft: 6,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FEF08A',
    marginTop: 2,
  },
  nearbyDesc: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  cardActionsRow: {
    flexDirection: 'row',
    padding: 10,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  directionsBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  directionsBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  visitBtn: {
    flex: 1,
    backgroundColor: '#9E2016',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

