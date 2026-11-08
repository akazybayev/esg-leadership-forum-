import { statSync } from "fs";
import path from "path";

export const programDownloads = [
  {
    file: "ESG_Leadership_Forum_2027_Programma.pdf",
    labelKey: "full",
  },
  {
    file: "1_Panelnye_sessii.pdf",
    labelKey: "panels",
  },
  {
    file: "2_Master_klassy.pdf",
    labelKey: "master",
  },
  {
    file: "3_Keynouty.pdf",
    labelKey: "keynotes",
  },
  {
    file: "4_Youth_Impact.pdf",
    labelKey: "youth",
  },
  {
    file: "5_ESG_Award.pdf",
    labelKey: "award",
  },
] as const;

export const fullProgramHref =
  "/downloads/program/ESG_Leadership_Forum_2027_Programma.pdf";

export const fullProgramFile = "ESG_Leadership_Forum_2027_Programma.pdf";

export function programFileKb(file: string): number {
  const bytes = statSync(
    path.join(process.cwd(), "public/downloads/program", file),
  ).size;
  return Math.max(1, Math.round(bytes / 1024));
}
