import { Check } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  showIcon?: boolean;
}

export function EmailInput({
  value,
  onChange,
  disabled,
  showIcon,
}: EmailInputProps) {
  return (
    <InputGroup>
      <InputGroupInput
        type="email"
        placeholder="Enter your Email Address"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-[300px]"
      />

      {showIcon && (
        <InputGroupAddon align="inline-end">
          <div className="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full">
            <Check className="size-3" />
          </div>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
