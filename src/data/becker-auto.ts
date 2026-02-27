import type { SiteContent } from '../schema/content';

export const theme = 'bold';

export const sections = [
  { type: 'hero' },
  { type: 'services' },
  { type: 'gallery' },
  { type: 'about' },
  { type: 'testimonials' },
  { type: 'contact' },
];

export const site: SiteContent = {
  business: {
    name: 'Becker Auto Repair',
    tagline: 'Honest Auto Repair Since 1994',
    description:
      'Becker Auto Repair has been providing honest, reliable auto repair and maintenance in Alexandria, MN for over 30 years. Our ASE-certified technicians handle everything from oil changes to engine diagnostics. We treat every vehicle like our own.',
    heroImage: '/images/becker/banner.jpg',
    aboutImage: '/images/becker/shop2.jpg',
    primaryColor: '#263238',
    accentColor: '#ff6f00',
  },
  contact: {
    phone: '(320) 762-8060',
    email: 'info@beckerautorepair.com',
    address: { street: '1811 S Nokomis Street Suite B', city: 'Alexandria', state: 'MN', zip: '56308' },
    socials: {
      facebook: 'https://facebook.com/p/Becker-Auto-Repair-100031192286521',
    },
  },
  hours: {
    timezone: 'America/Chicago',
    regular: [
      { day: 'monday', open: '07:30', close: '17:30' },
      { day: 'tuesday', open: '07:30', close: '17:30' },
      { day: 'wednesday', open: '07:30', close: '17:30' },
      { day: 'thursday', open: '07:30', close: '17:30' },
      { day: 'friday', open: '07:30', close: '15:30' },
      { day: 'saturday', open: '07:30', close: '17:30', closed: true },
      { day: 'sunday', open: '07:30', close: '17:30', closed: true },
    ],
  },
  services: [
    { id: 'oil-change', name: 'Oil Changes', description: 'Quick, affordable oil changes with quality filters and fluids. Keep your engine running smooth.', icon: '🛢️', featured: true },
    { id: 'brakes', name: 'Brake Service', description: 'Brake inspection, pad replacement, rotor resurfacing, and complete brake system repair.', icon: '🛑', featured: true },
    { id: 'diagnostics', name: 'Engine Diagnostics', description: 'Computerized engine diagnostics to identify and fix check engine lights, performance issues, and electrical problems.', icon: '🔧', featured: true },
    { id: 'ac-repair', name: 'AC Repair', description: 'Full air conditioning system diagnosis and repair. Stay cool with a properly functioning AC system.', icon: '❄️', featured: true },
    { id: 'transmission', name: 'Transmission Service', description: 'Transmission repair, fluid service, and maintenance for automatic and manual transmissions.', icon: '⚙️', featured: true },
    { id: 'engine-repair', name: 'Engine Repair', description: 'From minor engine work to major repairs, our skilled technicians get your engine running right.', icon: '🔩', featured: true },
    { id: 'tire-rotation', name: 'Tire Rotation', description: 'Regular tire rotation to extend tire life and ensure even wear across all four tires.', icon: '🔄' },
    { id: 'coolant-flush', name: 'Coolant Flush', description: 'Coolant system flush and refill to prevent overheating and protect your engine.', icon: '💧' },
    { id: 'filter-replacement', name: 'Filter Replacement', description: 'Air, fuel, and cabin filter replacement to keep your vehicle running efficiently and cleanly.', icon: '🌀' },
    { id: 'belt-inspection', name: 'Belt Inspection', description: 'Serpentine belt, timing belt, and hose inspection and replacement before they leave you stranded.', icon: '📋' },
    { id: 'suspension', name: 'Suspension & Steering', description: 'Suspension repair, strut and shock replacement, and steering system service for a smooth, safe ride.', icon: '🚗' },
  ],
  team: [
    { id: 'todd', name: 'Todd Blankenship', role: 'Owner', bio: 'Todd has owned and operated Becker Auto Repair since 1994, building a reputation for honest work and fair pricing in the Alexandria community.' },
  ],
  gallery: [
    { id: 'shop1', src: '/images/becker/shop1.jpg', alt: 'Becker Auto Repair shop interior', caption: 'Our service bay' },
    { id: 'shop2', src: '/images/becker/shop2.jpg', alt: 'Becker Auto Repair workspace', caption: 'Quality work area' },
  ],
  testimonials: [
    { id: 'r1', author: 'Will S.', text: 'Great Auto repair shop, very friendly and reliable guys. Quality, reliable work, with low prices.', rating: 5, source: 'Google' },
    { id: 'r2', author: 'Bill E.', text: 'Great friendly guys that get it fixed right the first time.', rating: 5, source: 'Google' },
    { id: 'r3', author: 'Pauly', text: 'This is a very honest and great repair shop that clearly puts their customers first. These guys are very knowledgeable and skilled technicians.', rating: 5, source: 'Google' },
    { id: 'r4', author: 'Nathan B.', text: 'Always knowledgeable and helpful. Willing to get us in at the last minute.', rating: 5, source: 'Google' },
    { id: 'r5', author: 'Mike E.', text: 'Great group of guys and great work, dealt with them all the time and they are always friendly.', rating: 5, source: 'Google' },
    { id: 'r6', author: 'Leon K.', text: 'We brought our truck here because the check engine light came on... replaced all worn out components... truck still runs like new with 254,000 miles.', rating: 5, source: 'Google' },
  ],
  announcements: [],
  seo: {
    title: 'Becker Auto Repair — ASE Certified Mechanics in Alexandria, MN',
    description: 'Honest auto repair in Alexandria, MN since 1994. ASE-certified technicians. Oil changes, brakes, diagnostics, tires, exhaust, and preventive maintenance.',
    keywords: ['auto repair Alexandria MN', 'Becker Auto Repair', 'ASE certified mechanic', 'oil change', 'brake service', 'engine diagnostics'],
  },

  ui: {
    hero: {
      badge: 'Since 1994',
      ctaPrimary: 'Call for Service',
      ctaSecondary: 'Our Services',
    },
    nav: { ctaLabel: 'Call Now' },
    sections: {
      services: 'Our Services',
      about: 'Honest Work. Fair Prices.',
      testimonials: 'What Customers Say',
      contact: 'Schedule Your Service Today',
    },
    cta: { phone: 'Call for Service' },
  },
};
