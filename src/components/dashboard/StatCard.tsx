
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: number;
    isIncrease: boolean;
    label: string;
  };
  className?: string;
}

export function StatCard({ title, value, icon, change, className }: StatCardProps) {
  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-6", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-4xl font-bold mt-1">{value}</h3>
          {change && (
            <p className="text-sm mt-2">
              <span
                className={cn(
                  "inline-flex items-center font-medium",
                  change.isIncrease ? "text-green-600" : "text-red-600"
                )}
              >
                {change.isIncrease ? "↑" : "↓"}
                {change.value}%
              </span>{" "}
              <span className="text-gray-500">{change.label}</span>
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-full", getIconBgClass(title))}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function getIconBgClass(title: string): string {
  switch (title) {
    case "Total Workers":
      return "bg-yellow-50";
    case "Active Workers":
      return "bg-green-50";
    case "Pending Approvals":
      return "bg-orange-50";
    case "Bookings (This Week)":
      return "bg-blue-50";
    default:
      return "bg-gray-50";
  }
}
