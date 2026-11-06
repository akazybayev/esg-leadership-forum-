import type { z } from "zod";
import type { programSessionSchema } from "@/schemas/content";

export type ProgramSession = z.infer<typeof programSessionSchema>;

export function filterSessions(
  sessions: ProgramSession[],
  filters: {
    day?: string;
    line?: string;
    room?: string;
    format?: string;
    access?: string;
    q?: string;
  },
): ProgramSession[] {
  const q = filters.q?.trim().toLowerCase() ?? "";
  return sessions.filter((session) => {
    if (filters.day && session.day !== filters.day) return false;
    if (filters.line && session.line !== filters.line) return false;
    if (filters.room && session.room !== filters.room) return false;
    if (filters.format && session.format !== filters.format) return false;
    if (filters.access && session.access !== filters.access) return false;
    if (q) {
      const hay =
        `${session.title.ru} ${session.title.en} ${session.title.kk}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
