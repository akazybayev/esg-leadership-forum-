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

      <div className="arch-grid mt-8 gap-7">
        {architecture.days.map((day) => (
          <article key={day.id} className={`arch-day arch-day-${day.id} day-card`}>
            <h3>{tLocalized(day.kicker, locale)}</h3>
            <p className="day-theme">{tLocalized(day.title, locale)}</p>
            <div className="slots">
              {day.blocks.map((block) => {
                const peak = Boolean(block.climax) || block.id === "finale";
                return (
                  <div key={block.id} className={peak ? "slot slot-peak" : "slot"}>
                    <time>{block.time}</time>
                    <b>{tLocalized(block.label, locale)}</b>
                    <small>
                      {block.sessions.map((item, index) => {
                        const sessionId = byName.get(item.linkName ?? item.name);
                        const node = sessionId ? (
                          <Link key={item.name} href={`/program/${sessionId}`} className="hover:underline">
                            {item.name}
                          </Link>
                        ) : (
                          <span key={item.name}>{item.name}</span>
                        );
                        return (
                          <span key={item.name}>
                            {index > 0 ? " · " : null}
                            {node}
                          </span>
                        );
                      })}
                      {block.climaxLabel ? ` · ${tLocalized(block.climaxLabel, locale)}` : ""}
                      {block.note ? ` · ${tLocalized(block.note, locale)}` : ""}
                    </small>
                  </div>
                );
              })}
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
