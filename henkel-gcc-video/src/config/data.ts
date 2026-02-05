// ═══════════════════════════════════════════
// DATA REFERENCE — All text and team data
// ═══════════════════════════════════════════

export const SCENE1_LINES = {
  line1: '25% of the Middle East.',
  line2: '>40% Gross Profit. >18% EBIT.',
  line3: '€1.7 Billion Market.',
  redScreen: "You don't know us yet.",
};

export const SCENE2 = {
  leftLabel: '1950s',
  rightLabel: '2020s',
  centerText: '70 years. One transformation.',
};

export const SCENE3_TITLE = 'This is the GCC.';

export interface GCCCountry {
  order: number;
  name: string;
  code: string;
  flag: string;
  sobPercent: number;
  population: string;
  pppCapita: string;
}

export const GCC_COUNTRIES: GCCCountry[] = [
  { order: 1, name: 'Saudi Arabia', code: 'KSA', flag: '🇸🇦', sobPercent: 54, population: '35.3M', pppCapita: '55 T€' },
  { order: 2, name: 'UAE', code: 'UAE', flag: '🇦🇪', sobPercent: 22, population: '10.5M', pppCapita: '84 T€' },
  { order: 3, name: 'Kuwait', code: 'KWT', flag: '🇰🇼', sobPercent: 13, population: '4.9M', pppCapita: '56 T€' },
  { order: 4, name: 'Oman', code: 'OMN', flag: '🇴🇲', sobPercent: 6, population: '5.0M', pppCapita: '37 T€' },
  { order: 5, name: 'Bahrain', code: 'BHR', flag: '🇧🇭', sobPercent: 3, population: '1.6M', pppCapita: '64 T€' },
  { order: 6, name: 'Qatar', code: 'QAT', flag: '🇶🇦', sobPercent: 2, population: '2.7M', pppCapita: '74 T€' },
];

export interface SummaryStatConfig {
  value: number;
  suffix: string;
  label: string;
}

export const SUMMARY_OVERLAY_1: SummaryStatConfig[] = [
  { value: 60, suffix: 'M', label: 'Population' },
  { value: 24, suffix: 'M', label: 'Consumers' },
  { value: 6, suffix: '', label: 'Monarchies' },
];

export const SUMMARY_OVERLAY_2: SummaryStatConfig[] = [
  { value: 75, suffix: '%', label: 'Working Age' },
  { value: 97, suffix: '%', label: 'Internet Penetration' },
  { value: 53, suffix: '%', label: 'Expat Population' },
  { value: 5, suffix: '', label: 'Per Household' },
];

export const CONSUMER_LINES = [
  'Half the world\'s oil reserves.',
  'Family-centric. Influencer-driven.',
  'World\'s highest smartphone penetration.',
];

export const DIVERSITY_LINES = [
  { text: '17 Nationalities.', emphasis: false },
  { text: '10 Languages.', emphasis: false },
  { text: '3 Generations.', emphasis: false },
  { text: 'One Team.', emphasis: true },
];

export const CULTURE_ROUNDS = [
  {
    label: 'We Celebrate',
    photos: [
      'culture/tradition/culture-tradition-1.jpg',
      'culture/tradition/culture-tradition-5.jpg',
      'culture/beyondwork/culture-beyondwork-8.jpg',
      'culture/tradition/culture-tradition-3.jpg',
    ],
  },
  {
    label: 'We Explore',
    photos: [
      'culture/beyondwork/culture-beyondwork-1.jpeg',
      'culture/beyondwork/culture-beyondwork-5.jpg',
      'culture/beyondwork/culture-beyondwork-7.jpg',
      'culture/beyondwork/culture-beyondwork-9.jpg',
    ],
  },
  {
    label: 'We Connect',
    photos: [
      'culture/beyondwork/culture-beyondwork-10.jpg',
      'culture/beyondwork/culture-beyondwork-6.jpg',
      'culture/conference/team-conference-1.jpeg',
      'culture/beyondwork/culture-beyondwork-2.JPG',
    ],
  },
];

export interface ExComMember {
  name: string;
  role: string;
  nationality: string;
  flag: string;
  headshot: string;
  gridRow: number;
  gridCol: number;
  revealOrder: number;
  spotlight?: boolean;
}

export const EXCOM_ROSTER: ExComMember[] = [
  { name: 'Irina Eliseeva', role: 'General Manager GCC', nationality: 'Russia', flag: '🇷🇺', headshot: 'headshots/headshot-irina.png', gridRow: 1, gridCol: 2, revealOrder: 0, spotlight: true },
  { name: 'Marwa Mohamed', role: 'Human Resources', nationality: 'Egypt', flag: '🇪🇬', headshot: 'headshots/headshot-marwa.png', gridRow: 1, gridCol: 1, revealOrder: 1 },
  { name: 'Sedat Sabak', role: 'Purchasing', nationality: 'Turkey', flag: '🇹🇷', headshot: 'headshots/headshot-sedat.jpg', gridRow: 1, gridCol: 3, revealOrder: 2 },
  { name: 'Nicolas Embriaco', role: 'Sales', nationality: 'France', flag: '🇫🇷', headshot: 'headshots/headshot-nicolas.jpg', gridRow: 2, gridCol: 1, revealOrder: 3 },
  { name: 'Mohamed Eltonsy', role: 'Marketing', nationality: 'Germany & Egypt', flag: '🇩🇪🇪🇬', headshot: 'headshots/headshot-mohamedeltonsy.jpg', gridRow: 2, gridCol: 2, revealOrder: 4 },
  { name: 'Mona Madi', role: 'Law', nationality: 'US & Palestine', flag: '🇺🇸🇵🇸', headshot: 'headshots/headshot-mona.png', gridRow: 2, gridCol: 3, revealOrder: 5 },
  { name: 'Louai Ali', role: 'Market Operations', nationality: 'Egypt', flag: '🇪🇬', headshot: 'headshots/headshot-louai.jpg', gridRow: 3, gridCol: 1, revealOrder: 6 },
  { name: 'Pavan Dimri', role: 'Finance', nationality: 'India', flag: '🇮🇳', headshot: 'headshots/headshot-pavan.jpg', gridRow: 3, gridCol: 2, revealOrder: 7 },
  { name: 'Jude Mariyaselvam', role: 'Customer Excellence', nationality: 'Sri Lanka', flag: '🇱🇰', headshot: 'headshots/headshot-jude.jpg', gridRow: 3, gridCol: 3, revealOrder: 8 },
  { name: 'Aya Kalou', role: 'R&D', nationality: 'Syria', flag: '🇸🇾', headshot: 'headshots/headshot-aya.png', gridRow: 4, gridCol: 1, revealOrder: 9 },
  { name: 'Hany Salama', role: 'Sales KSA', nationality: 'Egypt', flag: '🇪🇬', headshot: 'headshots/headshot-hany.jpg', gridRow: 4, gridCol: 2, revealOrder: 10 },
  { name: 'Ilyas Gazi', role: 'Production', nationality: 'Turkey', flag: '🇹🇷', headshot: 'headshots/headshot-ilyas.jpg', gridRow: 4, gridCol: 3, revealOrder: 11 },
];

export interface NationalityPin {
  country: string;
  lat: number;
  lng: number;
}

export const NATIONALITY_PINS: NationalityPin[] = [
  { country: 'Egypt', lat: 30.04, lng: 31.24 },
  { country: 'Palestine', lat: 31.90, lng: 35.20 },
  { country: 'Jordan', lat: 31.95, lng: 35.93 },
  { country: 'Lebanon', lat: 33.89, lng: 35.50 },
  { country: 'Syria', lat: 33.51, lng: 36.29 },
  { country: 'Turkey', lat: 39.93, lng: 32.86 },
  { country: 'Armenia', lat: 40.18, lng: 44.51 },
  { country: 'Saudi Arabia', lat: 24.71, lng: 46.68 },
  { country: 'Algeria', lat: 36.75, lng: 3.06 },
  { country: 'Pakistan', lat: 33.69, lng: 73.04 },
  { country: 'India', lat: 28.61, lng: 77.21 },
  { country: 'Sri Lanka', lat: 6.93, lng: 79.85 },
  { country: 'Philippines', lat: 14.60, lng: 120.98 },
  { country: 'Russia', lat: 55.75, lng: 37.62 },
  { country: 'Germany', lat: 52.52, lng: 13.41 },
  { country: 'France', lat: 48.86, lng: 2.35 },
  { country: 'Cuba', lat: 23.11, lng: -82.37 },
  { country: 'St. Kitts', lat: 17.30, lng: -62.73 },
];

export const GCC_CENTER = { lat: 24, lng: 48 };

export const SCENE7A_TEXT = '18 Nationalities. One Team.';
export const SCENE7B_TEXT = 'This is GCC HCB Team.';
export const SCENE6D_TEXT = 'Cross Functional Team';
