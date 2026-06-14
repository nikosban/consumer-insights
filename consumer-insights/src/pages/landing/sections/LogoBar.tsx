const LOGOS = [
  { src: '/logos/google.svg',  alt: 'Google'   },
  { src: '/logos/samsung.svg', alt: 'Samsung'  },
  { src: '/logos/adobe.svg',   alt: 'Adobe'    },
  { src: '/logos/paypal.svg',  alt: 'PayPal'   },
  { src: '/logos/pg.svg',      alt: 'P&G'      },
  { src: '/logos/tmobile.svg', alt: 'T-Mobile' },
]

const TRACK = [...LOGOS, ...LOGOS, ...LOGOS]

export function LogoBar() {
  return (
    <section className="bg-muted py-6">
      <p className="text-center text-xs font-medium text-muted-foreground mb-5 uppercase tracking-[0.08em]">
        Trusted by research teams at
      </p>

      <div
        className="overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      >
        <div
          className="flex items-center gap-16"
          style={{ width: 'max-content', animation: 'marquee-ltr 28s linear infinite' }}
        >
          {TRACK.map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              draggable={false}
              className="h-5 w-auto object-contain brightness-0 opacity-35 hover:opacity-65 transition-opacity duration-200"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
