import type { SiteContent } from '../schema/content';

export const theme = 'default';

export const sections = [
  { type: 'hero' },
  { type: 'services' },
  { type: 'gallery' },
  { type: 'testimonials' },
  { type: 'contact' },
  { type: 'about' },
];

export const site: SiteContent = {
  business: {
    name: 'Lennes Bros. Electric',
    tagline: 'Helping You Maintain the Flow Since 2003',
    description:
      'Lennes Bros. Electric is a family-owned electrical contractor serving Alexandria, Long Prairie, and the greater Central Minnesota area. From residential wiring to commercial projects and agricultural electrical, our licensed electricians deliver reliable, professional service with a satisfaction guarantee.',
    heroImage: '/images/lennes/gallery-01.jpg',
    primaryColor: '#1a472a',
    accentColor: '#f0a500',
  },

  contact: {
    phone: '(320) 762-1500',
    email: 'lennesbros@earthlink.net',
    address: {
      street: '2605 Aga Dr Ste 7',
      city: 'Alexandria',
      state: 'MN',
      zip: '56308',
    },
    socials: {
      facebook: 'https://facebook.com/p/Lennes-Bros-Electric-Inc-100050863462719',
    },
  },

  hours: {
    timezone: 'America/Chicago',
    regular: [
      { day: 'monday', open: '08:00', close: '18:00' },
      { day: 'tuesday', open: '08:00', close: '18:00' },
      { day: 'wednesday', open: '08:00', close: '18:00' },
      { day: 'thursday', open: '08:00', close: '18:00' },
      { day: 'friday', open: '08:00', close: '18:00' },
      { day: 'saturday', open: '08:00', close: '18:00', closed: true },
      { day: 'sunday', open: '08:00', close: '18:00', closed: true },
    ],
    note: 'Same-day emergency service available — call anytime.',
  },

  services: [
    {
      id: 'residential',
      name: 'Residential Electrical',
      description:
        'Complete home wiring, rewiring, panel upgrades, and electrical repairs. New construction and remodel specialists.',
      icon: '🏠',
      featured: true,
    },
    {
      id: 'commercial',
      name: 'Commercial Electrical',
      description:
        'Electrical systems for restaurants, retail, churches, and commercial spaces. Full-service from design to installation.',
      icon: '🏢',
      featured: true,
    },
    {
      id: 'industrial',
      name: 'Industrial Electrical',
      description:
        'Industrial wiring, machinery connections, three-phase power, and electrical systems for manufacturing and processing facilities.',
      icon: '🏭',
      featured: true,
    },
    {
      id: 'agricultural',
      name: 'Agricultural Electrical',
      description:
        'Farm wiring, grain bin systems, livestock facility electrical, and rural power solutions. We understand ag.',
      icon: '🌾',
      featured: true,
    },
    {
      id: 'generators',
      name: 'Generator Sales & Service',
      description:
        'Standby generator installation, repair, and maintenance. Keep your home or business running when the power goes out.',
      icon: '⚡',
      featured: true,
    },
    {
      id: 'service-upgrades',
      name: 'Service Upgrades',
      description:
        'Electrical panel and service upgrades to meet modern demands. Upgrade from fuses to breakers safely and to code.',
      icon: '🔌',
      featured: true,
    },
    {
      id: 'security',
      name: 'Security & CCTV Systems',
      description:
        'Closed circuit TV installation and security system wiring for homes, farms, and businesses.',
      icon: '📹',
      featured: true,
    },
    {
      id: 'emergency',
      name: 'Emergency Service',
      description:
        'Same-day emergency electrical service. When you need help fast, Lennes Bros. is there.',
      icon: '🚨',
    },
  ],

  team: [
    {
      id: 'mike-lennes',
      name: 'Mike Lennes',
      role: 'Owner',
      bio: 'Mike co-founded Lennes Bros. Electric in 2003 and oversees operations across both the Alexandria and Long Prairie locations.',
    },
    {
      id: 'brian-lennes',
      name: 'Brian Lennes',
      role: 'Co-Owner / Operator',
      bio: 'Brian handles day-to-day field operations and brings hands-on expertise to every project, from residential to agricultural.',
    },
  ],

  gallery: [
    { id: 'gallery-01', src: '/images/lennes/gallery-01.jpg', alt: 'Lennes Bros. electrical project', caption: 'Recent project' },
    { id: 'gallery-02', src: '/images/lennes/gallery-02.jpg', alt: 'Electrical installation work' },
    { id: 'gallery-03', src: '/images/lennes/gallery-03.png', alt: 'Electrical panel work' },
    { id: 'gallery-04', src: '/images/lennes/gallery-04.jpg', alt: 'Wiring project' },
    { id: 'gallery-05', src: '/images/lennes/gallery-05.jpg', alt: 'Completed electrical job' },
    { id: 'gallery-06', src: '/images/lennes/gallery-06.jpg', alt: 'Electrical installation' },
    { id: 'residential', src: '/images/lennes/residential.jpg', alt: 'Residential electrical work', caption: 'Residential', category: 'Residential' },
    { id: 'commercial', src: '/images/lennes/commercial.png', alt: 'Commercial electrical project', caption: 'Commercial', category: 'Commercial' },
    { id: 'industrial', src: '/images/lennes/industrial.jpg', alt: 'Industrial electrical installation', caption: 'Industrial', category: 'Industrial' },
    { id: 'agricultural', src: '/images/lennes/agricultural.jpg', alt: 'Agricultural electrical work', caption: 'Agricultural', category: 'Agricultural' },
  ],

  testimonials: [
    {
      id: 'review-1',
      author: 'Angi Reviewer',
      text: 'Brian at Lennes Bros. came out to give us a generator estimate. Very professional, knowledgeable, and gave us a fair price. Would definitely recommend.',
      rating: 5,
      source: 'Angi',
    },
    {
      id: 'review-2',
      author: 'Local Customer',
      text: 'We\'ve used Lennes Bros. for all the electrical work on our farm. They understand agricultural wiring and always get the job done right.',
      rating: 5,
      source: 'Google',
    },
    {
      id: 'review-3',
      author: 'Alexandria Homeowner',
      text: 'Called for an emergency and they had someone out the same day. Professional, clean work, and fair pricing. Our go-to electricians now.',
      rating: 5,
      source: 'Google',
    },
  ],

  announcements: [
    {
      id: 'two-locations',
      title: 'Two Locations to Serve You',
      body: 'Now serving you from Alexandria (320-762-1500) and Long Prairie (320-533-3331).',
      type: 'info',
      active: true,
    },
  ],

  seo: {
    title: 'Lennes Bros. Electric — Licensed Electrician in Alexandria & Long Prairie, MN',
    description:
      'Family-owned electrical contractor serving Alexandria and Long Prairie, MN. Residential, commercial, and agricultural electrical. Generator installation and repair. BBB A+ rated. Free estimates.',
    keywords: [
      'electrician Alexandria MN',
      'electrician Long Prairie MN',
      'Lennes Bros Electric',
      'agricultural electrical',
      'generator installation',
      'residential wiring',
      'commercial electrician',
      'BBB A+',
    ],
  },

  ui: {
    hero: {
      badge: 'Since 2003',
      ctaPrimary: 'Call Us Today',
      ctaSecondary: 'Request an Estimate',
    },
    nav: {
      ctaLabel: 'Free Estimates',
    },
    sections: {
      services: 'Electrical Services for Every Need',
      about: 'Family Owned. Locally Operated.',
      gallery: 'Quality Work Across Central Minnesota',
      testimonials: 'What Our Customers Say',
      contact: 'Two Locations to Serve You',
    },
    cta: {
      phone: 'Call for a Free Estimate',
    },
  },
};
