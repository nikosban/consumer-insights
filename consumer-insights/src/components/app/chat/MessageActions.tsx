import { useState } from 'react'
import { IconCopy, IconCheck, IconThumbUp, IconThumbDown, IconEdit } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/Toaster'

export function MessageActions({ text, role = 'user' }: { text: string; role?: 'user' | 'assistant' }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Response copied'))
      .catch(() => toast.error('Copy failed'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const copyBtn = (
    <button
      title={copied ? 'Copied!' : 'Copy'}
      onClick={handleCopy}
      className={cn('flex items-center justify-center h-6 w-6 rounded transition-colors',
        copied ? 'text-green-600' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}
    >
      {copied ? <IconCheck size={12} strokeWidth={2} /> : <IconCopy size={12} strokeWidth={2} />}
    </button>
  )

  if (role === 'assistant') {
    return (
      <div className="flex items-center gap-0.5 mt-1">
        <button title="This response was good" className="flex items-center justify-center h-6 w-6 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <IconThumbUp size={12} strokeWidth={2} />
        </button>
        <button title="This response was not good" className="flex items-center justify-center h-6 w-6 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <IconThumbDown size={12} strokeWidth={2} />
        </button>
        {copyBtn}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-0.5 mt-1">
      {copyBtn}
      <button
        title="Edit and resend"
        onClick={() => document.dispatchEvent(new CustomEvent('set-chat-input', { detail: text }))}
        className="flex items-center justify-center h-6 w-6 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <IconEdit size={12} strokeWidth={2} />
      </button>
    </div>
  )
}
