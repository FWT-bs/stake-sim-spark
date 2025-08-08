import { useEffect, useState } from "react";
import { useGeo } from "@/context/GeoContext";
import { Button } from "@/components/ui/button";

const KEY = "funstake_age_gate";

export default function AgeGate() {
  const { minAge } = useGeo();
  const [seen, setSeen] = useState<boolean>(false);

  useEffect(() => {
    try { setSeen(localStorage.getItem(KEY) === "1"); } catch {}
  }, []);

  if (seen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-[520px] rounded-md border bg-card/90 backdrop-blur p-6">
        <h2 className="text-xl font-semibold mb-2">Age Verification</h2>
        <p className="text-sm text-muted-foreground mb-4">You must be at least {minAge}+ to use this platform in your region.</p>
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => { window.location.href = "https://www.google.com"; }}>Exit</Button>
          <Button variant="hero" onClick={() => { try { localStorage.setItem(KEY, "1"); } catch {}; setSeen(true); }}>I am {minAge}+</Button>
        </div>
      </div>
    </div>
  );
}


