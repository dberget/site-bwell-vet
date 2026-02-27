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
    name: 'Boyd Lawn Co.',
    tagline: 'Professional Turf & Tree Health for West Central Minnesota',
    description:
      'Boyd Lawn Co. provides professional lawn care, tree health, and pest management services for residential and commercial properties across West Central Minnesota. We use responsible methods with safer materials, natural fertilizers, and least-toxic pesticides to keep your property healthy and beautiful.',
    primaryColor: '#2d5016',
    accentColor: '#7cb342',
  },
  contact: {
    phone: '(320) 287-3297',
    email: 'steve@boydlawnco.com',
    address: { street: '12590 County Road 3', city: 'Kensington', state: 'MN', zip: '56343' },
    socials: { facebook: 'https://facebook.com/boydlawncompany' },
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
    note: 'Call for seasonal availability.',
  },
  services: [
    { id: 'lawn-care', name: 'Lawn Care & Mowing', description: 'Professional mowing, edging, and lawn maintenance for residential and commercial properties.', icon: '🌿', featured: true },
    { id: 'weed-control', name: 'Weed Control', description: 'Targeted weed management using responsible, least-toxic methods to keep your lawn clean and healthy.', icon: '🌱', featured: true },
    { id: 'fertilization', name: 'Fertilization & Turf Health', description: 'Custom fertilization programs using natural fertilizers to promote thick, green, healthy turf all season long.', icon: '💚', featured: true },
    { id: 'tree-care', name: 'Tree & Shrub Care', description: 'Professional tree trimming, shrub care, and tree spraying to protect and maintain your landscape.', icon: '🌳', featured: true },
    { id: 'disease-control', name: 'Disease Control', description: 'Lawn disease diagnosis and treatment using responsible methods to protect your turf from fungal and other diseases.', icon: '🛡️', featured: true },
    { id: 'insect-mgmt', name: 'Insect Management', description: 'Targeted insect management for lawns and landscapes. We identify the problem and treat it at the source.', icon: '🐛', featured: true },
  ],
  team: [
    { id: 'steve-boyd', name: 'Steve Boyd', role: 'Owner / Certified Lawn Care Technician', bio: 'Steve is a Landscape Industry Certified Lawn Care Technician committed to responsible, effective turf and tree health management across West Central Minnesota.' },
  ],
  gallery: [],
  testimonials: [
    { id: 'r1', author: 'Facebook Reviewer', text: 'Steve does an excellent job with our lawn. Very professional, reliable, and always on time. Our yard has never looked better.', rating: 5, source: 'Facebook' },
    { id: 'r2', author: 'Local Customer', text: 'Love that they use safer, more natural products. With kids and dogs in the yard, that matters to us. Great results too.', rating: 5, source: 'Facebook' },
    { id: 'r3', author: 'Starbuck Homeowner', text: 'Been using Boyd Lawn for three years now. Dependable service and fair pricing. Highly recommend for the area.', rating: 5, source: 'Facebook' },
  ],
  announcements: [
    { id: 'service-area', title: 'Serving West Central MN', body: 'Proudly serving Morris, Alexandria, Starbuck, Glenwood, Benson, and surrounding communities.', type: 'info', active: true },
  ],
  seo: {
    title: 'Boyd Lawn Co. — Lawn Care & Tree Health in Kensington, MN',
    description: 'Professional lawn care, weed control, fertilization, tree care, and mosquito control in West Central Minnesota. Serving Morris, Alexandria, Starbuck, Glenwood and surrounding areas.',
    keywords: ['lawn care Kensington MN', 'Boyd Lawn Co', 'weed control Alexandria MN', 'tree care Starbuck MN', 'mosquito control', 'lawn service West Central Minnesota'],
  },

  ui: {
    hero: {
      badge: 'Landscape Industry Certified',
      ctaPrimary: 'Call Us',
      ctaSecondary: 'Our Services',
    },
    nav: { ctaLabel: 'Call Now' },
    sections: {
      services: 'Our Services',
      about: 'Responsible Methods. Real Results.',
      testimonials: 'What Our Customers Say',
      contact: 'Contact Us',
    },
    cta: { phone: 'Call Us' },
  },
};
