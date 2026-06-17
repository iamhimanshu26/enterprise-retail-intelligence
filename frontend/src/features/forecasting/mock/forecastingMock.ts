import type { ForecastingReport } from '@/types/forecasting'

function fp(
  date: string,
  value: number,
  model = 'moving_average',
  trend = 'stable',
  horizon = 1,
): import('@/types/forecasting').ForecastPoint {
  return {
    forecast_date: date,
    predicted_value: value,
    confidence_low: value * 0.92,
    confidence_high: value * 1.08,
    trend_direction: trend,
    model_name: model,
    forecast_horizon: horizon,
  }
}

export const FORECASTING_MOCK_REPORT: ForecastingReport = {
  overview: {
    sprint: '7.2',
    status: 'forecasting_center_ready',
    modules: ['sales', 'revenue', 'demand', 'inventory', 'stores', 'accuracy', 'scenarios'],
    data_source: 'mock',
    supported_models: ['moving_average', 'linear_regression', 'seasonal_naive', 'exponential_smoothing'],
  },
  sales: {
    daily: {
      granularity: 'daily',
      model_name: 'exponential_smoothing',
      horizon: 14,
      points: [
        fp('2025-06-16', 1240, 'exponential_smoothing', 'upward', 1),
        fp('2025-06-17', 1265, 'exponential_smoothing', 'upward', 2),
        fp('2025-06-18', 1288, 'exponential_smoothing', 'upward', 3),
        fp('2025-06-19', 1310, 'exponential_smoothing', 'upward', 4),
        fp('2025-06-20', 1295, 'exponential_smoothing', 'stable', 5),
      ],
    },
    weekly: {
      granularity: 'weekly',
      model_name: 'moving_average',
      horizon: 8,
      points: [
        fp('2025-06-22', 8420, 'moving_average', 'upward', 1),
        fp('2025-06-29', 8680, 'moving_average', 'upward', 2),
        fp('2025-07-06', 8910, 'moving_average', 'upward', 3),
        fp('2025-07-13', 9050, 'moving_average', 'stable', 4),
      ],
    },
    monthly: {
      granularity: 'monthly',
      model_name: 'linear_regression',
      horizon: 6,
      points: [
        fp('2025-07-01', 35200, 'linear_regression', 'upward', 1),
        fp('2025-08-01', 36150, 'linear_regression', 'upward', 2),
        fp('2025-09-01', 37200, 'linear_regression', 'upward', 3),
      ],
    },
  },
  revenue: {
    daily: {
      granularity: 'daily',
      model_name: 'exponential_smoothing',
      horizon: 14,
      points: [
        fp('2025-06-16', 485000, 'exponential_smoothing', 'upward', 1),
        fp('2025-06-17', 492000, 'exponential_smoothing', 'upward', 2),
        fp('2025-06-18', 498500, 'exponential_smoothing', 'upward', 3),
      ],
    },
    weekly: {
      granularity: 'weekly',
      model_name: 'moving_average',
      horizon: 8,
      points: [
        fp('2025-06-22', 3280000, 'moving_average', 'upward', 1),
        fp('2025-06-29', 3355000, 'moving_average', 'upward', 2),
      ],
    },
    monthly: {
      granularity: 'monthly',
      model_name: 'linear_regression',
      horizon: 6,
      points: [
        fp('2025-07-01', 14200000, 'linear_regression', 'upward', 1),
        fp('2025-08-01', 14580000, 'linear_regression', 'upward', 2),
        fp('2025-09-01', 14920000, 'linear_regression', 'upward', 3),
        fp('2025-10-01', 15250000, 'linear_regression', 'upward', 4),
        fp('2025-11-01', 15600000, 'linear_regression', 'upward', 5),
        fp('2025-12-01', 16120000, 'linear_regression', 'upward', 6),
      ],
    },
    quarterly: {
      granularity: 'quarterly',
      model_name: 'seasonal_naive',
      horizon: 4,
      points: [
        fp('2025-09-30', 44500000, 'seasonal_naive', 'upward', 1),
        fp('2025-12-31', 46800000, 'seasonal_naive', 'upward', 2),
      ],
    },
  },
  demand: {
    product_demand: [
      { dimension: 'SKU-1042', dimension_type: 'product', predicted_demand: 1840, trend_direction: 'upward', model_name: 'moving_average' },
      { dimension: 'SKU-2088', dimension_type: 'product', predicted_demand: 1620, trend_direction: 'upward', model_name: 'moving_average' },
      { dimension: 'SKU-3310', dimension_type: 'product', predicted_demand: 980, trend_direction: 'stable', model_name: 'moving_average' },
      { dimension: 'SKU-4501', dimension_type: 'product', predicted_demand: 720, trend_direction: 'downward', model_name: 'moving_average' },
    ],
    category_demand: [
      { dimension: 'Electronics', dimension_type: 'category', predicted_demand: 5200, trend_direction: 'upward', model_name: 'linear_regression' },
      { dimension: 'Apparel', dimension_type: 'category', predicted_demand: 4100, trend_direction: 'stable', model_name: 'linear_regression' },
      { dimension: 'Grocery', dimension_type: 'category', predicted_demand: 6800, trend_direction: 'upward', model_name: 'linear_regression' },
      { dimension: 'Home', dimension_type: 'category', predicted_demand: 2900, trend_direction: 'downward', model_name: 'linear_regression' },
    ],
    fast_moving: [
      { dimension: 'SKU-1042', dimension_type: 'product', predicted_demand: 1840, trend_direction: 'upward', model_name: 'moving_average' },
      { dimension: 'SKU-2088', dimension_type: 'product', predicted_demand: 1620, trend_direction: 'upward', model_name: 'moving_average' },
    ],
    slow_moving: [
      { dimension: 'SKU-4501', dimension_type: 'product', predicted_demand: 720, trend_direction: 'downward', model_name: 'moving_average' },
      { dimension: 'SKU-9920', dimension_type: 'product', predicted_demand: 410, trend_direction: 'downward', model_name: 'moving_average' },
    ],
  },
  inventory: {
    items: [
      {
        product_code: 'SKU-1042',
        expected_usage: 420,
        stock_out_risk_score: 0.82,
        reorder_recommendation: 'urgent_reorder',
        days_until_stock_out: 5.2,
        reorder_quantity_placeholder: 800,
        current_stock: 180,
      },
      {
        product_code: 'SKU-2088',
        expected_usage: 310,
        stock_out_risk_score: 0.58,
        reorder_recommendation: 'reorder_soon',
        days_until_stock_out: 12.4,
        reorder_quantity_placeholder: 500,
        current_stock: 420,
      },
      {
        product_code: 'SKU-3310',
        expected_usage: 195,
        stock_out_risk_score: 0.35,
        reorder_recommendation: 'monitor',
        days_until_stock_out: 28.0,
        reorder_quantity_placeholder: 250,
        current_stock: 890,
      },
      {
        product_code: 'SKU-4501',
        expected_usage: 88,
        stock_out_risk_score: 0.22,
        reorder_recommendation: 'adequate',
        days_until_stock_out: 45.0,
        reorder_quantity_placeholder: 0,
        current_stock: 1200,
      },
    ],
    aggregate_stock_out_risk: 0.49,
  },
  stores: {
    stores: [
      {
        store_code: 'TOK-01',
        predicted_revenue: 4200000,
        predicted_orders: 12400,
        revenue_trend: 'upward',
        order_trend: 'upward',
        performance_risk_score: 0.18,
        classification: 'high_growth',
      },
      {
        store_code: 'OSA-02',
        predicted_revenue: 3850000,
        predicted_orders: 11200,
        revenue_trend: 'upward',
        order_trend: 'stable',
        performance_risk_score: 0.24,
        classification: 'high_growth',
      },
      {
        store_code: 'KYO-03',
        predicted_revenue: 2980000,
        predicted_orders: 8900,
        revenue_trend: 'stable',
        order_trend: 'stable',
        performance_risk_score: 0.42,
        classification: 'stable',
      },
      {
        store_code: 'SAP-04',
        predicted_revenue: 2100000,
        predicted_orders: 6200,
        revenue_trend: 'downward',
        order_trend: 'downward',
        performance_risk_score: 0.71,
        classification: 'declining',
      },
    ],
    high_growth_stores: ['TOK-01', 'OSA-02'],
    declining_stores: ['SAP-04'],
  },
  accuracy: {
    metrics: [
      {
        metric_name: 'revenue',
        model_name: 'exponential_smoothing',
        mae: 125000,
        rmse: 168000,
        mape: 8.4,
        smape: 8.1,
        bias: -2.3,
        accuracy_score: 91.6,
      },
      {
        metric_name: 'sales_volume',
        model_name: 'moving_average',
        mae: 142,
        rmse: 198,
        mape: 6.2,
        smape: 6.0,
        bias: 1.1,
        accuracy_score: 93.8,
      },
    ],
    overall_accuracy_score: 92.7,
  },
  scenarios: {
    scenarios: [
      { scenario: 'optimistic', metric: 'revenue', base_value: 14200000, adjusted_value: 15620000, adjustment_pct: 10 },
      { scenario: 'realistic', metric: 'revenue', base_value: 14200000, adjusted_value: 14200000, adjustment_pct: 0 },
      { scenario: 'pessimistic', metric: 'revenue', base_value: 14200000, adjusted_value: 12780000, adjustment_pct: -10 },
    ],
  },
  execution_time_seconds: 0.42,
}
