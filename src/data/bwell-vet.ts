import type { SiteContent } from '../schema/content';

export const theme = 'default';

export const sections = [
  { type: 'hero' },
  { type: 'services' },
  { type: 'about' },
  { type: 'testimonials' },
  { type: 'contact' },
];

export const site: SiteContent = {
  business: {
    name: 'B Well Veterinary Service',
    tagline: 'Compassionate Care for Your Companion',
    description:
      'B Well Veterinary Service (formerly Douglas County Animal) provides compassionate small animal care in Alexandria, MN. Located at 3901 Highway 29 S, we offer wellness exams, vaccinations, surgical procedures, and personalized treatment plans. Our caring staff believes every pet deserves attentive, individualized care.',
    primaryColor: '#1a6b5c',
    accentColor: '#d4883a',
  },
  contact: {
    phone: '(320) 762-1575',
    email: 'bwellveterinaryservice@gmail.com',
    address: { street: '3901 Highway 29 S', city: 'Alexandria', state: 'MN', zip: '56308' },
    socials: {
      facebook: 'https://facebook.com/p/B-Well-Veterinary-Service-100057131122291',
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
    note: 'Call to schedule an appointment.',
  },
  services: [
    { id: 'wellness', name: 'Wellness Exams', description: 'Comprehensive annual checkups to keep your pet healthy and catch potential issues early.', icon: '🩺', featured: true },
    { id: 'vaccinations', name: 'Vaccinations', description: 'Core and lifestyle vaccinations to protect your dog or cat from common and serious diseases.', icon: '💉', featured: true },
    { id: 'surgery', name: 'Surgical Procedures', description: 'Spay, neuter, dental cleanings, mass removals, and other surgical services in a safe, caring environment.', icon: '🏥', featured: true },
    { id: 'integrative', name: 'Integrative Care', description: 'A holistic approach combining traditional veterinary medicine with integrative treatments tailored to your pet\'s unique needs.', icon: '🌿', featured: true },
    { id: 'dental', name: 'Dental Care', description: 'Professional dental cleanings and oral health assessments to prevent disease and keep your pet comfortable.', icon: '🦷', featured: true },
    { id: 'diagnostics', name: 'Diagnostics', description: 'In-house lab work, X-rays, and diagnostic testing for accurate, timely diagnosis and treatment.', icon: '🔬', featured: true },
  ],
  team: [
    { id: 'dr-costello', name: 'Dr. Kaitlin Costello', role: 'Veterinarian', bio: 'Dr. Costello leads B Well Veterinary Service with a passion for integrative small animal medicine and a commitment to compassionate, individualized care.' },
    { id: 'michelle', name: 'Michelle', role: 'Veterinary Technician', bio: 'Michelle supports Dr. Costello and helps ensure every patient and pet parent has a positive, comfortable experience.' },
  ],
  gallery: [],
  testimonials: [
    { id: 'r1', author: 'Facebook Reviewer', text: 'Great customer service, very understanding staff, highly recommended!', rating: 5, source: 'Facebook' },
    { id: 'r2', author: 'Facebook Reviewer', text: 'Best prices in town.', rating: 5, source: 'Facebook' },
    { id: 'r3', author: 'Facebook Reviewer', text: 'Such caring people to serve my pets!!', rating: 5, source: 'Facebook' },
  ],
  announcements: [
    { id: 'discounts', title: 'Military & Service Animal Discounts', body: 'We proudly offer discounts for service animals and military families. Ask us about our programs.', type: 'info', active: true },
  ],
  seo: {
    title: 'B Well Veterinary Service — Small Animal Vet in Alexandria, MN',
    description: 'Integrative small animal veterinary care in Alexandria, MN. Wellness exams, vaccinations, surgery, dental care, and holistic treatments. Military and service animal discounts.',
    keywords: ['veterinarian Alexandria MN', 'B Well Veterinary', 'small animal vet', 'integrative vet care', 'pet vaccinations', 'dog vet Alexandria'],
  },

  ui: {
    hero: {
      badge: 'Integrative Small Animal Care',
      ctaPrimary: 'Call Us',
      ctaSecondary: 'Our Services',
    },
    nav: { ctaLabel: 'Call Now' },
    sections: {
      services: 'Compassionate Care for Your Pet',
      about: 'Meet Our Team',
      testimonials: 'What Pet Parents Say',
      contact: 'Schedule a Visit',
    },
    cta: { phone: 'Schedule Appointment' },
  },
};
