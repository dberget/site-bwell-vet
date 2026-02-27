import type { SiteContent } from '../schema/content';

export const theme = 'editorial';

export const sections = [
  { type: 'hero' },
  { type: 'services' },
  { type: 'testimonials' },
  { type: 'contact' },
];

export const site: SiteContent = {
  business: {
    name: 'Now & Then Antiques',
    tagline: 'Four Floors of Treasures in Downtown Alexandria',
    description:
      'Now & Then Antiques is a premier antique mall located in the historic Farmer\'s National Bank building at the corner of 6th and Broadway in downtown Alexandria, MN. With four floors and over 20 dealers, you\'ll find everything from vintage furniture and collectibles to unique home decor and one-of-a-kind finds.',
    primaryColor: '#5d4037',
    accentColor: '#d4a574',
  },
  contact: {
    phone: '(320) 763-6467',
    email: 'info@nowandthenantiques.com',
    address: { street: '601 Broadway St', city: 'Alexandria', state: 'MN', zip: '56308' },
    socials: { facebook: 'https://facebook.com/nowandthenantiquealexandria' },
  },
  hours: {
    timezone: 'America/Chicago',
    regular: [
      { day: 'monday', open: '10:00', close: '17:00' },
      { day: 'tuesday', open: '10:00', close: '17:00' },
      { day: 'wednesday', open: '10:00', close: '17:00' },
      { day: 'thursday', open: '10:00', close: '17:00' },
      { day: 'friday', open: '10:00', close: '17:00' },
      { day: 'saturday', open: '10:00', close: '17:00' },
      { day: 'sunday', open: '12:00', close: '16:00' },
    ],
    note: 'Open 7 days a week. Extended hours during summer and holidays.',
  },
  services: [
    { id: 'antiques', name: 'Antique Furniture', description: 'Browse four floors of curated antique furniture from dressers and tables to chairs and cabinets. Something for every style and budget.', icon: '🪑', featured: true },
    { id: 'collectibles', name: 'Vintage Collectibles', description: 'Discover vintage toys, glassware, pottery, advertising signs, and collectibles spanning decades of American history.', icon: '🏺', featured: true },
    { id: 'home-decor', name: 'Home Decor', description: 'Unique decorative pieces, artwork, mirrors, lighting, and accessories to give your home character and charm.', icon: '🖼️', featured: true },
    { id: 'jewelry', name: 'Vintage Jewelry', description: 'Estate jewelry, vintage costume pieces, watches, and accessories from multiple dealers with a wide range of styles.', icon: '💍', featured: true },
    { id: 'dealer-space', name: '20+ Dealers', description: 'Over 20 independent dealers offer an ever-changing selection across four floors. New items arriving daily.', icon: '🏪', featured: true },
    { id: 'building', name: 'Historic Building', description: 'Shop in the beautifully preserved former Farmer\'s National Bank building, a downtown Alexandria landmark at the corner of 6th and Broadway.', icon: '🏛️', featured: true },
  ],
  team: [],
  gallery: [],
  testimonials: [
    { id: 'r1', author: 'Yelp Reviewer', text: 'My very favorite antique store in MN. It\'s clean and well curated and there are 4 stories of antiques! We always find something amazing here and everything is priced affordably.', rating: 5, source: 'Yelp' },
    { id: 'r2', author: 'Visitor', text: 'What a gem! Four floors of antiques in a gorgeous old bank building. We spent two hours browsing and still didn\'t see everything. Will definitely be back.', rating: 5, source: 'Google' },
    { id: 'r3', author: 'Alexandria Local', text: 'Great place to find unique gifts and home decor. The dealers have a wonderful variety and the prices are very reasonable for the quality.', rating: 5, source: 'Facebook' },
  ],
  announcements: [],
  seo: {
    title: 'Now & Then Antiques — 4 Floors of Antiques in Downtown Alexandria, MN',
    description: 'Four floors of antiques and collectibles in the historic Farmer\'s National Bank building in downtown Alexandria, MN. 20+ dealers, open 7 days a week.',
    keywords: ['antiques Alexandria MN', 'Now & Then Antiques', 'antique mall', 'vintage collectibles', 'downtown Alexandria', 'antique furniture Minnesota'],
  },

  ui: {
    hero: {
      badge: 'Downtown Alexandria',
      ctaPrimary: 'Visit Us',
      ctaSecondary: 'What We Offer',
    },
    nav: { ctaLabel: 'Call Now' },
    sections: {
      services: 'Discover Four Floors of Treasures',
      testimonials: 'What Visitors Say',
      contact: 'Plan Your Visit',
    },
    cta: { phone: 'Call Us' },
  },
};
