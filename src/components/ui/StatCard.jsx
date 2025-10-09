import { Card } from "./Card"
import { cn } from "@/lib/utils"

export function StatCard({ title, value, icon: Icon, trend, trendValue, className }) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <p className={cn("text-xs", trend === "up" ? "text-chart-3" : "text-destructive")}>
              {trend === "up" ? "↑" : "↓"} {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-lg bg-muted">
            <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
      </div>
    </Card>
  )
}
