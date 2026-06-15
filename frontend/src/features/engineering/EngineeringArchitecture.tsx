import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  Boxes,
  Brain,
  Cloud,
  Code2,
  Database,
  FolderTree,
  GitBranch,
  Layers,
  LineChart,
  Monitor,
  Network,
  Server,
  Settings,
  Workflow,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Breadcrumb,
  PageHeader,
  SectionContainer,
  StatusBadge,
} from '@/components/design-system'
import type { ArchitectureSection, StatusVariant } from '@/types'
import { cn } from '@/lib/cn'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const ARCHITECTURE_SECTIONS: ArchitectureSection[] = [
  {
    id: 'overall',
    title: 'Overall System Architecture',
    description: 'Microservices-based platform with React frontend, Spring Boot API gateway, Python data service, and PostgreSQL persistence layer.',
    icon: 'network',
    status: 'foundation',
    phase: 0,
  },
  {
    id: 'tech-stack',
    title: 'Technology Stack',
    description: 'React 19, Java 21 Spring Boot 3, Python 3.12 FastAPI, PostgreSQL, Docker, Kubernetes-ready infrastructure.',
    icon: 'layers',
    status: 'foundation',
    phase: 0,
  },
  {
    id: 'frontend',
    title: 'Frontend Architecture',
    description: 'Feature-based React architecture with design system, TanStack Query, Zustand state management, and protected routing.',
    icon: 'code2',
    status: 'foundation',
    phase: 0,
  },
  {
    id: 'backend',
    title: 'Backend Architecture',
    description: 'Spring Boot microservice with JWT authentication, feature packages, global exception handling, and OpenAPI documentation.',
    icon: 'server',
    status: 'foundation',
    phase: 0,
  },
  {
    id: 'python',
    title: 'Python Service Architecture',
    description: 'FastAPI service prepared for pandas, numpy, polars, scikit-learn, and statsmodels integration.',
    icon: 'brain',
    status: 'foundation',
    phase: 0,
  },
  {
    id: 'data-flow',
    title: 'Data Flow',
    description: 'End-to-end data movement from ingestion through transformation, analytics, and visualization layers.',
    icon: 'arrow',
    status: 'planned',
    phase: 1,
  },
  {
    id: 'etl',
    title: 'ETL Pipeline',
    description: 'Batch and streaming ETL pipelines with validation, error handling, and pipeline orchestration.',
    icon: 'workflow',
    status: 'planned',
    phase: 1,
  },
  {
    id: 'analytics',
    title: 'Analytics Pipeline',
    description: 'Real-time and batch analytics processing with dimensional modeling and OLAP capabilities.',
    icon: 'barChart',
    status: 'planned',
    phase: 2,
  },
  {
    id: 'statistics',
    title: 'Statistics Engine',
    description: 'Hypothesis testing, regression analysis, time series decomposition, and statistical modeling.',
    icon: 'activity',
    status: 'planned',
    phase: 3,
  },
  {
    id: 'forecasting',
    title: 'Forecasting Engine',
    description: 'Demand forecasting with ARIMA, Prophet, ML ensembles, and scenario planning capabilities.',
    icon: 'lineChart',
    status: 'planned',
    phase: 4,
  },
  {
    id: 'database',
    title: 'Database Schema',
    description: 'Normalized retail data model with star schema for analytics, audit trails, and temporal tables.',
    icon: 'database',
    status: 'planned',
    phase: 1,
  },
  {
    id: 'microservices',
    title: 'Microservice Communication',
    description: 'REST APIs, async messaging, service discovery, and circuit breaker patterns for resilience.',
    icon: 'gitBranch',
    status: 'foundation',
    phase: 0,
  },
  {
    id: 'events',
    title: 'Event Architecture',
    description: 'Event-driven architecture with message queues, event sourcing, and CQRS patterns.',
    icon: 'boxes',
    status: 'future',
    phase: 5,
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes Deployment',
    description: 'Container orchestration with Helm charts, auto-scaling, service mesh, and GitOps deployment.',
    icon: 'cloud',
    status: 'planned',
    phase: 5,
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Observability',
    description: 'Distributed tracing, metrics collection, log aggregation, and alerting with Prometheus and Grafana.',
    icon: 'monitor',
    status: 'planned',
    phase: 5,
  },
  {
    id: 'folder-structure',
    title: 'Folder Structure',
    description: 'Enterprise monorepo with independently deployable services and feature-based organization.',
    icon: 'folderTree',
    status: 'foundation',
    phase: 0,
  },
  {
    id: 'timeline',
    title: 'Development Timeline',
    description: 'Six-phase roadmap from foundation through production release with incremental capability delivery.',
    icon: 'settings',
    status: 'foundation',
    phase: 0,
  },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  network: Network,
  layers: Layers,
  code2: Code2,
  server: Server,
  brain: Brain,
  arrow: ArrowRightLeft,
  workflow: Workflow,
  barChart: BarChart3,
  activity: Activity,
  lineChart: LineChart,
  database: Database,
  gitBranch: GitBranch,
  boxes: Boxes,
  cloud: Cloud,
  monitor: Monitor,
  folderTree: FolderTree,
  settings: Settings,
}

function ArchitectureCard({ section }: { section: ArchitectureSection }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = iconMap[section.icon] ?? Server

  return (
    <motion.div
      layout
      className="glass-panel overflow-hidden rounded-xl transition-shadow hover:shadow-md"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">{section.title}</h3>
            <StatusBadge status={section.status as StatusVariant} />
            <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              Phase {section.phase}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{section.description}</p>
        </div>
        <ChevronDown
          className={cn(
            'mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform',
            expanded && 'rotate-180',
          )}
        />
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-border bg-muted/20 px-5 py-4"
        >
          <p className="text-sm text-muted-foreground">{section.description}</p>
          <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-dashed border-border bg-background/50">
            <p className="text-xs text-muted-foreground">
              Interactive diagram placeholder — Phase {section.phase}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export function EngineeringArchitecture() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Engineering Architecture"
        description="Internal engineering documentation portal for system design, technology decisions, and development roadmap."
        badge={{ status: 'foundation', label: 'Phase 0' }}
      />

      <Breadcrumb items={[{ label: 'Engineering Architecture' }]} />

      <SectionContainer
        title="System Design Reference"
        description="Expand each section to view architecture details. Interactive diagrams will be added in future phases."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {ARCHITECTURE_SECTIONS.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <ArchitectureCard section={section} />
            </motion.div>
          ))}
        </div>
      </SectionContainer>
    </div>
  )
}
