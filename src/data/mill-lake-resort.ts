import type { SiteContent } from '../schema/content';

export const theme = 'suspended';

export const sections = [
  { type: 'hero' },
  { type: 'services' },
  { type: 'gallery' },
  { type: 'testimonials' },
  { type: 'contact' },
];

export const site: SiteContent = {
  business: {
    name: 'Mill Lake Resort',
    tagline: "Memories you'll want to come back to",
    description:
      'Mill Lake Resort is a private peninsula resort on a beautiful spring-fed lake in Farwell, MN — just 8 miles west of Alexandria and 5 minutes off I-94. With 1,400 feet of lakeshore, 7 park-like acres, a sandy beach, swimming raft, playground, and excellent fishing, it\'s the perfect Minnesota lake getaway for your whole family.',
    heroImage: '/images/mill-lake/hero.jpg',
    primaryColor: '#1a5276',
    accentColor: '#27ae60',
  },
  contact: {
    phone: '(320) 886-5381',
    email: 'info@milllakeresort.com',
    address: { street: '3551 W Mill Lake Rd SW', city: 'Farwell', state: 'MN', zip: '56327' },
    socials: {
      facebook: 'https://facebook.com/MillLakeResort',
    },
  },
  hours: {
    timezone: 'America/Chicago',
    regular: [
      { day: 'monday', open: '08:00', close: '20:00' },
      { day: 'tuesday', open: '08:00', close: '20:00' },
      { day: 'wednesday', open: '08:00', close: '20:00' },
      { day: 'thursday', open: '08:00', close: '20:00' },
      { day: 'friday', open: '08:00', close: '20:00' },
      { day: 'saturday', open: '08:00', close: '20:00' },
      { day: 'sunday', open: '08:00', close: '20:00' },
    ],
    note: 'Open seasonally May through September. Call for availability and reservations.',
  },
  services: [
    { id: 'peninsula', name: 'Private Peninsula Setting', description: 'Enjoy our private peninsula with 1,400 feet of lakeshore on 7 beautiful park-like acres. A rare and peaceful escape.', icon: '🏝️', featured: true },
    { id: 'beach', name: 'Sandy Beach & Swimming Raft', description: 'Relax and swim from our sandy beach with a swimming raft just offshore — perfect for kids and adults alike.', icon: '🏖️', featured: true },
    { id: 'fishing', name: 'Fishing', description: 'Excellent fishing on a spring-fed lake. Cast from shore or bring your boat and enjoy the open water.', icon: '🎣', featured: true },
    { id: 'playground', name: 'Playground & Yard Games', description: 'Playground equipment and yard games to keep the whole family entertained all day long.', icon: '🎪', featured: true },
    { id: 'trail', name: 'Central Lake Trail Nearby', description: 'The Central Lake Trail is just minutes away for cycling, hiking, and exploring the beautiful Central Minnesota landscape.', icon: '🚴', featured: true },
    { id: 'location', name: 'Easy Access Location', description: 'Just 8 miles west of Alexandria and 5 minutes off I-94 — easy to get to and easy to love.', icon: '📍', featured: true },
  ],
  team: [],
  gallery: [
    { id: 'aerial', src: '/images/mill-lake/aerial.jpg', alt: 'Aerial view of Mill Lake Resort', caption: 'Aerial view of the resort on 600-acre Mill Lake' },
    { id: 'cabins', src: '/images/mill-lake/cabins.jpg', alt: 'Mill Lake Resort cabins', caption: 'Our lakeside cabins' },
    { id: 'playground', src: '/images/mill-lake/playground.jpg', alt: 'Resort playground area', caption: 'Family playground' },
  ],
  testimonials: [
    { id: 'r1', author: 'Returning Family', text: 'We\'ve been coming to Mill Lake Resort for five years straight. The cabins are clean, the fishing is great, and the kids love the beach. It\'s our happy place.', rating: 5, source: 'Google' },
    { id: 'r2', author: 'First-Time Guest', text: 'What a hidden gem! The lake is gorgeous, not too crowded, and the resort has everything you need. We\'ll definitely be back.', rating: 5, source: 'Google' },
    { id: 'r3', author: 'Fishing Enthusiast', text: 'Caught my limit of walleye two days in a row. The spring-fed water keeps this lake healthy. Great fishing and a beautiful, quiet setting.', rating: 5, source: 'Google' },
  ],
  announcements: [
    { id: 'booking', title: 'Book Your 2026 Summer Getaway', body: 'Cabins are filling up fast for summer 2026. Call (320) 886-5381 to reserve your stay.', type: 'promo', active: true },
  ],
  seo: {
    title: 'Mill Lake Resort — Cabins & Fishing Near Alexandria, MN',
    description: '7 lakeside cabins on 600-acre Mill Lake near Alexandria, MN. Walleye fishing, sand beach, water sports, and family fun. Book your Minnesota lake vacation.',
    keywords: ['resort Alexandria MN', 'Mill Lake Resort', 'cabin rental', 'walleye fishing Minnesota', 'family resort', 'lake vacation', 'sand beach'],
  },

  ui: {
    hero: {
      badge: 'Family Resort',
      ctaPrimary: 'Reserve Your Cabin',
      ctaSecondary: 'What We Offer',
    },
    nav: { ctaLabel: 'Book Now' },
    sections: {
      services: 'Cabins & Activities',
      testimonials: 'What Our Guests Say',
      contact: 'Ready to Make Some Memories?',
    },
    cta: { phone: 'Call to Reserve' },
  },
};
