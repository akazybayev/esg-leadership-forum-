import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageStub } from "@/components/ui/PageStub";
import { pageMetadata } from "@/lib/page-meta";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata(locale, "about");
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  return <PageStub title={t("about")} stage="1" />;
}
