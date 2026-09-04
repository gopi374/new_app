import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { NearbyScreen } from '../screens/NearbyScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { PassportScreen } from '../screens/PassportScreen';
import { MonumentDetailScreen } from '../screens/MonumentDetailScreen';
import { MarketDetailScreen } from '../screens/MarketDetailScreen';
import { MoreAppsScreen } from '../screens/MoreAppsScreen';
import { BottomNav, TabName } from '../components/BottomNav';
import { heritageService } from '../services/heritageService';

type ScreenState =
  | { type: 'tab'; tab: TabName }
  | { type: 'monument_detail'; monumentId: string; returnTab: TabName }
  | { type: 'market_detail'; marketId: string; returnTab: TabName }
  | { type: 'more_apps'; returnTab: TabName };

export const AppNavigator: React.FC = () => {
  const [screenState, setScreenState] = useState<ScreenState>({
    type: 'tab',
    tab: 'Home',
  });
  const [visitedPlaceIds, setVisitedPlaceIds] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadUserVisits() {
      try {
        const p = await heritageService.getUserPassport();
        if (isMounted && p.visitedPlaceIds) {
          setVisitedPlaceIds(p.visitedPlaceIds);
        }
      } catch {
        // Fallback
      }
    }
    loadUserVisits();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleVisitedPlace = async (placeId: string) => {
    const isNowVisited = await heritageService.toggleVisitedPlace(placeId);
    setVisitedPlaceIds((prev) =>
      isNowVisited ? [...prev, placeId] : prev.filter((id) => id !== placeId)
    );
  };

  const currentActiveTab: TabName =
    screenState.type === 'tab' ? screenState.tab : screenState.returnTab;

  const navigateToTab = (tab: TabName) => {
    setScreenState({ type: 'tab', tab });
  };

  const openMonumentDetail = (monumentId: string) => {
    setScreenState({
      type: 'monument_detail',
      monumentId,
      returnTab: currentActiveTab,
    });
  };

  const openMarketDetail = (marketId: string) => {
    setScreenState({
      type: 'market_detail',
      marketId,
      returnTab: currentActiveTab,
    });
  };

  const openMoreApps = () => {
    setScreenState({
      type: 'more_apps',
      returnTab: currentActiveTab,
    });
  };

  const handleBack = () => {
    if (screenState.type !== 'tab') {
      setScreenState({ type: 'tab', tab: screenState.returnTab });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContent}>
        {screenState.type === 'monument_detail' && (
          <MonumentDetailScreen
            monumentId={screenState.monumentId}
            onBackPress={handleBack}
            isVisited={visitedPlaceIds.includes(screenState.monumentId)}
            onToggleVisited={() => toggleVisitedPlace(screenState.monumentId)}
            onNavigateToPassport={() => navigateToTab('Profile')}
          />
        )}

        {screenState.type === 'market_detail' && (
          <MarketDetailScreen
            marketId={screenState.marketId}
            onBackPress={handleBack}
          />
        )}

        {screenState.type === 'more_apps' && (
          <MoreAppsScreen onBackPress={handleBack} />
        )}

        {screenState.type === 'tab' && screenState.tab === 'Home' && (
          <HomeScreen
            onSelectMonument={openMonumentDetail}
            onSelectMarket={openMarketDetail}
            onSeeAllPress={() => navigateToTab('Search')}
            onNavigateToMoreApps={openMoreApps}
          />
        )}

        {screenState.type === 'tab' && screenState.tab === 'Search' && (
          <SearchScreen
            onSelectMonument={openMonumentDetail}
            onNavigateToMoreApps={openMoreApps}
          />
        )}

        {screenState.type === 'tab' && screenState.tab === 'Nearby' && (
          <NearbyScreen onSelectMonument={openMonumentDetail} />
        )}

        {screenState.type === 'tab' && screenState.tab === 'Explore' && (
          <ExploreScreen
            onSelectMonument={openMonumentDetail}
            onNavigateToSearch={() => navigateToTab('Search')}
            onNavigateToMoreApps={openMoreApps}
          />
        )}

        {screenState.type === 'tab' && screenState.tab === 'Profile' && (
          <PassportScreen
            onNavigateToMoreApps={openMoreApps}
            visitedPlaceIds={visitedPlaceIds}
            onSelectPlace={openMonumentDetail}
          />
        )}
      </View>

      {/* Show persistent bottom navigation when on standard tabs */}
      {screenState.type === 'tab' && (
        <BottomNav currentTab={currentActiveTab} onSelectTab={navigateToTab} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenContent: {
    flex: 1,
  },
});
