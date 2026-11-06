import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageStub } from "@/components/ui/PageStub";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  return <PageStub title={t("speakers")} stage="1" />;
}
