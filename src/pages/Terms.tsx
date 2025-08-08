import { SEO } from "@/components/SEO";

export default function Terms() {
  return (
    <main className="container py-10">
      <SEO title="Terms — FunStake Casino" description="FunStake terms of use and responsible play guidelines." />
      <article className="prose prose-invert max-w-3xl">
        <h1>Terms & Responsible Play</h1>
        <p>FunStake is a simulated casino experience for entertainment only. No real money gambling. FunCoin (FC) and RealCredit (RC) have no real-world monetary value.</p>
        <h2>Age</h2>
        <p>You must be 21+ to play. Toggle age verification in your region as required.</p>
        <h2>Fair Play</h2>
        <p>Games use pseudo-random client-side logic. Outcomes are not provably fair in this MVP.</p>
        <h2>Redeem</h2>
        <p>Redeem flows are mocked for demo purposes only.</p>
      </article>
    </main>
  );
}
