import { useGeo } from "@/context/GeoContext";

export default function GeoGate({ children }: { children: React.ReactNode }) {
  const { status } = useGeo();
  if (status === "restricted") {
    return (
      <main className="container py-10">
        <div className="max-w-xl mx-auto rounded-md border bg-card/70 backdrop-blur p-6">
          <h1 className="text-2xl font-semibold mb-2">Not Available In Your Region</h1>
          <p className="text-muted-foreground">Access to this platform is blocked in your jurisdiction due to legal restrictions.</p>
        </div>
      </main>
    );
  }
  return <>{children}</>;
}


