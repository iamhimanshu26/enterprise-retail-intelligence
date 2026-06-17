import { GeneratorCard } from '@/features/generator/components/GeneratorCard'
import type { RegionalStats } from '@/types/statistics'

interface RegionalStatsCardProps {
  regional: RegionalStats
}

export function RegionalStatsCard({ regional }: RegionalStatsCardProps) {
  return (
    <GeneratorCard title="Regional Statistics" description="Japanese regional retail performance">
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        {regional.top_region && (
          <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">
            Top: {regional.top_region}
          </span>
        )}
        {regional.lowest_region && (
          <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">
            Lowest: {regional.lowest_region}
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
              <th className="pb-2 pr-4">Region</th>
              <th className="pb-2 pr-4">Revenue</th>
              <th className="pb-2 pr-4">AOV</th>
              <th className="pb-2">Return %</th>
            </tr>
          </thead>
          <tbody>
            {regional.rows.map((row) => (
              <tr key={row.region} className="border-b border-border/40">
                <td className="py-2 pr-4 font-medium">{row.region}</td>
                <td className="py-2 pr-4 tabular-nums">¥{row.revenue.toLocaleString()}</td>
                <td className="py-2 pr-4 tabular-nums">¥{row.average_order_value.toLocaleString()}</td>
                <td className="py-2 tabular-nums">{row.return_rate_pct.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GeneratorCard>
  )
}
