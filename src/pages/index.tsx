import Head from "next/head";
import dynamic from "next/dynamic";
const Quoter = dynamic(() => import("@/quoter"), { ssr: false });
export default function Home() {
  return (
    <>
      <Head>
        <title>Quoter — Minimal Typography Playground</title>
        <meta
          name="description"
          content="A minimalist typography playground: fullscreen quotes on black, soft pastel accents, with a font scroller, size control, and color picker to explore how type changes meaning."
        />
      </Head>
      <Quoter />
    </>
  );
}
