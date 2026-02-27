import type { SiteContent } from '../schema/content';

export const theme = 'suspended';

export const sections = [
  { type: 'hero' },
  { type: 'services' },
  { type: 'testimonials' },
  { type: 'contact' },
];

export const site: SiteContent = {
  business: {
    name: 'Rosengren Lawn Care',
    tagline: '25+ Years of Lawn & Snow Service in Alexandria',
    description:
      'Rosengren Lawn Care has been keeping Alexandria-area properties looking their best for over 25 years. From professional lawn mowing and landscaping to reliable snow removal, we deliver dependable service you can count on season after season.',
    primaryColor: '#262C08',
    accentColor: '#E5723B',
  },
  contact: {
    phone: '(320) 815-3217',
    email: 'ryanrosengren@gctel.net',
    address: { street: '', city: 'Alexandria', state: 'MN', zip: '56308' },
    socials: {
      facebook: 'https://facebook.com/ryguythelawnguy',
    },
  },
  hours: {
    timezone: 'America/Chicago',
    regular: [
      { day: 'monday', open: '07:00', close: '18:00' },
      { day: 'tuesday', open: '07:00', close: '18:00' },
      { day: 'wednesday', open: '07:00', close: '18:00' },
      { day: 'thursday', open: '07:00', close: '18:00' },
      { day: 'friday', open: '07:00', close: '18:00' },
      { day: 'saturday', open: '07:00', close: '18:00', closed: true },
      { day: 'sunday', open: '07:00', close: '18:00', closed: true },
    ],
    note: 'Seasonal hours. Snow removal available 24/7 during winter storms.',
  },
  services: [
    { id: 'lawn-care', name: 'Lawn Care', description: 'Professional mowing, trimming, and edging for residential and commercial properties in Alexandria and surrounding areas.', icon: '🌿', featured: true },
    { id: 'landscaping', name: 'Landscaping', description: 'Full landscaping services including garden design, mulching, planting, and landscape installation to enhance your property.', icon: '🌺', featured: true },
    { id: 'snow-removal', name: 'Snow Removal', description: 'Reliable residential and commercial snow plowing and removal. Available during winter storms to keep your property safe.', icon: '❄️', featured: true },
    { id: 'fall-cleanup', name: 'Fall Clean Up', description: 'Seasonal fall yard cleanup including leaf removal, debris clearing, and bed preparation to get your property ready for winter.', icon: '🍂', featured: true },
    { id: 'shrub-trimming', name: 'Shrub Trimming', description: 'Expert shrub and hedge trimming to keep your landscaping neat, healthy, and looking its best all season.', icon: '✂️', featured: true },
    { id: 'paver-installation', name: 'Paver Installation', description: 'Professional paver installation for patios, walkways, and driveways. Add beauty and function to your outdoor spaces.', icon: '🧱', featured: true },
  ],
  team: [],
  gallery: [],
  testimonials: [
    { id: 'r1', author: 'Long-Time Customer', text: 'Been using Rosengren for over 10 years. They show up on time, do quality work, and the price is always fair. Can\'t ask for more.', rating: 5, source: 'Google' },
    { id: 'r2', author: 'Alexandria Homeowner', text: 'Great snow removal service. They were out plowing our driveway before we even woke up after the last storm. Reliable and dependable.', rating: 5, source: 'Google' },
  ],
  announcements: [],
  seo: {
    title: 'Rosengren Lawn Care — Lawn Service & Snow Removal in Alexandria, MN',
    description: 'Professional lawn mowing, landscaping, and snow removal in Alexandria, MN. Over 25 years of dependable service for residential and commercial properties.',
    keywords: ['lawn care Alexandria MN', 'Rosengren Lawn Care', 'snow removal Alexandria', 'lawn mowing', 'landscaping', 'snow plowing'],
  },

  ui: {
    hero: {
      badge: '25+ Years of Service',
      ctaPrimary: 'Call Us',
      ctaSecondary: 'View Services',
    },
    nav: { ctaLabel: 'Call Now' },
    sections: {
      services: 'Our Services',
      testimonials: 'What Our Customers Say',
      contact: 'Get In Touch',
    },
    cta: { phone: 'Call for a Free Estimate' },
  },
};
