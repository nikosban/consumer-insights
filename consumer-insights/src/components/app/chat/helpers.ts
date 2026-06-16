import { toast } from '@/components/ui/Toaster'

export async function exportElAsPng(el: HTMLElement, filename: string) {
  const { default: html2canvas } = await import('html2canvas')
  const canvas = await html2canvas(el, { scale: 2, useCORS: true })
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = filename
  a.click()
  toast.success('PNG exported')
}

export async function copyElAsPng(el: HTMLElement) {
  const { default: html2canvas } = await import('html2canvas')
  const canvas = await html2canvas(el, { scale: 2, useCORS: true })
  canvas.toBlob(blob => {
    if (!blob) return
    navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      .then(() => toast.success('Image copied to clipboard'))
      .catch(() => toast.error('Copy failed'))
  })
}
