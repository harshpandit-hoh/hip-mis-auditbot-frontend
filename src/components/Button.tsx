/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner } from "./ui/spinner";
import { ButtonCore } from "./ui/button";

interface ButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  buttonText: string;
  className?: string;
}

export function Button({
  onClick,
  loading,
  disabled,
  buttonText,
  className,
}: ButtonProps) {
  return (
    <ButtonCore
      className={`text-white hover:bg-zinc-200 disabled:bg-zinc-600 disabled:text-zinc-400 ${
        className ?? ""
      }`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        // Render spinner if loading
        <Spinner />
      )}
      {buttonText}
    </ButtonCore>
  );
}
