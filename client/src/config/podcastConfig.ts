export const hosts = [
  { 
    id: 'christopher-moore', 
    name: 'Christopher Moore (US)',
    voice: 'ChristopherNeural',
    locale: 'en-US',
    gender: 'Male',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
  },
  { 
    id: 'roger-bennett', 
    name: 'Roger Bennett (US)',
    voice: 'RogerNeural',
    locale: 'en-US',
    gender: 'Male',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100'
  },
  { 
    id: 'ryan-parker', 
    name: 'Ryan Parker (GB)',
    voice: 'RyanNeural',
    locale: 'en-GB',
    gender: 'Male',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100'
  },
  { 
    id: 'jenny-miller', 
    name: 'Jenny Miller (US)',
    voice: 'JennyNeural',
    locale: 'en-US',
    gender: 'Female',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
  },
  { 
    id: 'michelle-davis', 
    name: 'Michelle Davis (US)',
    voice: 'MichelleNeural',
    locale: 'en-US',
    gender: 'Female',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100'
  },
  { 
    id: 'libby-wilson', 
    name: 'Libby Wilson (GB)',
    voice: 'LibbyNeural',
    locale: 'en-GB',
    gender: 'Female',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100'
  },
  { 
    id: 'sonia-clarke', 
    name: 'Sonia Clarke (GB)',
    voice: 'SoniaNeural',
    locale: 'en-GB',
    gender: 'Female',
    imageUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100&h=100'
  }
] as const;

export const guests = [
  { 
    id: 'aria-reynolds', 
    name: 'Aria Reynolds (US)',
    voice: 'AriaNeural',
    locale: 'en-US',
    gender: 'Female',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100'
  },
  { 
    id: 'eric-thompson', 
    name: 'Eric Thompson (US)',
    voice: 'EricNeural',
    locale: 'en-US',
    gender: 'Male',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100'
  },
  { 
    id: 'guy-harrison', 
    name: 'Guy Harrison (US)',
    voice: 'GuyNeural',
    locale: 'en-US',
    gender: 'Male',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100&h=100'
  },
  { 
    id: 'steffan-brooks', 
    name: 'Steffan Brooks (US)',
    voice: 'SteffanNeural',
    locale: 'en-US',
    gender: 'Male',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=100&h=100'
  },
  { 
    id: 'thomas-wright', 
    name: 'Thomas Wright (GB)',
    voice: 'ThomasNeural',
    locale: 'en-GB',
    gender: 'Male',
    imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100&h=100'
  }
] as const;

export type Host = typeof hosts[number]['id'];
export type Guest = typeof guests[number]['id'];