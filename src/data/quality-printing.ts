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
    name: 'Quality Printing Co.',
    tagline: 'Fast, Friendly & Fully Functional Since 1980',
    description:
      'Quality Printing Co. has been serving Alexandria and the surrounding lakes area for over 45 years. From business cards to booklets, brochures to custom printing — we deliver professional results with fast turnaround and friendly service. Free local delivery available.',
    primaryColor: '#2d3436',
    accentColor: '#0984e3',
  },

  contact: {
    phone: '(320) 762-0606',
    email: 'info@qualityprintingmn.com',
    address: {
      street: '2020 Fillmore St',
      city: 'Alexandria',
      state: 'MN',
      zip: '56308',
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
      id: 'business-cards',
      name: 'Business Cards',
      description: 'Professional business cards printed on premium stock with a variety of finishes. Make a lasting first impression.',
      icon: '💼',
      featured: true,
    },
    {
      id: 'brochures',
      name: 'Brochures & Booklets',
      description: 'Full-color brochures and booklets for marketing, events, and information. Multiple fold and binding options available.',
      icon: '📖',
      featured: true,
    },
    {
      id: 'custom-printing',
      name: 'Custom Printing',
      description: 'From door hangers to pocket folders, we handle custom print jobs of any size. Tell us what you need and we\'ll make it happen.',
      icon: '🖨️',
      featured: true,
    },
    {
      id: 'copies',
      name: 'Copies & Quick Print',
      description: 'Fast, high-quality copies in black & white or full color. Walk-ins welcome for same-day service.',
      icon: '📄',
      featured: true,
    },
    {
      id: 'forms',
      name: 'Carbonless Forms & Checks',
      description: 'Custom carbonless forms, invoices, receipts, and check printing for your business. Keep your paperwork professional.',
      icon: '📝',
      featured: true,
    },
    {
      id: 'marketing',
      name: 'Postcards & Newsletters',
      description: 'Eye-catching postcards, newsletters, and direct mail pieces to keep your customers engaged and informed.',
      icon: '✉️',
      featured: true,
    },
    {
      id: 'letterhead',
      name: 'Letterhead & Envelopes',
      description: 'Branded letterhead, envelopes, and stationery that reinforce your professional image with every correspondence.',
      icon: '📨',
    },
    {
      id: 'labels',
      name: 'Labels & Stickers',
      description: 'Custom labels, stickers, and decals in any size or shape. Perfect for products, packaging, and promotions.',
      icon: '🏷️',
    },
  ],

  team: [],

  gallery: [],

  testimonials: [
    {
      id: 'review-1',
      author: 'Lindsey H.',
      text: "Can I give 6 stars? DON'T PRINT ANYWHERE ELSE! Seriously the best! Quality has never failed me or my small business. Colors are true to order. Everything looks very professional every time.",
      rating: 5,
      source: 'Google',
    },
    {
      id: 'review-2',
      author: 'Google Reviewer',
      text: 'Lightning fast, beautiful copies, friendliest people... nice!',
      rating: 5,
      source: 'Google',
    },
    {
      id: 'review-3',
      author: 'Google Reviewer',
      text: 'Above and beyond service! They always deliver exactly what I need, on time and at a fair price.',
      rating: 5,
      source: 'Google',
    },
  ],

  announcements: [],

  seo: {
    title: 'Quality Printing Co. — Professional Printing in Alexandria, MN',
    description:
      'Full-service printing company in Alexandria, MN. Business cards, brochures, booklets, custom printing, copies, and more. Fast turnaround, friendly service. Serving the lakes area since 1980.',
    keywords: [
      'printing Alexandria MN',
      'Quality Printing',
      'business cards Alexandria',
      'brochures',
      'custom printing',
      'copies',
      'print shop',
    ],
  },

  ui: {
    hero: {
      badge: 'Since 1980',
      ctaPrimary: 'Get a Quote',
      ctaSecondary: 'Our Services',
    },
    nav: { ctaLabel: 'Call Now' },
    sections: {
      services: 'Printing Services',
      testimonials: 'What Our Customers Say',
      contact: 'Get In Touch',
    },
    cta: { phone: 'Call for a Quote' },
  },
};
