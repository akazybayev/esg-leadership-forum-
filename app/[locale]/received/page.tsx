import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const copy: Record<Locale, { title: string; body: string; home: string }> = {
  ru: {
    title: "Заявка отправлена",
    body: "Мы получили ее. Ответ придет на электронную почту, которую вы указали.",
    home: "На главную",
  },
  en: {
    title: "Application sent",
    body: "We have received it. A reply will come to the email address you entered.",
    home: "Back to the home page",
  },
  kk: {
    title: "Өтінім жіберілді",
    body: "Өтінімді алдық. Жауап сіз көрсеткен email-ге келеді.",
    home: "Басты бетке",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const text = copy[locale as Locale] ?? copy.ru;
  return {
    title: `${text.title} · ESG Leadership Forum 2027`,
    robots: { index: false, follow: false },
  };
}

export default async function ReceivedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam as Locale) in copy ? (localeParam as Locale) : "ru";
  setRequestLocale(locale);
  const text = copy[locale];

  return (
    <section className="container-shell max-w-3xl py-16 md:py-24">
      <h1 className="text-4xl font-bold tracking-tight text-deep md:text-5xl">
        {text.title}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-soft">{text.body}</p>
      <Link href="/" className="btn btn-primary mt-8">
        {text.home}
      </Link>
    </section>
  );
}
