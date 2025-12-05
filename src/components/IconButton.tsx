import type React from "react";
import { Spinner } from "./ui/spinner";
import { Tooltip } from "./Tooltip";

function IconButton(props: {
  icon: React.ReactNode;
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <Tooltip tooltipText="Log Out">
      <button
        onClick={props.onClick}
        disabled={props.loading}
        style={{
          marginBottom: "auto",
          width: "2.5rem",
          height: "2.5rem",
          padding: ".5rem",
          background: "#2F2F2F",
          marginRight: "-2.5rem",
        }}
      >
        {props.loading ? <Spinner /> : props.icon}
      </button>
    </Tooltip>
  );
}

export { IconButton };
