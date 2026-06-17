import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Brain,
  Cloud,
  Database,
  LineChart,
  Server,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { APP_NAME, APP_TAGLINE } from '@/lib/constants'
import { ENTERPRISE_PHASE_COUNT, PROJECT_ROADMAP, formatPhaseLabel } from '@/lib/roadmap'

const TECH_STACK = [
  { icon: Sparkles, label: 'React 19' },
  { icon: Server, label: 'Spring Boot 3' },
  { icon: Brain, label: 'FastAPI' },
  { icon: Database, label: 'PostgreSQL' },
  { icon: Cloud, label: 'Docker · K8s' },
  { icon: Workflow, label: 'ETL · Airflow' },
]

const ARCHITECTURE_PREVIEW = [
  'React frontend on Vercel edge',
  'Spring Boot API with JWT security',
  'Python data service for ETL & ML',
  'PostgreSQL with audit schemas',
]

export function LandingPage() {
  const previewPhases = PROJECT_ROADMAP.filter((phase) => phase.status !== 'locked').slice(0, 8)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Enterprise Retail Intelligence
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Forecast, analyze, and orchestrate retail data at scale.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {APP_TAGLINE}. A cloud-native platform for intelligence, ETL pipelines,
              statistics, and demand forecasting — built for enterprise teams.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
              >
                Launch platform
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/welcome#architecture"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                View architecture
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform overview */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Platform Overview</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Thirteen intelligence modules across a microservices architecture — from executive
          dashboards to forecasting and pipeline monitoring.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: BarChart3, title: 'Executive Dashboards', desc: 'KPI views for leadership' },
            { icon: LineChart, title: 'Forecasting Center', desc: 'Demand prediction & scenarios' },
            { icon: Workflow, title: 'ETL Pipeline Studio', desc: 'Data ingestion & transformation' },
            { icon: Brain, title: 'Statistics Lab', desc: 'Modeling & hypothesis testing' },
            { icon: Sparkles, title: 'Data Generator', desc: 'Synthetic retail datasets' },
            { icon: Cloud, title: 'Cloud-Native', desc: 'Docker, Kubernetes-ready' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <item.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="border-y border-border/60 bg-muted/20 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Technology Stack</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {TECH_STACK.map((tech) => (
              <span
                key={tech.label}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium"
              >
                <tech.icon className="h-4 w-4 text-primary" />
                {tech.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture preview */}
      <section id="architecture" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">Architecture Preview</h2>
        <div className="mt-8 rounded-xl border border-border/80 bg-card p-6 font-mono text-sm text-muted-foreground shadow-sm">
          <pre className="overflow-x-auto leading-relaxed">{`
  ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
  │   React UI  │────▶│ Spring Boot  │────▶│ PostgreSQL  │
  │   (Vercel)  │     │     API      │     │   Database  │
  └─────────────┘     └──────┬───────┘     └─────────────┘
                             │
                      ┌──────▼───────┐
                      │   FastAPI    │
                      │ Data Service │
                      └──────────────┘
          `.trim()}</pre>
          <ul className="mt-6 space-y-2 text-sm font-sans">
            {ARCHITECTURE_PREVIEW.map((line) => (
              <li key={line} className="flex items-center gap-2 text-foreground">
                <span className="h-1 w-1 rounded-full bg-primary" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Roadmap preview */}
      <section className="border-t border-border/60 bg-muted/20 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Roadmap Preview</h2>
          <p className="mt-2 text-muted-foreground">
            {ENTERPRISE_PHASE_COUNT} enterprise development phases from foundation to portfolio presentation.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {previewPhases.map((phase) => (
              <div
                key={phase.id}
                className="rounded-lg border border-border/80 bg-card px-4 py-3 shadow-sm"
              >
                <span className="text-xs font-semibold text-primary">{formatPhaseLabel(phase.phase)}</span>
                <p className="mt-1 text-sm font-medium">{phase.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-semibold">Ready to explore?</h2>
        <p className="mt-2 text-muted-foreground">Sign in with the demo account or continue as guest.</p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Sign in to platform
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <p className="text-sm font-medium">{APP_NAME} · v0.1.0</p>
          <p className="text-xs text-muted-foreground">
            © 2026 Retail Intelligence Platform. React · Spring Boot · FastAPI · PostgreSQL
          </p>
        </div>
      </footer>
    </div>
  )
}
