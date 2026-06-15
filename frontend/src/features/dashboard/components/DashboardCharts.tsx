import { memo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartContainer } from '@/components/analytics/ChartContainer'
import type { ChartDataPoint } from '@/types/dashboard'

const CHART_COLORS = [
  'oklch(0.55 0.14 264)',
  'oklch(0.58 0.12 230)',
  'oklch(0.62 0.10 200)',
  'oklch(0.68 0.08 170)',
  'oklch(0.72 0.06 140)',
]

const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    fontSize: '12px',
  },
}

interface ChartProps {
  data: ChartDataPoint[]
}

export const RevenueTrendChart = memo(function RevenueTrendChart({ data }: ChartProps) {
  return (
    <ChartContainer title="Revenue Trend" description="Monthly revenue in millions (USD)" height="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
              <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
          <Tooltip
            {...tooltipStyle}
            formatter={(value) => [`$${Number(value)}M`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={CHART_COLORS[0]}
            fill="url(#revenueGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
})

export const MonthlySalesChart = memo(function MonthlySalesChart({ data }: ChartProps) {
  return (
    <ChartContainer title="Monthly Sales" description="Weekly sales vs target (millions USD)" height="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="value" name="Actual" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
          <Bar dataKey="secondary" name="Target" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
})

export const TopCategoriesChart = memo(function TopCategoriesChart({ data }: ChartProps) {
  return (
    <ChartContainer title="Top Categories" description="Revenue share by product category (%)" height="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
          <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
          <YAxis dataKey="label" type="category" width={100} tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
          <Tooltip {...tooltipStyle} formatter={(value) => [`${Number(value)}%`, 'Share']} />
          <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
})

export const StorePerformanceChart = memo(function StorePerformanceChart({ data }: ChartProps) {
  return (
    <ChartContainer title="Store Performance" description="Top stores by revenue (millions USD)" height="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)" interval={0} angle={-20} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
          <Tooltip
            {...tooltipStyle}
            formatter={(value) => [`$${Number(value)}M`, 'Revenue']}
          />
          <Bar dataKey="value" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
})

export const CustomerGrowthChart = memo(function CustomerGrowthChart({ data }: ChartProps) {
  return (
    <ChartContainer title="Customer Growth" description="Active customers (millions)" height="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
          <Tooltip {...tooltipStyle} formatter={(value) => [`${Number(value)}M`, 'Customers']} />
          <Line type="monotone" dataKey="value" stroke={CHART_COLORS[3]} strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
})

export const RevenueByRegionChart = memo(function RevenueByRegionChart({ data }: ChartProps) {
  return (
    <ChartContainer title="Revenue by Region" description="Regional revenue contribution (%)" height="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50}
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} formatter={(value) => [`${Number(value)}%`, 'Share']} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
})

export const InventoryDistributionChart = memo(function InventoryDistributionChart({ data }: ChartProps) {
  return (
    <ChartContainer title="Inventory Distribution" description="Inventory status breakdown (%)" height="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, value }: { name?: string; value?: number }) =>
              `${name ?? ''}: ${value ?? 0}%`
            }
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} formatter={(value) => [`${Number(value)}%`, 'Share']} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
})
