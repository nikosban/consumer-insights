import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BarChart2, LayoutDashboard, Sparkles } from 'lucide-react'

const FEATURES = [
  {
    icon: Users,
    title: 'Audience Builder',
    description: 'Define precise audience segments with flexible filter groups. Combine age, device, income, interests and more.',
  },
  {
    icon: BarChart2,
    title: 'Chart Creator',
    description: 'Build bar, line, pie, scorecard, and table charts. Compare audiences against benchmarks in seconds.',
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboard Builder',
    description: 'Drag-and-drop widgets onto a live canvas. Share read-only links with stakeholders in one click.',
  },
  {
    icon: Sparkles,
    title: 'Research AI',
    description: 'Ask natural language questions. Get data-backed insights with one-click handoffs to build audiences and charts.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
      <header className="h-14 border-b border-border flex items-center px-6">
        <span className="font-bold text-primary text-xl mr-2">CI</span>
        <span className="font-semibold text-foreground">Consumer Insights</span>
        <span className="ml-1 text-xs text-muted-foreground hidden sm:inline">by Statista</span>
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={() => navigate('/research-ai')}>
            Open App
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-6 bg-gradient-to-b from-primary/5 to-background">
        <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          Powered by Statista data
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground max-w-2xl leading-tight mb-4">
          Understand your audience.{' '}
          <span className="text-primary">Faster.</span>
        </h1>
        <p className="text-base text-muted-foreground max-w-xl mb-8">
          Consumer Insights combines AI-driven research, powerful audience segmentation, and interactive dashboards — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" onClick={() => navigate('/research-ai')}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/research-ai')}>
            Explore Research AI
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-foreground text-center mb-10">
          Everything you need to know your audience
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <Card key={f.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-sm font-semibold">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-primary py-12 px-6 text-center text-primary-foreground">
        <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
        <p className="text-sm text-primary-foreground/80 mb-6">
          Jump straight into the workspace and start building audiences, charts, and dashboards.
        </p>
        <Button
          size="lg"
          variant="secondary"
          onClick={() => navigate('/workspace')}
        >
          Open Workspace
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 text-center">
        <p className="text-xs text-muted-foreground">Consumer Insights by Statista &mdash; prototype</p>
      </footer>
    </div>
  )
}
