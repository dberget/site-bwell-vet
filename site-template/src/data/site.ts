import type { SiteContent } from '../../schema/content';

export const site: SiteContent = {
  business: {
    name: 'CentraSota Electric',
    tagline: 'Powering Central Minnesota Since 2007',
    description:
      'CentraSota Electric is a full-service electrical contractor serving St. Cloud and the greater Central Minnesota area. From residential rewiring to commercial build-outs, our licensed electricians deliver safe, code-compliant work with honest pricing and reliable scheduling.',
    primaryColor: '#1a5276',
    accentColor: '#f39c12',
  },

  contact: {
    phone: '(320) 555-0173',
    email: 'info@centrasotaelectric.com',
    address: {
      street: '1428 Industrial Blvd',
      city: 'St. Cloud',
      state: 'MN',
      zip: '56301',
    },
    socials: {
      facebook: 'https://facebook.com/centrasotaelectric',
      nextdoor: 'https://nextdoor.com/pages/centrasota-electric',
      yelp: 'https://yelp.com/biz/centrasota-electric',
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
      id: 'mike-larson',
      name: 'Mike Larson',
      role: 'Owner / Master Electrician',
      bio: 'Mike founded CentraSota Electric after 12 years in the field. He holds a Minnesota Master Electrician license and oversees every project personally.',
    },
    {
      id: 'sarah-chen',
      name: 'Sarah Chen',
      role: 'Office Manager',
      bio: 'Sarah keeps the schedule running and handles estimates, invoicing, and customer follow-ups.',
    },
    {
      id: 'jake-mueller',
      name: 'Jake Mueller',
      role: 'Journeyman Electrician',
      bio: 'Jake specializes in residential service and is our go-to for panel upgrades and EV charger installs.',
    },
    {
      id: 'tyler-anderson',
      name: 'Tyler Anderson',
      role: 'Apprentice Electrician',
      bio: 'Tyler is in his third year of apprenticeship, gaining hands-on experience across residential and commercial jobs.',
    },
  ],

  gallery: [
    {
      id: 'panel-upgrade-1',
      src: '/images/gallery/panel-upgrade.jpg',
      alt: 'New 200-amp electrical panel installation',
      caption: '200-amp panel upgrade in a 1970s rambler',
      category: 'Panel Upgrades',
    },
    {
      id: 'ev-charger-1',
      src: '/images/gallery/ev-charger.jpg',
      alt: 'Tesla Wall Connector installed in residential garage',
      caption: 'Level 2 EV charger install — Sartell, MN',
      category: 'EV Chargers',
    },
    {
      id: 'commercial-1',
      src: '/images/gallery/commercial-buildout.jpg',
      alt: 'Commercial lighting and electrical rough-in',
      caption: 'New retail space electrical build-out on Division Street',
      category: 'Commercial',
    },
    {
      id: 'outdoor-lighting-1',
      src: '/images/gallery/outdoor-lighting.jpg',
      alt: 'Landscape lighting along residential walkway',
      caption: 'LED landscape lighting installation',
      category: 'Lighting',
    },
  ],

  testimonials: [
    {
      id: 'review-1',
      author: 'Linda R.',
      text: 'Mike and his crew upgraded our entire panel and rewired the kitchen. They were on time, clean, and explained everything. Highly recommend!',
      rating: 5,
      date: '2025-09-15',
      source: 'Google',
    },
    {
      id: 'review-2',
      author: 'Tom & Diane K.',
      text: 'We called CentraSota for an EV charger install. Jake had it done in half a day and the price was exactly what they quoted. No surprises.',
      rating: 5,
      date: '2025-11-02',
      source: 'Google',
    },
    {
      id: 'review-3',
      author: 'Mark S.',
      text: 'Had an emergency with a tripped main breaker on a Saturday morning. They answered the phone and had someone out within an hour. Lifesaver.',
      rating: 5,
      date: '2026-01-10',
      source: 'Nextdoor',
    },
    {
      id: 'review-4',
      author: 'Jennifer P.',
      text: "We used CentraSota for the electrical in our new build. Great communication throughout the project and passed inspection on the first try.",
      rating: 5,
      date: '2025-07-22',
      source: 'Facebook',
    },
  ],

  announcements: [
    {
      id: 'spring-2026',
      title: 'Spring Booking — Schedule Now',
      body: "Spring is our busiest season. If you have a project planned for March–May, book your spot now to lock in your preferred dates.",
      type: 'info',
      active: true,
      startsAt: '2026-02-01',
      endsAt: '2026-04-30',
    },
    {
      id: 'ev-rebate',
      title: 'Federal EV Charger Tax Credit',
      body: 'Homeowners may qualify for up to $1,000 in federal tax credits for EV charger installation. Ask us for details.',
      type: 'promo',
      active: true,
    },
  ],

  seo: {
    title: 'CentraSota Electric — Licensed Electrician in St. Cloud, MN',
    description:
      'Licensed electrical contractor serving St. Cloud and Central Minnesota. Residential wiring, commercial electrical, panel upgrades, EV charger installation, and 24/7 emergency service.',
    keywords: [
      'electrician St. Cloud MN',
      'electrical contractor Central Minnesota',
      'panel upgrade',
      'EV charger installation',
      'residential electrician',
      'commercial electrician',
      'CentraSota Electric',
    ],
  },
};
