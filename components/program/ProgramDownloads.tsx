import { FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { programDownloads } from "@/lib/program-downloads";

export async function ProgramDownloads() {
  const t = await getTranslations("program");

  return (
    <section className="mt-8" aria-labelledby="program-downloads-heading">
      <h2 id="program-downloads-heading" className="text-2xl font-bold text-deep">
        {t("downloadsTitle")}
      </h2>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {programDownloads.map((item) => (
          <li key={item.file}>
            <a
              href={`/downloads/program/${item.file}`}
              download={item.file}
              className="flex min-h-14 items-center gap-3 border border-line bg-white px-4 py-3 hover:border-deep"
            >
              <FileText aria-hidden="true" className="shrink-0 text-accent" size={22} />
              <span className="min-w-0 flex-1 font-semibold text-deep">
                {t(`downloads.${item.labelKey}`)}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
