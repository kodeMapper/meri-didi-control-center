
import { Check as CheckIcon } from "lucide-react";

export function Check(props: { checked?: boolean }) {
  return (
    <CheckIcon 
      size={16} 
      className={props.checked ? "text-primary" : "text-gray-400"} 
    />
  );
}
