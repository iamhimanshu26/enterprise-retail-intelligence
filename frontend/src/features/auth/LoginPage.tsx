import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { APP_NAME, APP_TAGLINE, DEMO_CREDENTIALS } from '@/lib/constants'
import { cn } from '@/lib/cn'

const FEATURES = [
  { icon: TrendingUp, label: 'Retail Intelligence', desc: 'Unified analytics across operations' },
  { icon: Sparkles, label: 'Forecasting Engine', desc: 'Demand prediction & scenarios' },
  { icon: Shield, label: 'Enterprise Security', desc: 'JWT auth & role-based access' },
  { icon: Zap, label: 'Real-time Pipelines', desc: 'ETL orchestration at scale' },
]

export function LoginPage() {
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const success = await login(email, password)
      if (success) {
        navigate('/')
      } else {
        setError('Invalid credentials. Use the demo account below.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Brand panel */}
      <div className="relative hidden w-[52%] overflow-hidden lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-[oklch(0.22_0.04_264)] to-primary/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,_oklch(0.55_0.14_264_/_0.25)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_oklch(0.58_0.12_230_/_0.15)_0%,_transparent_50%)]" />

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 flex flex-1 flex-col justify-between p-12 xl:p-16">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/10">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">{APP_NAME}</p>
              <p className="text-sm text-white/50">{APP_TAGLINE}</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="max-w-lg space-y-8"
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-white/40">
                Enterprise Edition
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-[1.15] tracking-tight text-white xl:text-5xl">
                Intelligence platform for{' '}
                <span className="text-white/60">modern retail.</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-white/55">
                Forecast demand, analyze operations, and orchestrate data pipelines —
                built for Fortune 500 retail teams.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-sm"
                >
                  <feature.icon className="h-5 w-5 text-white/70" />
                  <p className="mt-2 text-sm font-medium text-white">{feature.label}</p>
                  <p className="mt-0.5 text-xs text-white/45">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <p className="text-xs text-white/30">
            © 2026 Retail Intelligence Platform · Enterprise SaaS
          </p>
        </div>
      </div>

      {/* Login card */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{APP_NAME}</p>
                <p className="text-xs text-muted-foreground">{APP_TAGLINE}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-8 shadow-lg shadow-black/[0.03]">
            <h2 className="text-xl font-semibold tracking-tight">Sign in</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Access your enterprise intelligence workspace
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-60',
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Continue to dashboard'
                )}
              </button>
            </form>
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Demo access
            </p>
            <p className="mt-2 font-mono text-xs text-foreground">{DEMO_CREDENTIALS.email}</p>
            <p className="font-mono text-xs text-foreground">{DEMO_CREDENTIALS.password}</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
