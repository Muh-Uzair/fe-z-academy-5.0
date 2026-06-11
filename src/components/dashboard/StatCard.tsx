import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  iconColor?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  iconColor = "text-muted-foreground",
}: StatCardProps) => {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`p-2 rounded-full bg-secondary/50 ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trendValue) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trend === "up" && (
              <span className="text-green-500 font-medium">+{trendValue}</span>
            )}
            {trend === "down" && (
              <span className="text-red-500 font-medium">-{trendValue}</span>
            )}
            {trend === "neutral" && (
              <span className="text-gray-500 font-medium">{trendValue}</span>
            )}
            {description && <span>{description}</span>}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
