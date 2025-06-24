export interface CategoryConfig {
  name: string;
  icon: string;
  description: string;
  bgColor: string;
  textColor?: string; // optional for future use
}

export const CATEGORY_CONFIG: { [key: string]: CategoryConfig } = {
  'Shopping': {
    name: 'Shopping',
    icon: '🛍️',
    description: 'Clothing, accessories, and retail purchases',
    bgColor: 'bg-purple-100'
  },
  'Bills': {
    name: 'Bills',
    icon: '📄',
    description: 'Monthly bills and recurring payments',
    bgColor: 'bg-gray-100'
  },
  'Housing': {
    name: 'Housing',
    icon: '🏠',
    description: 'Rent, mortgage, and home maintenance',
    bgColor: 'bg-orange-100'
  },
  'Food': {
    name: 'Food',
    icon: '🍽️',
    description: 'Dining out and restaurant expenses',
    bgColor: 'bg-sky-100'
  },
  'Fuel': {
    name: 'Fuel',
    icon: '⛽',
    description: 'Gas and vehicle fuel costs',
    bgColor: 'bg-red-100'
  },
  'Groceries': {
    name: 'Groceries',
    icon: '🛒',
    description: 'Food shopping and household supplies',
    bgColor: 'bg-gray-100'
  },
  'Healthcare': {
    name: 'Healthcare',
    icon: '🏥',
    description: 'Medical expenses and health services',
    bgColor: 'bg-orange-100'
  },
  'Internet': {
    name: 'Internet',
    icon: '🌐',
    description: 'Internet, phone, and communication services',
    bgColor: 'bg-blue-100'
  },
  'Entertainment': {
    name: 'Entertainment',
    icon: '🎬',
    description: 'Movies, games, and leisure activities',
    bgColor: 'bg-purple-100'
  },
  'Travel': {
    name: 'Travel',
    icon: '✈️',
    description: 'Vacation, trips, and travel expenses',
    bgColor: 'bg-sky-100'
  },
  'Subscriptions': {
    name: 'Subscriptions',
    icon: '📺',
    description: 'Streaming, apps, and recurring services',
    bgColor: 'bg-gray-100'
  },
  'Transportation': {
    name: 'Transportation',
    icon: '🚗',
    description: 'Public transport, taxi, and ride sharing',
    bgColor: 'bg-red-100'
  },
  'Fitness': {
    name: 'Fitness',
    icon: '🏋️',
    description: 'Gym, sports, and wellness activities',
    bgColor: 'bg-orange-100'
  },
  'Other': {
    name: 'Other',
    icon: '🗃️',
    description: 'Miscellaneous and uncategorized expenses',
    bgColor: 'bg-yellow-100'
  },
  'Utilities': {
    name: 'Utilities',
    icon: '💡',
    description: 'Electricity, water, and home utilities',
    bgColor: 'bg-amber-100'
  }
};

// Export as array for dropdowns/lists (derived from the config)
export const CATEGORIES: CategoryConfig[] = Object.values(CATEGORY_CONFIG);

// Export enum for backward compatibility (derived from the config)
export const CAT_ICON = Object.keys(CATEGORY_CONFIG).reduce((acc, key) => {
  acc[key as keyof typeof acc] = CATEGORY_CONFIG[key].icon;
  return acc;
}, {} as { [K in keyof typeof CATEGORY_CONFIG]: string });

// Helper function to get category config
export function getCategoryConfig(categoryName: string): CategoryConfig {
  return CATEGORY_CONFIG[categoryName] || {
    name: 'Unknown',
    icon: '📦',
    description: 'Unknown category',
    bgColor: 'bg-indigo-50'
  };
}

export enum LABEL_ICON {
  'Shailendra' = 'user-male',
  'Tanya' = 'user-female',
}
