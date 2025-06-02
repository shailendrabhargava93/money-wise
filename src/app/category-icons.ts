export interface CategoryData {
  name: string;
  icon: string;
  description: string;
}

export const CATEGORIES: CategoryData[] = [
  {
    name: 'Shopping',
    icon: '🛍️',
    description: 'Clothing, accessories, and retail purchases'
  },
  {
    name: 'Bills',
    icon: '📄',
    description: 'Monthly bills and recurring payments'
  },
  {
    name: 'Housing',
    icon: '🏠',
    description: 'Rent, mortgage, and home maintenance'
  },
  {
    name: 'Food',
    icon: '🍽️',
    description: 'Dining out and restaurant expenses'
  },
  {
    name: 'Fuel',
    icon: '⛽',
    description: 'Gas and vehicle fuel costs'
  },
  {
    name: 'Groceries',
    icon: '🛒',
    description: 'Food shopping and household supplies'
  },
  {
    name: 'Healthcare',
    icon: '🏥',
    description: 'Medical expenses and health services'
  },
  {
    name: 'Internet',
    icon: '🌐',
    description: 'Internet, phone, and communication services'
  },
  {
    name: 'Entertainment',
    icon: '🎬',
    description: 'Movies, games, and leisure activities'
  },
  {
    name: 'Travel',
    icon: '✈️',
    description: 'Vacation, trips, and travel expenses'
  },
  {
    name: 'Subscriptions',
    icon: '📺',
    description: 'Streaming, apps, and recurring services'
  },
  {
    name: 'Transportation',
    icon: '🚗',
    description: 'Public transport, taxi, and ride sharing'
  },
  {
    name: 'Fitness',
    icon: '🏋️',
    description: 'Gym, sports, and wellness activities'
  },
  {
    name: 'Other',
    icon: '🗃️',
    description: 'Miscellaneous and uncategorized expenses'
  },
  {
    name: 'Utilities',
    icon: '💡',
    description: 'Electricity, water, and home utilities'
  }
];

export enum CAT_ICON {
  'Shopping' = '🛍️',
  'Bills' = '📄',
  'Housing' = '🏠',
  'Food' = '🍽️',
  'Fuel' = '⛽',
  'Groceries' = '🛒',
  'Healthcare' = '🏥',
  'Internet' = '🌐',
  'Entertainment' = '🎬',
  'Travel' = '✈️',
  'Subscriptions' = '📺',
  'Transportation' = '🚗',
  'Fitness' = '🏋️',
  'Other' = '🗃️',
  'Utilities' = '💡'
}

export enum LABEL_ICON {
  'Shailendra' = 'user-male',
  'Tanya' = 'user-female',
}
