import { Fragment } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getArchitecture, getProgram, tLocalized } from "@/lib/content";
import { splitSessionTitle } from "@/lib/program";

export async function ForumArchitecture() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("program");
  const architecture = getArchitecture();
  const byName = new Map(
    getProgram().sessions.map((session) => [
      splitSessionTitle(session.title.ru).name,
      session.id,
    ]),
  );

  return (
    <div className="forum-arch">
      <div className="arch-switch" role="radiogroup" aria-label={t("days")}>
        {architecture.days.map((day, index) => (
          <Fragment key={day.id}>
            <input
              className="arch-radio"
              type="radio"
              name="arch-day"
              id={`arch-day-${day.id}`}
              defaultChecked={index === 0}
            />
            <label className="arch-switch-label" htmlFor={`arch-day-${day.id}`}>
              {tLocalized(day.kicker, locale)}
            </label>
          </Fragment>
        ))}
      </div>

      <div className="arch-grid mt-4">
        {architecture.days.map((day) => (
          <article key={day.id} className={`arch-day arch-day-${day.id} border border-line bg-white`}>
            <header className="bg-deep px-5 py-5 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#e2b79a]">
                {tLocalized(day.kicker, locale)}
              </p>
              <h3 className="mt-2 text-2xl font-bold">{tLocalized(day.title, locale)}</h3>
            </header>
            <div className="space-y-3 p-3">
              {day.blocks.map((block) => (
                <section
                  key={block.id}
                  className={`border px-4 py-4 ${block.climax ? "arch-climax" : "border-line bg-paper"}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-bold text-deep">{tLocalized(block.label, locale)}</h4>
                    <p className="meta-accent text-sm font-semibold">{block.time}</p>
                  </div>
                  {block.climax && block.climaxLabel ? (
                    <p className="meta-accent mt-2 text-xs font-semibold uppercase tracking-[0.12em]">
                      {tLocalized(block.climaxLabel, locale)}
                    </p>
                  ) : null}
                  {block.note ? (
                    <p className="mt-2 text-sm text-ink-soft">{tLocalized(block.note, locale)}</p>
                  ) : null}
                  <ul className="mt-3 space-y-2">
                    {block.sessions.map((item) => {
                      const sessionId = byName.get(item.linkName ?? item.name);
                      return (
                        <li key={item.name} className="border-t border-line pt-2 text-sm leading-snug">
                          {sessionId ? (
                            <Link href={`/program/${sessionId}`} className="font-medium text-ink hover:underline">
                              {item.name}
                            </Link>
                          ) : (
                            <span className="font-medium text-ink">{item.name}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>

      <section className="mt-4 border border-line bg-white px-5 py-5" aria-label={tLocalized(architecture.zonesTitle, locale)}>
        <h3 className="text-lg font-bold text-deep">{tLocalized(architecture.zonesTitle, locale)}</h3>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {architecture.zones.map((zone) => (
            <li key={zone.ru} className="border border-line bg-paper px-4 py-3 text-sm font-medium text-ink">
              {tLocalized(zone, locale)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
