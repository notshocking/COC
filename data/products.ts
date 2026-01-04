export interface Product {
  category: string;
  name: string;
  description: string;
  link?: string;
}

export const PRODUCT_CATALOG: Product[] = [
  // Grooming
  { 
    category: 'Grooming', 
    name: 'Jawline Exerciser', 
    description: 'To strengthen masseter muscles and define the jaw.',
    link: 'https://www.amazon.com/s?k=jawline+exerciser+pop+n+go' // Example of a specific override link
  },
  { 
    category: 'Grooming', 
    name: 'Ice Roller', 
    description: 'Reduces face puffiness, inflammation, and tightens pores.',
    link: 'https://www.amazon.com/s?k=Ice+Roller&linkCode=ll2&tag=boardzy-20&linkId=a65e4d95e03b2fa2b73c29145a932947&language=en_US&ref_=as_li_ss_tl'
  },
  { 
    category: 'Grooming', 
    name: 'Retinol Serum', 
    description: 'Anti-aging, reduces fine lines, and improves skin texture.',
    link: 'https://amzn.to/3M6TzvP'
  },
  { 
    category: 'Grooming', 
    name: 'Charcoal Face Wash', 
    description: 'Deep cleansing for oily skin and removing impurities.',
    link: 'https://amzn.to/4rsk6E7'
  },
  { 
    category: 'Grooming', 
    name: 'Sea Salt Spray', 
    description: 'Adds beachy texture and volume to flat hair.',
    link: 'https://amzn.to/4aiXjnV'
  },
  { 
    category: 'Grooming', 
    name: 'Beard Growth Kit (Derma Roller)', 
    description: 'Stimulates follicles for patchy beards.',
    link: 'https://amzn.to/4akDMU6'
  },
  { category: 'Grooming', name: 'Copper Tongue Scraper', description: 'Essential for better breath and oral hygiene.' },
  { category: 'Grooming', name: 'Volumizing Hair Powder', description: 'Instant lift and matte texture for hair.' },
  { category: 'Grooming', name: 'Nose Hair Trimmer', description: 'Essential grooming for a clean look.' },

  // Gym
  { 
    category: 'Gym', 
    name: 'Creatine Monohydrate', 
    description: 'Increases muscle fullness, strength, and performance.',
    link: 'https://amzn.to/44GRzAK'
  },
  { 
    category: 'Gym', 
    name: 'Whey Protein Isolate', 
    description: 'Fast-absorbing protein for lean muscle recovery.',
    link: 'https://amzn.to/4p4oUhj'
  },
  { 
    category: 'Gym', 
    name: 'High-Stim Pre-Workout', 
    description: 'Maximum energy for intensity in the gym.',
    link: 'https://amzn.to/3Mv80tG'
  },
  { category: 'Gym', name: 'Lifting Straps', description: 'To grip heavier weights for back development.' },
  { 
    category: 'Gym', 
    name: 'Resistance Bands Set', 
    description: 'For mobility work, warmups, and home workouts.',
    link: 'https://amzn.to/4akttiP'
  },
  { 
    category: 'Gym', 
    name: 'Weighted Vest', 
    description: 'Add intensity to cardio, walking, and calisthenics.',
    link: 'https://amzn.to/4py31qy'
  },
  { category: 'Gym', name: 'Grip Strength Trainer', description: 'For forearm vascularity and handshake dominance.' },
  { category: 'Gym', name: 'Foam Roller', description: 'Recovery tool for muscle tightness.' },

  // Style
  { category: 'Style', name: 'Oversized Pump Cover Tee', description: 'Trendy gym aesthetic that hides bulk but shows width.' },
  { category: 'Style', name: 'Structured Trucker Cap', description: 'Hides bad hair days and adds vertical height.' },
  { category: 'Style', name: 'Chelsea Boots', description: 'Height boosting...' },
  { category: 'Style', name: 'Slim Fit Chinos', description: 'Elevated casual look that fits athletic legs.' },
  { category: 'Style', name: 'Compression Shirt', description: 'Shows off physique definition.' },
  { category: 'Style', name: 'Classic Aviator Sunglasses', description: 'Hides the eyes.' },

  // Health
  { category: 'Health', name: 'Magnesium Glycinate', description: 'Better sleep quality and muscle recovery.' },
  { category: 'Health', name: 'Ashwagandha KSM-66', description: 'Cortisol reduction, stress management, and testosterone support.' },
  { category: 'Health', name: 'Zinc Picolinate', description: 'Clearer skin and hormonal support.' },
  { category: 'Health', name: 'Blue Light Blocking Glasses', description: 'Reduces eye strain and improves sleep.' },
  { category: 'Health', name: 'Electric Water Flosser', description: 'Dental hygiene for a better smile.' },
  { category: 'Health', name: 'Collagen Peptides', description: 'Joint health and skin elasticity.' },
  { 
    category: 'Health', 
    name: 'Daily Multivitamin', 
    description: 'Essential micronutrients for overall vitality and skin health.',
    link: 'https://amzn.to/3XrFgnZ'
  },

  // Enhancement
  { category: 'Enhancement', name: 'TRT (Testosterone)', description: 'Optimized hormonal baseline for maximum vitality, muscle retention, and mood stability.' },
  { category: 'Enhancement', name: 'Finasteride', description: 'The Norwood Reaper defense. Halts hair loss and preserves the hairline.' },
  { category: 'Enhancement', name: 'Minoxidil', description: 'Topical vasodilator to stimulate follicle growth for beard or scalp density.' },
  { category: 'Enhancement', name: 'Enclomiphene', description: 'SERM to boost endogenous testosterone production without shutdown.' },
  { category: 'Enhancement', name: 'Melanotan II', description: 'For an effortless, deep tan and appetite suppression.' },
  { category: 'Enhancement', name: 'MK-677 (Ibutamoren)', description: 'Secretagogue for increased HGH, better sleep, and hunger.' },
  { category: 'Enhancement', name: 'BPC-157 Peptides', description: 'The wolverine compound for accelerated joint and tendon recovery.' },
  { category: 'Enhancement', name: 'Tadalafil (BlueChew)', description: 'Enhanced blood flow for pumps in the gym and performance outside of it.' },
  { category: 'Enhancement', name: 'Turkesterone', description: 'Natural plant-based anabolic support for muscle synthesis.' },
  { category: 'Enhancement', name: 'Tongkat Ali', description: 'Potent natural testosterone support for vitality.' },
  { category: 'Enhancement', name: 'Retatrutide', description: 'Triple-agonist peptide for drastic fat mobilization and appetite suppression.' },
  { category: 'Enhancement', name: 'GHK-Cu', description: 'Copper peptide for rapid skin remodeling, collagen density, and scar reduction.' },
];