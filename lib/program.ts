import { getProgram } from "@/lib/content";
import type { ProgramSession } from "@/lib/program-types";

export type { ProgramSession } from "@/lib/program-types";
export { filterSessions } from "@/lib/program-types";

export function getSessionById(id: string): ProgramSession | undefined {
  return getProgram().sessions.find((session) => session.id === id);
}

export function getAllSessionIds(): string[] {
  return getProgram().sessions.map((session) => session.id);
}
