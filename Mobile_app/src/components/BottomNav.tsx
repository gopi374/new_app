import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export type TabName = 'Home' | 'Search' | 'Nearby' | 'Explore' | 'Profile';

interface BottomNavProps {
  currentTab: TabName;
  onSelectTab: (tab: TabName) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { name: TabName; label: string; icon: string; activeIcon: string }[] = [
    { name: 'Home', label: 'Home', icon: '🏠', activeIcon: '🏠' },
    { name: 'Search', label: 'Search', icon: '🔍', activeIcon: '🔍' },
    { name: 'Nearby', label: 'Nearby', icon: '📍', activeIcon: '📍' },
    { name: 'Explore', label: 'Explore', icon: '🧭', activeIcon: '🧭' },
    { name: 'Profile', label: 'Profile', icon: '👤', activeIcon: '👤' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => onSelectTab(tab.name)}
          >
            <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
              <Text style={[styles.iconText, isActive && styles.activeIconText]}>
                {isActive ? tab.activeIcon : tab.icon}
              </Text>
            </View>
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  iconWrapper: {
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(158, 32, 22, 0.1)',
  },
  iconText: {
    fontSize: 18,
    opacity: 0.6,
  },
  activeIconText: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#666666',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
});
