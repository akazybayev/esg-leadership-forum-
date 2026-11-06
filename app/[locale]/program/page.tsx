import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { ProgramExplorer } from "@/components/program/ProgramExplorer";
import { getProgram } from "@/lib/content";
import { pageMetadata } from "@/lib/page-meta";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata(locale, "program");
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("nav");
  const tProgram = await getTranslations("program");
  const program = getProgram();

  return (
    <section className="container-shell py-12 md:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
        ESG Leadership Forum
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-deep md:text-5xl">
        {t("program")}
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">
        {tProgram("intro")}
      </p>
      <div className="mt-10">
        <ProgramExplorer
          note={program.note}
          sessions={program.sessions}
          initialDay="1"
        />
      </div>
    </section>
  );
}
