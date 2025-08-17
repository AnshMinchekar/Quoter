import dynamic from "next/dynamic";

const Quoter = dynamic(() => import("@/components/quoter"), { ssr: false });

export default function Home() {
  return <Quoter />;
}
