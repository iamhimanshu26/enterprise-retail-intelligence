import type { ChartContainerProps } from './ChartContainer'
import { ChartContainer } from './ChartContainer'

type ChartCardProps = Omit<ChartContainerProps, 'children'> & {
  children?: React.ReactNode
}

export function LineChartCard(props: ChartCardProps) {
  return <ChartContainer {...props} />
}

export function BarChartCard(props: ChartCardProps) {
  return <ChartContainer {...props} />
}

export function PieChartCard(props: ChartCardProps) {
  return <ChartContainer {...props} />
}

export function AreaChartCard(props: ChartCardProps) {
  return <ChartContainer {...props} />
}
