import type { SiteContent } from '../schema/content';

export const theme = 'bold';

export const sections = [
  { type: 'hero' },
  { type: 'services' },
  { type: 'gallery' },
  { type: 'testimonials' },
  { type: 'about' },
  { type: 'contact' },
];

export const site: SiteContent = {
  business: {
    name: 'Northside Collision Center',
    tagline: 'Restoring Your Vehicle Since 1989',
    description:
      'Northside Collision Center is a locally owned, I-CAR certified collision repair shop serving Alexandria and the lakes area for over 35 years. From auto body repair to fiberglass boat restoration, our team delivers the highest quality work with a repair guarantee for the life of your vehicle.',
    heroImage: '/images/northside/shop1.jpg',
    aboutImage: '/images/northside/shop3.jpg',
    primaryColor: '#1b3a5c',
    accentColor: '#e63946',
  },

  contact: {
    phone: '(320) 763-3224',
    email: 'ncollisioncenter@gmail.com',
    address: {
      street: '1301 Northside Dr NE',
      city: 'Alexandria',
      state: 'MN',
      zip: '56308',
    },
    socials: {
      facebook: 'https://facebook.com/Northsidecollisioncenter',
    },
  },

  hours: {
    timezone: 'America/Chicago',
    regular: [
      { day: 'monday', open: '08:00', close: '17:00' },
      { day: 'tuesday', open: '08:00', close: '17:00' },
      { day: 'wednesday', open: '08:00', close: '17:00' },
      { day: 'thursday', open: '08:00', close: '17:00' },
      { day: 'friday', open: '08:00', close: '17:00' },
      { day: 'saturday', open: '08:00', close: '17:00', closed: true },
      { day: 'sunday', open: '08:00', close: '17:00', closed: true },
    ],
  },

  services: [
    {
      id: 'collision-repair',
      name: 'Collision Repair',
      description:
        'Complete auto body and collision repair for all makes and models. We work with all insurance companies and guarantee our repairs for the life of your vehicle.',
      icon: '🚗',
      featured: true,
    },
    {
      id: 'frame-repair',
      name: 'Unibody & Frame Repair',
      description:
        'Precision frame straightening and unibody repair using state-of-the-art equipment to restore your vehicle to factory specifications.',
      icon: '🔧',
      featured: true,
    },
    {
      id: 'color-matching',
      name: 'In-House Color Matching',
      description:
        'Guaranteed computerized color matching so your repair is seamless and invisible. We mix paint in-house for a perfect match every time.',
      icon: '🎨',
      featured: true,
    },
    {
      id: 'glass-replacement',
      name: 'Glass Replacement',
      description:
        'Windshield and auto glass replacement for all vehicle types. We handle the insurance paperwork for you.',
      icon: '🪟',
      featured: true,
    },
    {
      id: 'boat-repair',
      name: 'Boat & Fiberglass Repair',
      description:
        'Expert fiberglass repair for boats, jet skis, and recreational vehicles. Keep your watercraft looking and performing its best.',
      icon: '⛵',
      featured: true,
    },
    {
      id: 'free-estimates',
      name: 'Free Computerized Estimates',
      description:
        'Get a detailed, computerized estimate at no charge. We provide transparent pricing with no surprises.',
      icon: '📋',
      featured: true,
    },
    {
      id: 'shuttle',
      name: 'Customer Shuttle Service',
      description:
        'Need a ride while your vehicle is in the shop? We offer pickup, delivery, and shuttle service for your convenience.',
      icon: '🚐',
    },
  ],

  team: [
    {
      id: 'duwayne-drum',
      name: 'DuWayne Drum',
      role: 'Owner',
      bio: 'DuWayne founded Northside Collision Center in 1989 and has built it into one of the most trusted body shops in the Alexandria area with over 35 years of experience.',
    },
    {
      id: 'shelly-drum',
      name: 'Shelly Drum',
      role: 'Co-Owner',
      bio: 'Shelly helps manage day-to-day operations and ensures every customer has a smooth, stress-free repair experience.',
    },
  ],

  gallery: [
    { id: 'shop1', src: '/images/northside/shop1.jpg', alt: 'Northside Collision shop', caption: 'Our facility' },
    { id: 'shop2', src: '/images/northside/shop2.jpg', alt: 'Collision repair work area' },
    { id: 'shop3', src: '/images/northside/shop3.jpg', alt: 'Paint and body shop' },
    { id: 'shop4', src: '/images/northside/shop4.jpg', alt: 'Vehicle restoration in progress' },
    { id: 'boat', src: '/images/northside/boat.png', alt: 'Boat fiberglass repair', caption: 'Boat & fiberglass repair', category: 'Boat Repair' },
  ],

  testimonials: [
    {
      id: 'review-1',
      author: 'Google Reviewer',
      text: 'Got a new vehicle and my dog decided to jump up and scratched my door. Stopped by Northside, Jason was able to buff them out, did a fantastic job. Looks better than brand new! Great customer service and team to work with!',
      rating: 5,
      source: 'Google',
    },
    {
      id: 'review-2',
      author: 'Facebook Reviewer',
      text: "We've used Northside Collision multiple times and the result is always the same: extremely satisfied. Stop in — Bob will take care of you!",
      rating: 5,
      source: 'Facebook',
    },
    {
      id: 'review-3',
      author: 'Birdeye Reviewer',
      text: 'Northside Collision did an amazing job repairing our car after an accident. The color match was perfect and you can\'t even tell it was ever damaged. Highly recommend!',
      rating: 5,
      source: 'Google',
    },
    {
      id: 'review-4',
      author: 'Local Customer',
      text: 'Have been going to Northside for years. They always stand behind their work and treat you like family. The repair guarantee gives me total peace of mind.',
      rating: 5,
      source: 'Facebook',
    },
  ],

  announcements: [
    {
      id: 'free-estimate',
      title: 'Free Estimates',
      body: 'Stop by or call for a free computerized estimate. No appointment needed — we work with all insurance companies.',
      type: 'info',
      active: true,
    },
  ],

  seo: {
    title: 'Northside Collision Center — Auto Body Repair in Alexandria, MN',
    description:
      'I-CAR certified collision repair shop in Alexandria, MN. Auto body repair, frame repair, glass replacement, boat fiberglass repair. Free estimates. Serving the lakes area since 1989.',
    keywords: [
      'auto body repair Alexandria MN',
      'collision repair Alexandria',
      'Northside Collision Center',
      'I-CAR certified',
      'boat fiberglass repair',
      'frame repair',
      'glass replacement',
      'free estimate',
    ],
  },

  ui: {
    hero: {
      badge: 'Since 1989',
      ctaPrimary: 'Call Now',
      ctaSecondary: 'Get a Free Estimate',
    },
    nav: {
      ctaLabel: 'Call Now',
    },
    sections: {
      services: 'Our Services',
      about: 'About Northside Collision',
      gallery: 'Shop Gallery',
      testimonials: 'What Our Customers Say',
      contact: 'Contact Us',
    },
    cta: {
      phone: 'Schedule Your Repair',
    },
  },
};
