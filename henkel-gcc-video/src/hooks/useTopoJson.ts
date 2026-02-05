import { useState, useEffect, useRef } from 'react';
import { staticFile, delayRender, continueRender } from 'remotion';

let cachedData: any = null;
let loadingPromise: Promise<any> | null = null;

const geoUrl = staticFile('data/countries-10m.json');

export function useTopoJson() {
  const [data, setData] = useState<any>(cachedData);
  const handleRef = useRef<number | null>(null);

  useEffect(() => {
    if (cachedData) {
      setData(cachedData);
      return;
    }

    handleRef.current = delayRender('Loading TopoJSON map data');

    if (!loadingPromise) {
      loadingPromise = fetch(geoUrl)
        .then((res) => res.json())
        .then((json) => {
          cachedData = json;
          return json;
        });
    }

    loadingPromise.then((json) => {
      setData(json);
      if (handleRef.current !== null) {
        continueRender(handleRef.current);
      }
    });

    return () => {
      // If unmounted before load completes, still continue render
      if (handleRef.current !== null) {
        try {
          continueRender(handleRef.current);
        } catch {
          // Already continued
        }
      }
    };
  }, []);

  return data;
}
