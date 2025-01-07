export const hosts = [
  { 
    id: 'john-lewis', 
    name: 'John Lewis',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100'
  },
  { 
    id: 'stephanie-hall', 
    name: 'Stephanie Hall',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100'
  }
] as const;

export const guests = [
  { 
    id: 'kevin-booker', 
    name: 'Kevin Booker',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
  },
  { 
    id: 'sarah-cooper', 
    name: 'Sarah Cooper',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
  }
] as const;

export type Host = typeof hosts[number]['id'];
export type Guest = typeof guests[number]['id'];