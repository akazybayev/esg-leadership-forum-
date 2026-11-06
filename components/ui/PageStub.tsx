import { getTranslations } from "next-intl/server";

export async function PageStub({
  title,
  stage = "1",
}: {
  title: string;
  stage?: string;
}) {
  const t = await getTranslations("stage");

  return (
    <section className="container-shell py-16 md:py-24">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
        ESG Leadership Forum
      </p>
      <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-deep md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        {t("stub", { stage })}
      </p>
    </section>
  );
}
