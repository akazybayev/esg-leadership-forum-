"use client";

import { useEffect } from "react";

export function ProgramExplorerBoot() {
  useEffect(() => {
    const win = window as Window & {
      __bootProgramExplorer?: () => void;
      __programExplorerRequested?: boolean;
    };
    if (win.__bootProgramExplorer) win.__bootProgramExplorer();
    else win.__programExplorerRequested = true;
  }, []);
  return null;
}
