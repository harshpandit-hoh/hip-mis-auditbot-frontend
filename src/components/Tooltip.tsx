import React from "react";
import { TooltipCore, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function Tooltip(props: { tooltipText: string; children: React.ReactNode }) {
  return (
    <TooltipCore>
      <TooltipTrigger asChild>{props.children}</TooltipTrigger>
      <TooltipContent>
        <p>{props.tooltipText}</p>
      </TooltipContent>
    </TooltipCore>
  );
}

export { Tooltip };
