import type { SiteContent } from '../schema/content';

export const theme = 'editorial';

export const sections = [
  { type: 'hero' },
  { type: 'services' },
  { type: 'about' },
  { type: 'testimonials' },
  { type: 'contact' },
];

export const site: SiteContent = {
  business: {
    name: 'CentraSota Electric',
    tagline: 'Dignity, Integrity, and Honesty in Every Job',
    description:
      'CentraSota Electric is a family-owned electrical contractor based in Alexandria, MN with over 10 years of experience. Owner Jason Schneiderhan and his team are committed to delivering quality electrical work built on dignity, integrity, and honesty. From residential wiring to commercial projects, we do it right.',
    primaryColor: '#1a5276',
    accentColor: '#f39c12',
  },

  contact: {
    phone: '(320) 762-9473',
    email: 'info@centrasotaelectric.com',
    address: {
      street: 'PO Box 381',
      city: 'Alexandria',
      state: 'MN',
      zip: '56308',
    },
  },

  hours: {
    timezone: 'America/Chicago',
    regular: [
      { day: 'monday', open: '07:00', close: '17:00' },
      { day: 'tuesday', open: '07:00', close: '17:00' },
      { day: 'wednesday', open: '07:00', close: '17:00' },
      { day: 'thursday', open: '07:00', close: '17:00' },
      { day: 'friday', open: '07:00', close: '17:00' },
      { day: 'saturday', open: '08:00', close: '12:00' },
      { day: 'sunday', open: '07:00', close: '17:00', closed: true },
    ],
    note: '24/7 emergency service available — call any time.',
  },

  services: [
    {
      id: 'residential-wiring',
      name: 'Residential Wiring',
      description:
        'Complete home wiring and rewiring, panel upgrades, and code corrections for new construction and existing homes.',
      icon: '🏠',
      featured: true,
    },
    {
      id: 'commercial-electrical',
      name: 'Commercial Electrical',
      description:
        'Tenant build-outs, lighting retrofits, and full electrical systems for offices, retail, and industrial spaces.',
      icon: '🏢',
      featured: true,
    },
    {
      id: 'panel-upgrades',
      name: 'Panel Upgrades',
      description:
        'Upgrade outdated fuse boxes and electrical panels to modern, safe breaker systems that meet current code.',
      icon: '⚡',
      featured: true,
    },
    {
      id: 'ev-charger-install',
      name: 'EV Charger Installation',
      description:
        'Level 2 home and commercial EV charger installation with dedicated circuits and permit coordination.',
      icon: '🔌',
      featured: true,
    },
    {
      id: 'generator-install',
      name: 'Generator Installation',
      description:
        'Whole-home and commercial standby generator installation with automatic transfer switches.',
      icon: '🔋',
    },
    {
      id: 'lighting-design',
      name: 'Lighting Design & Install',
      description:
        'Interior and exterior lighting design, recessed lighting, landscape lighting, and LED upgrades.',
      icon: '💡',
    },
    {
      id: 'troubleshooting',
      name: 'Electrical Troubleshooting',
      description:
        'Diagnosis and repair of flickering lights, tripped breakers, faulty outlets, and other electrical issues.',
      icon: '🔍',
    },
    {
      id: 'smart-home',
      name: 'Smart Home Wiring',
      description:
        'Structured wiring for smart thermostats, automated lighting, security systems, and whole-home audio.',
      icon: '📱',
    },
  ],

  team: [
    {
      id: 'jason-schneiderhan',
      name: 'Jason Schneiderhan',
      role: 'Owner',
      bio: 'Jason founded CentraSota Electric and has been serving the Alexandria area for over 10 years. He leads every project with a commitment to dignity, integrity, and honesty.',
    },
  ],

  gallery: [],

  testimonials: [],

  announcements: [
    {
      id: 'family-owned',
      title: 'Family-Owned. Locally Trusted.',
      body: 'CentraSota Electric has been proudly serving Alexandria and Central Minnesota for over 10 years. Call (320) 762-9473 for a free estimate.',
      type: 'info',
      active: true,
    },
  ],

  seo: {
    title: 'CentraSota Electric — Licensed Electrician in Alexandria, MN',
    description:
      'Family-owned electrical contractor serving Alexandria and Central Minnesota for 10+ years. Residential wiring, commercial electrical, panel upgrades, and more. Call (320) 762-9473.',
    keywords: [
      'electrician Alexandria MN',
      'electrical contractor Central Minnesota',
      'CentraSota Electric',
      'panel upgrade',
      'residential electrician',
      'commercial electrician',
      'Jason Schneiderhan',
    ],
  },

  ui: {
    hero: {
      badge: '10+ Years Family Owned',
      ctaPrimary: 'Call Us',
      ctaSecondary: 'Our Services',
    },
    nav: { ctaLabel: 'Call Now' },
    sections: {
      services: 'Our Services',
      about: 'About CentraSota Electric',
      testimonials: 'What Customers Say',
      contact: 'Get a Free Estimate',
    },
    cta: { phone: 'Request Estimate' },
  },
};
