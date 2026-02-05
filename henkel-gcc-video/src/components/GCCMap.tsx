import React, { useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from '@vnedyalk0v/react19-simple-maps';
import { COLORS } from '../config/brand';
import { useTopoJson } from '../hooks/useTopoJson';

// ISO numeric IDs for GCC countries in the TopoJSON
const GCC_ISO_NUMERIC: Record<string, string> = {
  KSA: '682',
  UAE: '784',
  KWT: '414',
  QAT: '634',
  BHR: '048',
  OMN: '512',
};

// Capital / major city coordinates for pin placement [lng, lat]
const GCC_PIN_COORDS: Record<string, [number, number]> = {
  KSA: [46.68, 24.71],
  UAE: [55.27, 25.20],
  KWT: [47.98, 29.38],
  QAT: [51.53, 25.29],
  BHR: [50.58, 26.23],
  OMN: [58.39, 23.59],
};

// All valid GCC ISO numeric IDs as a Set
const GCC_IDS = new Set(Object.values(GCC_ISO_NUMERIC));

interface GCCMapProps {
  activatedCountries: string[];
  showPins: string[];
}

export const GCCMap: React.FC<GCCMapProps> = ({
  activatedCountries,
  showPins,
}) => {
  const topoData = useTopoJson();

  // Build a set of activated ISO numeric IDs
  const activatedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const code of activatedCountries) {
      const numId = GCC_ISO_NUMERIC[code];
      if (numId) ids.add(numId);
    }
    return ids;
  }, [activatedCountries]);

  if (!topoData) return null;

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        center: [50, 24] as any,
        scale: 2200,
      }}
      width={1100}
      height={700}
      style={{ width: 1100, height: 700 }}
    >
      <Geographies geography={topoData}>
        {({ geographies }: { geographies: any[] }) => {
          const neighbors = geographies.filter((geo) => {
            const id = geo.id || geo.properties?.id;
            return !GCC_IDS.has(id);
          });

          const gccGeos = geographies.filter((geo) => {
            const id = geo.id || geo.properties?.id;
            return GCC_IDS.has(id);
          });

          return (
            <>
              {/* Neighboring countries for geographic context */}
              {neighbors.map((geo) => (
                <Geography
                  key={geo.rsmKey || geo.id}
                  geography={geo}
                  fill="#E8E4DF"
                  stroke="#D0CCC7"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))}

              {/* GCC countries */}
              {gccGeos.map((geo) => {
                const id = geo.id || geo.properties?.id;
                const isActive = activatedIds.has(id);
                return (
                  <Geography
                    key={geo.rsmKey || geo.id}
                    geography={geo}
                    fill={isActive ? COLORS.sandHighlight : COLORS.countryInactive}
                    stroke={COLORS.countryBorder}
                    strokeWidth={1}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })}
            </>
          );
        }}
      </Geographies>

      {/* Red pin markers */}
      {showPins.map((code) => {
        const coords = GCC_PIN_COORDS[code];
        if (!coords) return null;
        return (
          <Marker key={`pin-${code}`} coordinates={coords as any}>
            <ellipse cx={0} cy={8} rx={6} ry={3} fill="rgba(0,0,0,0.2)" />
            <circle cx={0} cy={-6} r={14} fill="rgba(225,0,15,0.2)" />
            <circle cx={0} cy={-6} r={10} fill={COLORS.henkelRed} />
            <polygon points="-5,-2 5,-2 0,6" fill={COLORS.henkelRed} />
            <circle cx={-2} cy={-8} r={3} fill="rgba(255,255,255,0.3)" />
          </Marker>
        );
      })}
    </ComposableMap>
  );
};

export { GCC_ISO_NUMERIC, GCC_PIN_COORDS };
