import type {
  BusinessSummaryItem,
  ExecutiveSummary,
  RegionalHighlight,
} from '@/types/dashboard'

export const MOCK_EXECUTIVE_SUMMARY: ExecutiveSummary = {
  summary:
    'Revenue increased by 14.8% compared to last month, driven by electronics and APAC expansion.',
  highlights: [
    'Electronics remain the highest-performing category with 34.2% share.',
    'Tokyo region contributes 32% of total sales.',
    'Customer acquisition grew 8.6% with strong mobile conversion.',
  ],
  tags: ['Revenue Growth', 'Electronics', 'APAC', 'Executive KPIs'],
  recommendation:
    'Prioritize inventory replenishment for top electronics SKUs and expand Tokyo-region promotions while monitoring Kansai performance.',
}

export const MOCK_BUSINESS_SUMMARY: BusinessSummaryItem[] = [
  {
    id: 'bs1',
    label: 'Average Order Value',
    value: '$139.80',
    change: '+6.4%',
    trend: 'up',
    description: 'Up from $131.40 last period',
  },
  {
    id: 'bs2',
    label: 'Conversion Rate',
    value: '3.8%',
    change: '+0.4pp',
    trend: 'up',
    description: 'E-commerce conversion improved across mobile',
  },
  {
    id: 'bs3',
    label: 'Return Rate',
    value: '2.1%',
    change: '-0.3pp',
    trend: 'up',
    description: 'Quality improvements reduced product returns',
  },
  {
    id: 'bs4',
    label: 'Fulfillment SLA',
    value: '98.6%',
    change: '+1.2pp',
    trend: 'up',
    description: 'Same-day and next-day delivery performance',
  },
]

export const MOCK_REGIONAL_HIGHLIGHTS: RegionalHighlight[] = [
  {
    id: 'rh1',
    label: 'Top Performing Region',
    region: 'Tokyo',
    value: '$39.9M',
    metric: 'Revenue',
    trend: 'up',
  },
  {
    id: 'rh2',
    label: 'Lowest Performing Region',
    region: 'Kansai',
    value: '$8.2M',
    metric: 'Revenue',
    trend: 'down',
  },
  {
    id: 'rh3',
    label: 'Fastest Growing Region',
    region: 'Southeast Asia',
    value: '+24.6%',
    metric: 'Growth',
    trend: 'up',
  },
  {
    id: 'rh4',
    label: 'Highest Profit Region',
    region: 'North America',
    value: '28.4%',
    metric: 'Margin',
    trend: 'up',
  },
]
