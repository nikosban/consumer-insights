import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDashboardStore } from '@/store/dashboardStore'
import { useWidgetStore } from '@/store/widgetStore'
import { FileText, Presentation } from 'lucide-react'
import { toast } from '@/components/ui/Toaster'

type ExportModalProps = {
  dashboardId: string
  open: boolean
  onClose: () => void
}

export default function ExportModal({ dashboardId, open, onClose }: ExportModalProps) {
  const [exporting, setExporting] = useState<'pptx' | 'pdf' | null>(null)
  const { dashboards } = useDashboardStore()
  const { widgets } = useWidgetStore()
  const dashboard = dashboards.find((d) => d.id === dashboardId)

  async function handleExportPDF() {
    setExporting('pdf')
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: html2canvas } = await import('html2canvas')
      const canvas = document.querySelector('[data-dashboard-canvas]') as HTMLElement | null
      if (!canvas) return
      const img = await html2canvas(canvas, { scale: 1.5, useCORS: true })
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [img.width, img.height] })
      pdf.addImage(img.toDataURL('image/png'), 'PNG', 0, 0, img.width, img.height)
      pdf.save(`${dashboard?.name ?? 'dashboard'}.pdf`)
      toast.success('PDF exported')
    } finally {
      setExporting(null)
      onClose()
    }
  }

  async function handleExportPPTX() {
    setExporting('pptx')
    try {
      const pptxgen = (await import('pptxgenjs')).default
      const { default: html2canvas } = await import('html2canvas')
      const pptx = new pptxgen()
      pptx.layout = 'LAYOUT_WIDE'

      const widgetsOnDashboard = dashboard?.widgets ?? []

      for (const dw of widgetsOnDashboard) {
        const widget = widgets.find((w) => w.id === dw.widgetId)
        const el = document.querySelector(`[data-widget-id="${dw.widgetId}"]`) as HTMLElement | null
        const slide = pptx.addSlide()
        slide.addText(widget?.title ?? dw.widgetId, {
          x: 0.5, y: 0.3, w: '90%', h: 0.5,
          fontSize: 18, bold: true, color: '0666E5',
        })
        if (el) {
          const img = await html2canvas(el, { scale: 1.5, useCORS: true })
          slide.addImage({
            data: img.toDataURL('image/png'),
            x: 0.5, y: 1.0, w: 9, h: 5,
          })
        }
      }

      await pptx.writeFile({ fileName: `${dashboard?.name ?? 'dashboard'}.pptx` })
      toast.success('PPTX exported')
    } finally {
      setExporting(null)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Export Dashboard</DialogTitle>
          <DialogDescription>Choose an export format for "{dashboard?.name}"</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-2">
          <Button
            variant="outline"
            className="justify-start gap-3 h-14"
            onClick={handleExportPPTX}
            disabled={exporting !== null}
          >
            <Presentation className="h-5 w-5 text-primary" />
            <div className="text-left">
              <div className="font-medium">Export as PPTX</div>
              <div className="text-xs text-secondary-foreground">One slide per widget</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-3 h-14"
            onClick={handleExportPDF}
            disabled={exporting !== null}
          >
            <FileText className="h-5 w-5 text-primary" />
            <div className="text-left">
              <div className="font-medium">Export as PDF</div>
              <div className="text-xs text-secondary-foreground">Full dashboard as a single page</div>
            </div>
          </Button>
          {exporting && (
            <p className="text-xs text-muted-foreground text-center">Generating {exporting.toUpperCase()}…</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
