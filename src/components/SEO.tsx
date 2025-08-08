import { Helmet } from "react-helmet-async";

export function SEO({ title, description, canonical }: { title: string; description?: string; canonical?: string }) {
  const finalTitle = title.length > 60 ? `${title.slice(0, 57)}...` : title;
  const finalDesc = description ? (description.length > 160 ? `${description.slice(0, 157)}...` : description) : undefined;
  return (
    <Helmet>
      <title>{finalTitle}</title>
      {finalDesc && <meta name="description" content={finalDesc} />}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}
