export interface Monument {
  id: string;
  name: string;
  subtitle: string;
  city: string;
  state: string;
  category: string;
  categoryTag: string;
  description: string;
  detailedStory: string;
  imageUrl: string;
  distanceKm?: number;
  rating?: number;
  isFavorite?: boolean;
  latitude?: number;
  longitude?: number;
  highlights?: Highlight[];
  visitingInfo: {
    openingHours: string;
    closedDays: string;
    entryFeeIndian: string;
    entryFeeForeigner: string;
    bestTimeToVisit: string;
  };
}

export interface Highlight {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface MarketItem {
  id: string;
  name: string;
  subtitle: string;
  city: string;
  state: string;
  category: string;
  description: string;
  detailedStory: string;
  imageUrl: string;
  dishImages?: string[];
  culinarySignatures: {
    id: string;
    title: string;
    description: string;
  }[];
  visitingInfo: {
    marketHours: string;
    setupTime: string;
    peakCrowd: string;
    gettingThere: string;
  };
}

export interface HeritageBadge {
  id: string;
  title: string;
  monumentName: string;
  location: string;
  icon: string;
  isVerified: boolean;
}

export interface VirtualStamp {
  id: string;
  placeId: string;
  placeName: string;
  city: string;
  state: string;
  category: string;
  stampDate: string;
  stampColor: string;
  iconEmoji: string;
  serialNumber: string;
  stampShape?: 'circle' | 'octagon' | 'seal';
}

export interface HeritageAppService {
  id: string;
  name: string;
  tag: string;
  description: string;
  rating: number;
  size: string;
  author: string;
  actionText: 'Open' | 'Install';
  icon: string;
}

export interface UserProfile {
  name: string;
  role: string;
  level: string;
  location: string;
  explorerId: string;
  monumentsVisited: number;
  badgesCount: number;
  savedCount: number;
  avatarUrl: string;
  visitedPlaceIds?: string[];
}

export type RootStackParamList = {
  MainTabs: undefined;
  MonumentDetail: { monumentId: string };
  MarketDetail: { marketId: string };
  MoreApps: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Nearby: undefined;
  Explore: undefined;
  Profile: undefined;
};
