import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Geo = {
  country: string | null;
  region: string | null; // state/province code
  status: "restricted" | "sweepstakes" | "unrestricted" | "unknown";
  minAge: 18 | 21;
};

const GeoContext = createContext<Geo>({ country: null, region: null, status: "unknown", minAge: 18 });

const RESTRICTED = {
  countries: ["KP"],
  regionsUS: ["WA", "ID"],
};

const SWEEPSTAKES_US = ["CA", "NY", "FL"]; // example list

function computeStatus(country: string | null, region: string | null): { status: Geo["status"]; minAge: 18 | 21 } {
  if (!country) return { status: "unknown", minAge: 18 };
  if (RESTRICTED.countries.includes(country)) return { status: "restricted", minAge: 21 };
  if (country === "US") {
    if (region && RESTRICTED.regionsUS.includes(region)) return { status: "restricted", minAge: 21 };
    if (region && SWEEPSTAKES_US.includes(region)) return { status: "sweepstakes", minAge: 21 };
    return { status: "sweepstakes", minAge: 21 };
  }
  // Default to unrestricted for most non-US regions
  return { status: "unrestricted", minAge: 18 };
}

export function GeoProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountry] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const json = await res.json();
        if (!cancelled) {
          setCountry(json.country_code || null);
          setRegion(json.region_code || null);
        }
      } catch {
        // ignore
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const { status, minAge } = useMemo(() => computeStatus(country, region), [country, region]);

  const value = useMemo<Geo>(() => ({ country, region, status, minAge }), [country, region, status, minAge]);

  return <GeoContext.Provider value={value}>{children}</GeoContext.Provider>;
}

export function useGeo() {
  return useContext(GeoContext);
}


