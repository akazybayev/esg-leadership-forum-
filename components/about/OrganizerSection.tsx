import type { Locale } from "@/i18n/routing";
import { tLocalized } from "@/lib/i18n-content";
import { getOrganizers } from "@/lib/content";

export function OrganizerSection({ locale }: { locale: Locale }) {
  const content = getOrganizers();

  return (
    <section id="organizer" className="band band-sand">
      <div className="container-shell">
        <h2 className="org-section-title">{tLocalized(content.title, locale)}</h2>
        <div className="org-list">
          {content.blocks.map((block) => {
            const name = tLocalized(block.name, locale);
            return (
              <article key={block.id} id={block.id} className="org-block">
                <div className="org-head">
                  {block.logo ? (
                    <img
                      className="org-logo"
                      src={block.logo.src}
                      width={block.logo.width}
                      height={block.logo.height}
                      alt=""
                    />
                  ) : null}
                  {block.portrait ? (
                    <img
                      className="org-portrait"
                      src={block.portrait.src}
                      width={block.portrait.width}
                      height={block.portrait.height}
                      alt={name}
                      data-zoom=""
                    />
                  ) : null}
                  <div>
                    <h3 className="org-name">{name}</h3>
                    <p className="org-role">{tLocalized(block.subtitle, locale)}</p>
                  </div>
                </div>
                <div className="org-copy">
                  {block.paragraphs.map((paragraph) => (
                    <p key={paragraph.ru}>{tLocalized(paragraph, locale)}</p>
                  ))}
                </div>
                {block.stats?.length ? (
                  <ul className="org-stats">
                    {block.stats.map((stat) => (
                      <li key={stat.value + stat.label.ru}>
                        <b>{stat.value}</b>
                        <span>{tLocalized(stat.label, locale)}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {block.members?.length ? (
                  <div className="org-chip-block">
                    <p>{tLocalized(block.membersLabel!, locale)}</p>
                    <ul>
                      {block.members.map((member) => (
                        <li key={member.href}>
                          <a href={member.href} target="_blank" rel="noreferrer">
                            {member.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {block.awards?.length ? (
                  <div className="org-chip-block">
                    <p>{tLocalized(block.awardsLabel!, locale)}</p>
                    <ul>
                      {block.awards.map((award) => (
                        <li key={award.ru}>{tLocalized(award, locale)}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {block.link ? (
                  <a className="btn btn-secondary" href={block.link.href} target="_blank" rel="noreferrer">
                    {block.link.label}
                  </a>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
