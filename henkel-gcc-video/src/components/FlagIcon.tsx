import React from 'react';
import SA from 'country-flag-icons/react/3x2/SA';
import AE from 'country-flag-icons/react/3x2/AE';
import KW from 'country-flag-icons/react/3x2/KW';
import QA from 'country-flag-icons/react/3x2/QA';
import BH from 'country-flag-icons/react/3x2/BH';
import OM from 'country-flag-icons/react/3x2/OM';
import RU from 'country-flag-icons/react/3x2/RU';
import EG from 'country-flag-icons/react/3x2/EG';
import TR from 'country-flag-icons/react/3x2/TR';
import FR from 'country-flag-icons/react/3x2/FR';
import DE from 'country-flag-icons/react/3x2/DE';
import US from 'country-flag-icons/react/3x2/US';
import PS from 'country-flag-icons/react/3x2/PS';
import IN from 'country-flag-icons/react/3x2/IN';
import LK from 'country-flag-icons/react/3x2/LK';
import SY from 'country-flag-icons/react/3x2/SY';
import CU from 'country-flag-icons/react/3x2/CU';
import KN from 'country-flag-icons/react/3x2/KN';
import JO from 'country-flag-icons/react/3x2/JO';
import LB from 'country-flag-icons/react/3x2/LB';
import DZ from 'country-flag-icons/react/3x2/DZ';
import PK from 'country-flag-icons/react/3x2/PK';
import PH from 'country-flag-icons/react/3x2/PH';
import AM from 'country-flag-icons/react/3x2/AM';

// Flag component type (country-flag-icons uses its own Props type)
type FlagComponent = React.FC<{ style?: React.CSSProperties; className?: string; title?: string }>;

// Map country names and ISO codes to flag components
const FLAG_COMPONENTS: Record<string, FlagComponent> = {
  // By country name
  'Saudi Arabia': SA,
  'UAE': AE,
  'United Arab Emirates': AE,
  'Kuwait': KW,
  'Qatar': QA,
  'Bahrain': BH,
  'Oman': OM,
  'Russia': RU,
  'Egypt': EG,
  'Turkey': TR,
  'France': FR,
  'Germany': DE,
  'Germany & Egypt': DE, // primary flag for dual nationality
  'US & Palestine': US,  // primary flag for dual nationality
  'United States': US,
  'Palestine': PS,
  'India': IN,
  'Sri Lanka': LK,
  'Syria': SY,
  'Cuba': CU,
  'St. Kitts': KN,
  'Jordan': JO,
  'Lebanon': LB,
  'Algeria': DZ,
  'Pakistan': PK,
  'Philippines': PH,
  'Armenia': AM,
  // By ISO alpha-2 code
  'SA': SA,
  'AE': AE,
  'KW': KW,
  'QA': QA,
  'BH': BH,
  'OM': OM,
  'RU': RU,
  'EG': EG,
  'TR': TR,
  'FR': FR,
  'DE': DE,
  'US': US,
  'PS': PS,
  'IN': IN,
  'LK': LK,
  'SY': SY,
  'CU': CU,
  'KN': KN,
  'JO': JO,
  'LB': LB,
  'DZ': DZ,
  'PK': PK,
  'PH': PH,
  'AM': AM,
};

// Secondary flag for dual nationalities
const SECONDARY_FLAGS: Record<string, FlagComponent> = {
  'Germany & Egypt': EG,
  'US & Palestine': PS,
};

interface FlagIconProps {
  country: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export const FlagIcon: React.FC<FlagIconProps> = ({
  country,
  width = 24,
  height = 16,
  style = {},
}) => {
  const FlagComponent = FLAG_COMPONENTS[country];
  const SecondaryFlag = SECONDARY_FLAGS[country];

  if (!FlagComponent) {
    // Fallback: render country code text
    return (
      <span style={{ fontSize: height * 0.8, lineHeight: 1, ...style }}>
        {country.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  if (SecondaryFlag) {
    return (
      <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center', ...style }}>
        <FlagComponent style={{ width, height, borderRadius: 2, display: 'block' }} />
        <SecondaryFlag style={{ width, height, borderRadius: 2, display: 'block' }} />
      </span>
    );
  }

  return (
    <FlagComponent
      style={{ width, height, borderRadius: 2, display: 'inline-block', verticalAlign: 'middle', ...style }}
    />
  );
};

export { FLAG_COMPONENTS, SECONDARY_FLAGS };
