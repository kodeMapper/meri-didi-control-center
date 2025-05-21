
import * as React from "react";
import { Check } from "lucide-react";

interface CheckboxCheckedProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function CheckboxChecked({
  id,
  checked = false,
  onCheckedChange,
  className,
  disabled = false,
}: CheckboxCheckedProps) {
  const handleChange = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <div
      id={id}
      className={`inline-flex h-5 w-5 items-center justify-center rounded border border-gray-300 ${
        checked
          ? "bg-primary border-primary"
          : "bg-white"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      onClick={handleChange}
    >
      {checked && (
        <Check className="h-3 w-3 text-white" />
      )}
    </div>
  );
}
