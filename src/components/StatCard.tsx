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
  iconBg?: string;
  valueColor?: string;
  className?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  iconColor = "text-primary-dark",
  iconBg = "bg-primary-very-light",
  valueColor = "text-primary",
  className = "",
}: StatCardProps) => {
  return (
    <div
      className={`rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between hover:shadow-md hover:border-primary-light/50 transition-all ${className}`}
    >
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={`p-2 rounded-full ${iconBg} ${iconColor} transition-colors`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div>
        <div className={`text-2xl font-bold tracking-tight ${valueColor}`}>{value}</div>
        {(description || trendValue) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 flex-wrap">
            {trendValue && (() => {
              const parts = trendValue.split(" ");
              const valuePart = parts[0];
              const labelPart = parts.slice(1).join(" ");
              const prefix = trend === "up" ? "+" : trend === "down" ? "-" : "";
              const colorClass =
                trend === "up"
                  ? "text-primary font-medium"
                  : trend === "down"
                    ? "text-red-500 font-medium"
                    : "text-muted-foreground font-medium";

              return (
                <span>
                  <span className={colorClass}>
                    {prefix}{valuePart}
                  </span>
                  {labelPart ? ` ${labelPart}` : ""}
                </span>
              );
            })()}
            {description && <span>{description}</span>}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
