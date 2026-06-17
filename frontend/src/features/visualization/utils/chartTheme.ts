import type { CSSProperties } from 'react'

/** Enterprise chart color palette — inherits CSS variables for theme support. */
export const CHART_COLORS = [
  'oklch(0.55 0.14 264)',
  'oklch(0.58 0.12 230)',
  'oklch(0.62 0.10 200)',
  'oklch(0.68 0.08 170)',
  'oklch(0.72 0.06 140)',
  'oklch(0.65 0.12 300)',
  'oklch(0.60 0.10 25)',
  'oklch(0.70 0.08 85)',
]

export const CHART_THEME = {
  colors: CHART_COLORS,
  grid: {
    strokeDasharray: '3 3',
    stroke: 'var(--color-border)',
    opacity: 0.5,
  },
  axis: {
    tick: { fontSize: 11 },
    stroke: 'var(--color-muted-foreground)',
  },
  legend: {
    wrapperStyle: { fontSize: '12px' } as CSSProperties,
  },
  margin: { top: 8, right: 8, left: 0, bottom: 0 },
  marginWithLegend: { top: 8, right: 8, left: 0, bottom: 4 },
  barRadius: [4, 4, 0, 0] as [number, number, number, number],
  barRadiusHorizontal: [0, 4, 4, 0] as [number, number, number, number],
  strokeWidth: 2,
  dotRadius: 3,
}

export const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    fontSize: '12px',
    color: 'var(--color-foreground)',
  },
  labelStyle: {
    color: 'var(--color-muted-foreground)',
  },
}

export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length]
}

/** Light/dark mode uses CSS variables — charts inherit automatically. */
export function getThemeMode(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}
