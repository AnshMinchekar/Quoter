import dynamic from "next/dynamic";

// client-only to avoid hydration mismatches
const Quoter = dynamic(() => import("@/quoter"), { ssr: false });

export default function HomePage() {
  return <Quoter />;
}
