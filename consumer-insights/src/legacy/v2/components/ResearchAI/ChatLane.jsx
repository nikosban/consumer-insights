import { useState } from 'react'
import s from './ChatLane.module.css'
import { ANSWER_KEYFACTS, TABLE_ROWS, STEP_SEARCH_1, STEP_SEARCH_2, STEP_SELECTED, CODE_LINES, SOURCES } from '../../data/ciModeData'
import TypeIcon from './TypeIcon'
import DatawizWidget from './DatawizWidget'
import { buildDeepLink } from '../../utils/buildDeepLink'

/* ── Author icon (purple — from prototype IconAuthorIcon) ── */
const IconAuthorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={s.authorIcon}>
    <circle cx="12" cy="12" r="12" fill="#F0ECFC"/>
    <path d="M9.5 8C9.71522 8 9.90655 8.13763 9.97461 8.3418L10.8955 11.1045L13.6582 12.0254L13.7314 12.0566C13.8946 12.1417 14 12.3117 14 12.5C14 12.7152 13.8624 12.9066 13.6582 12.9746L10.8955 13.8955L9.97461 16.6582C9.90655 16.8624 9.71522 17 9.5 17C9.28478 17 9.09345 16.8624 9.02539 16.6582L8.10449 13.8955L5.3418 12.9746C5.13763 12.9066 5 12.7152 5 12.5C5 12.2848 5.13763 12.0934 5.3418 12.0254L8.10449 11.1045L9.02539 8.3418L9.05664 8.26855C9.14174 8.1054 9.31168 8 9.5 8Z" fill="#7E3ED8"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M14.5 14C14.7152 14 14.9066 14.1376 14.9746 14.3418L15.3955 15.6045L16.6582 16.0254L16.7314 16.0566C16.8946 16.1417 17 16.3117 17 16.5C17 16.7152 16.8624 16.9066 16.6582 16.9746L15.3955 17.3955L14.9746 18.6582C14.9066 18.8624 14.7152 19 14.5 19C14.2848 19 14.0934 18.8624 14.0254 18.6582L13.6045 17.3955L12.3418 16.9746C12.1376 16.9066 12 16.7152 12 16.5C12 12.2848 12.1376 16.0934 12.3418 16.0254L13.6045 15.6045L14.0254 14.3418L14.0566 14.2686C14.1417 14.1054 14.3117 14 14.5 14Z" fill="#7E3ED8"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M15.5 6C15.7152 6 15.9066 6.13763 15.9746 6.3418L16.3955 7.60449L17.6582 8.02539L17.7314 8.05664C17.8946 8.14174 18 8.31168 18 8.5C18 8.71522 17.8624 8.90655 17.6582 8.97461L16.3955 9.39551L15.9746 10.6582C15.9066 10.8624 15.7152 11 15.5 11C15.2848 11 15.0934 10.8624 15.0254 10.6582L14.6045 9.39551L13.3418 8.97461C13.1376 8.90655 13 8.71522 13 8.5C13 8.28478 13.1376 8.09345 13.3418 8.02539L14.6045 7.60449L15.0254 6.3418L15.0566 6.26855C15.1417 6.1054 15.3117 6 15.5 6Z" fill="#7E3ED8"/>
  </svg>
)

/* ── User avatar (blue) ── */
const IconUserAvatar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="12" fill="#E5F1FF"/>
    <path d="M13.5001 9C13.5001 8.80109 13.5791 8.61032 13.7197 8.46967C13.8604 8.32902 14.0512 8.25 14.2501 8.25H19.2501C19.449 8.25 19.6397 8.32902 19.7804 8.46967C19.921 8.61032 20.0001 8.80109 20.0001 9C20.0001 9.19891 19.921 9.38968 19.7804 9.53033C19.6397 9.67098 19.449 9.75 19.2501 9.75H14.2501C14.0512 9.75 13.8604 9.67098 13.7197 9.53033C13.5791 9.38968 13.5001 9.19891 13.5001 9ZM19.2501 11.25H14.2501C14.0512 11.25 13.8604 11.329 13.7197 11.4697C13.5791 11.6103 13.5001 11.8011 13.5001 12C13.5001 12.1989 13.5791 12.3897 13.7197 12.5303C13.8604 12.671 14.0512 12.75 14.2501 12.75H19.2501C19.449 12.75 19.6397 12.671 19.7804 12.5303C19.921 12.3897 20.0001 12.1989 20.0001 12C20.0001 11.8011 19.921 11.6103 19.7804 11.4697C19.6397 11.329 19.449 11.25 19.2501 11.25ZM19.2501 14.25H15.7501C15.5512 14.25 15.3604 14.329 15.2197 14.4697C15.0791 14.6103 15.0001 14.8011 15.0001 15C15.0001 15.1989 15.0791 15.3897 15.2197 15.5303C15.3604 15.671 15.5512 15.75 15.7501 15.75H19.2501C19.449 15.75 19.6397 15.671 19.7804 15.5303C19.921 15.3897 20.0001 15.1989 20.0001 15C20.0001 14.8011 19.921 14.6103 19.7804 14.4697C19.6397 14.329 19.449 14.25 19.2501 14.25ZM9.00006 12.25C9.34618 12.25 9.68453 12.1474 9.97231 11.9551C10.2601 11.7628 10.4844 11.4895 10.6169 11.1697C10.7493 10.8499 10.784 10.4981 10.7164 10.1586C10.6489 9.81913 10.4822 9.50731 10.2375 9.26257C9.99276 9.01782 9.68094 8.85115 9.34147 8.78363C9.00201 8.7161 8.65014 8.75076 8.33037 8.88321C8.0106 9.01567 7.73728 9.23997 7.54499 9.52775C7.3527 9.81554 7.25006 10.1539 7.25006 10.5C7.25006 10.7298 7.29533 10.9574 7.38327 11.1697C7.47122 11.382 7.60012 11.5749 7.76263 11.7374C8.09082 12.0656 8.53593 12.25 9.00006 12.25Z" fill="#0666E5"/>
  </svg>
)

/* ── Progress ring (size=20, purple — from prototype) ── */
function ProgressRing({ pct, size = 20 }) {
  const r = 7
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(Math.max(pct, 0), 1))
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={s.ring}>
      <circle cx="10" cy="10" r={r} fill="none" stroke="#e8eef5" strokeWidth="3"/>
      <circle cx="10" cy="10" r={r} fill="none" stroke="#7E3ED8" strokeWidth="3"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 10 10)"/>
    </svg>
  )
}

/* ── Inline source badge ── */
function InlineBadge({ n, onEnter, onLeave }) {
  const href = buildDeepLink(SOURCES[n - 1])
  return (
    <a
      href={href}
      data-badge={n}
      className={s.inlineBadge}
      onMouseEnter={(e) => onEnter?.(n, e.currentTarget.getBoundingClientRect())}
      onMouseLeave={() => onLeave?.()}
    >
      {n}
    </a>
  )
}

/* ── Answering Steps ── */
function AnsweringSteps() {
  return (
    <div className={s.stepsSection}>
      <div className={s.stepsTimeline} />

      {/* 1 — Analyzing */}
      <div className={s.stepRow}>
        <div className={s.stepDot} />
        <span className={s.stepLabel}>Analyzing request</span>
      </div>

      {/* 2 — Search 1 */}
      <div className={s.stepRowCol}>
        <div className={s.stepRow}>
          <div className={s.stepDot} />
          <span className={s.stepLabel}>Searching Statista database</span>
        </div>
        <div className={s.stepIndent}>
          <div className={s.searchTag}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="4.8" cy="4.8" r="3.3" stroke="#0666e5" strokeWidth="1.2"/>
              <path d="M7.2 7.2l2.2 2.2" stroke="#0666e5" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className={s.searchTagText}>gaming console market revenue worldwide 2019–2029</span>
          </div>
          <div className={s.sourcesBox}>
            {STEP_SEARCH_1.map((item, i) => (
              <div key={i} className={s.sourceRow}>
                <TypeIcon type={item.type} size={20} />
                <span className={s.sourceRowTitle}>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3 — Search 2 */}
      <div className={s.stepRowCol}>
        <div className={s.stepRow}>
          <div className={s.stepDot} />
          <span className={s.stepLabel}>Searching Statista database</span>
        </div>
        <div className={s.stepIndent}>
          <div className={s.searchTag}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="4.8" cy="4.8" r="3.3" stroke="#0666e5" strokeWidth="1.2"/>
              <path d="M7.2 7.2l2.2 2.2" stroke="#0666e5" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className={s.searchTagText}>console market leaders revenue share Sony Microsoft Nintendo 2024</span>
          </div>
          <div className={s.sourcesBox}>
            {STEP_SEARCH_2.map((item, i) => (
              <div key={i} className={s.sourceRow}>
                <TypeIcon type={item.type} size={20} />
                <span className={s.sourceRowTitle}>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 — Source selection */}
      <div className={s.stepRowCol}>
        <div className={s.stepRow}>
          <div className={s.stepDot} />
          <span className={s.stepLabel}>Selecting sources for answer generation</span>
        </div>
        <div className={s.stepIndent}>
          <div className={s.sourcesBox}>
            {STEP_SELECTED.map((item) => (
              <div key={item.badge} className={s.sourceRow}>
                <div className={s.sourceBadge}>{item.badge}</div>
                <TypeIcon type={item.type} size={20} />
                <span className={s.sourceRowTitle}>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5 — Calculation */}
      <div className={s.stepRowCol}>
        <div className={s.stepRow}>
          <div className={s.stepDot} />
          <span className={s.stepLabel}>Calculating CAGR</span>
        </div>
        <div className={s.stepIndent}>
          <div className={s.codeBlock}>
            <div className={s.codeLineNums}>
              {CODE_LINES.map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <div className={s.codeLines}>
              {CODE_LINES.map((line, i) => <div key={i}>{line || ' '}</div>)}
            </div>
          </div>
        </div>
      </div>

      {/* 6 — Finished */}
      <div className={s.stepRow}>
        <div className={s.stepDot} />
        <span className={s.stepLabel}>Finished</span>
      </div>
    </div>
  )
}

/* ── Chat Lane ── */
export default function ChatLane({ hoveredSource, onBadgeEnter, onBadgeLeave }) {
  const [showSteps, setShowSteps] = useState(false)

  const badge = (n) => (
    <InlineBadge n={n} onEnter={onBadgeEnter} onLeave={onBadgeLeave} />
  )

  return (
    <div className={s.lane}>
      {/* Title */}
      <div className={s.titleBar}>
        <div className={s.titleLeft}>
          <button className={s.titleText}>Gaming console market overview</button>
          <span className={s.titleTime}>Today, 3:42 PM</span>
        </div>
        <div className={s.titleActions}>
          {/* Download */}
          <button className={s.titleIconBtn} title="Download conversation">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v9M4.5 6.5L8 10l3.5-3.5M2 13.5h12" stroke="#455f7c" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {/* Copy for AI */}
          <button className={s.titleIconBtn} title="Copy for AI">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12.5 2.55H11.25a.75.75 0 000 1.5h1v8.5H3.75V9.05a.75.75 0 00-1.5 0v3.75c0 .69.56 1.25 1.25 1.25h9c.69 0 1.25-.56 1.25-1.25V3.8c0-.69-.56-1.25-1.25-1.25z" fill="#455f7c"/>
              <path d="M6.55 1.05c.243 0 .461.148.551.374l1.092 2.732 2.733 1.093c.225.09.373.308.373.551 0 .212-.112.406-.291.511l-.08.04-2.733 1.092-1.092 2.733c-.09.225-.308.373-.551.373-.212 0-.406-.112-.511-.291l-.04-.08-1.092-2.733L2.174 6.35C1.949 6.261 1.8 6.044 1.8 5.8c0-.243.148-.461.374-.551l2.733-1.092 1.092-2.733.04-.08c.105-.18.299-.291.511-.291z" fill="#455f7c"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Query bubble */}
      <div className={s.queryWrap}>
        <IconUserAvatar />
        <div className={s.queryBubbleWrap}>
          <div style={{ maxWidth: 560, width: '100%' }}>
            <div className={s.queryBubble}>
              Give me an overview of the gaming console market, including key players, revenue trends, and forecasted growth through 2029.
            </div>
          </div>
          <span className={s.queryTime}>Today, 3:42 PM</span>
        </div>
      </div>

      {/* Answer bubble */}
      <div className={s.answerBubble}>
        <div className={s.answerCard} />

        {/* Header */}
        <div className={s.answerHeader}>
          <IconAuthorIcon />
          <button className={s.stepsToggle} onClick={() => setShowSteps(v => !v)}>
            <span>{showSteps ? 'Hide' : 'Show'} answering steps</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 0.2s', transform: showSteps ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <path d="M3 4.5l3 3 3-3" stroke="#0666e5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Steps */}
        {showSteps && <AnsweringSteps />}

        {/* TL;DR + KeyFacts */}
        <div className={s.tldrWrap}>
          <div className={s.tldr}>
            <div className={s.tldrLabel}>TL;DR:</div>
            <p className={s.tldrText}>
              The global gaming console market is projected to reach $24.8 billion in 2025, with a CAGR of 1.86% through 2029. Sony and Microsoft lead on premium home hardware while subscription services now drive over 30% of total revenue.
            </p>
            <div className={s.keyFacts}>
              {ANSWER_KEYFACTS.map((kf, i) => (
                <div key={i} className={s.keyFact}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
                    <span className={s.keyFactLabel}>{kf.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {kf.pct != null && <ProgressRing pct={kf.pct} />}
                      <span className={s.keyFactValue}>{kf.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prose */}
        <div className={s.proseWrap}>
          <p className={s.prose}>
            The gaming console industry has undergone significant transformation over the past decade.{badge(7)}{' '}
            Cloud gaming, subscription models, and cross-platform play have reshaped consumer expectations{badge(8)}{' '}
            and revenue streams for major manufacturers.{badge(3)}
          </p>
          <p className={s.prose}>
            Hardware sales, while still important, are increasingly complemented by digital storefronts and game-as-a-service titles,{badge(2)}{' '}
            and streaming subscriptions that create recurring revenue{badge(5)}{' '}
            beyond the initial console purchase.{badge(6)}
          </p>
        </div>

        {/* DatawizWidget */}
        <div style={{ marginBottom: 48 }}>
          <DatawizWidget />
        </div>

        {/* Section heading: table */}
        <div className={s.sectionHeading}>
          <h2>Market leaders by revenue (2024)</h2>
        </div>

        {/* Table */}
        <div className={s.tableWrap}>
          <div className={s.tableInner}>
            <div className={s.tableScroll}>
              <div className={s.tableMinWidth}>
                <div className={s.tableBorder}>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th className={s.right}>Revenue (USD bn)</th>
                        <th className={s.right}>YoY Growth</th>
                        <th className={s.right}>Market Share</th>
                        <th>Primary Platform</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TABLE_ROWS.map((row, i) => (
                        <tr key={i}>
                          <td className={s.primary}>{row.co}</td>
                          <td className={s.right}>{row.rev}</td>
                          <td className={s.right}>
                            <span className={`${s.yoy} ${row.yoy.startsWith('+') ? s.yoyPos : s.yoyNeg}`}>
                              {row.yoy}
                            </span>
                          </td>
                          <td className={s.right}>{row.share}</td>
                          <td>{row.plat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className={s.tableFooter}>
              <div className={s.tableFooterSources}>
                <span className={s.tableFooterLabel}>Table sources:</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {[3, 4].map(n => (
                    <a key={n} href={buildDeepLink(SOURCES[n - 1])} className={s.tableSourceBadge}>{n}</a>
                  ))}
                </div>
              </div>
              <div className={s.tableIconBtns}>
                <button className={s.tableIconBtn} title="Download data">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1v9M4.5 6.5L8 10l3.5-3.5M2 13.5h12" stroke="#455f7c" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className={s.tableIconBtn} title="Copy data to clipboard">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.95 6.46H14.84V9.75H7.64v7.2h9.31V6.46z" fill="none"/>
                    <path d="M10.33 7.05V4.5c0-.28-.22-.5-.5-.5H4.5c-.28 0-.5.22-.5.5v6c0 .28.22.5.5.5h2.55V12a.5.5 0 00.5.5h6a.5.5 0 00.5-.5V7.55a.5.5 0 00-.5-.5h-2.72zm-5.83 0V5h4.5v1.05H4.5zm0 4V8h4.5v3.5H4.5zM8.05 12V8h4.5v4h-4.5z" fill="#455f7c"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section heading: bullets */}
        <div className={s.sectionHeading}>
          <h2>Key market trends</h2>
        </div>

        {/* Bullets */}
        <div className={s.bulletsWrap}>
          <ul className={s.bullets}>
            {[
              <span>Subscription services (PlayStation Plus, Xbox Game Pass) now account for over 30% of total revenue.{badge(1)}</span>,
              <span>Cloud gaming adoption grew 45% year-over-year{badge(4)}, reducing hardware dependency for casual players.{badge(6)}</span>,
              <span>Cross-generational game releases continue to bridge old and new console ecosystems.{badge(7)}</span>,
              <span>Mobile-console hybrid form factors gaining traction following Nintendo Switch success.{badge(8)}</span>,
            ].map((item, i) => (
              <li key={i} className={s.bullet}>
                <span className={s.bulletDot} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className={s.footerWrap}>
          <div className={s.footerRow}>
            <span className={s.footerTime}>Today, 3:43 PM</span>
            <div className={s.footerActions}>
              {/* Feedback */}
              <div className={s.footerGroup}>
                <button className={s.footerBtn} title="Like">
                  <svg width="16" height="16" viewBox="6 6 12 12" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 6.84863C13.1873 6.84863 14.1503 7.81172 14.1504 8.99902V9.84863H15.4805C16.5213 9.8488 17.3023 10.8016 17.0986 11.8223L16.2979 15.8223C16.1436 16.5934 15.467 17.1492 14.6807 17.1494H7.5C7.14101 17.1494 6.84961 16.858 6.84961 16.499V11.499C6.84974 11.1402 7.1411 10.8486 7.5 10.8486H9.09863L10.9189 7.20801L10.9648 7.12988C11.085 6.95567 11.2845 6.84863 11.5 6.84863H12Z" fill="#455f7c"/>
                  </svg>
                </button>
                <button className={s.footerBtn} title="Dislike">
                  <svg width="16" height="16" viewBox="6 6 12 12" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.6807 6.84961C15.467 6.84983 16.1436 7.40566 16.2979 8.17676L17.0986 12.1768C17.3023 13.1974 16.5213 14.1502 15.4805 14.1504H14.1504V15C14.1503 16.1873 13.1873 17.1504 12 17.1504H11.5C11.2845 17.1504 11.085 17.0434 10.9648 16.8691L10.9189 16.791L9.09863 13.1504H7.5C7.1411 13.1504 6.84974 12.8589 6.84961 12.5V7.5C6.84961 7.14101 7.14101 6.84961 7.5 6.84961H14.6807Z" fill="#455f7c"/>
                  </svg>
                </button>
              </div>
              {/* Actions */}
              <div className={s.footerGroup}>
                <button className={s.footerBtn} title="Download answer">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1v9M4.5 6.5L8 10l3.5-3.5M2 13.5h12" stroke="#455f7c" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className={s.footerBtn} title="Copy answer">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.95 2.46a.585.585 0 00-1.1 0L4.16 6.04.58 7.35a.585.585 0 000 1.1l3.58 1.31 1.69 3.58a.585.585 0 001.1 0l1.31-3.58 3.58-1.31a.585.585 0 000-1.1L8.26 6.04 6.95 2.46z" fill="#455f7c"/>
                  </svg>
                </button>
                <button className={s.footerBtn} title="Copy for AI">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12.5 2.55H11.25a.75.75 0 000 1.5h1v8.5H3.75V9.05a.75.75 0 00-1.5 0v3.75c0 .69.56 1.25 1.25 1.25h9c.69 0 1.25-.56 1.25-1.25V3.8c0-.69-.56-1.25-1.25-1.25z" fill="#455f7c"/>
                    <path d="M6.55 1.05c.243 0 .461.148.551.374l1.092 2.732 2.733 1.093c.225.09.373.308.373.551 0 .212-.112.406-.291.511l-.08.04-2.733 1.092-1.092 2.733c-.09.225-.308.373-.551.373-.212 0-.406-.112-.511-.291l-.04-.08-1.092-2.733L2.174 6.35C1.949 6.261 1.8 6.044 1.8 5.8c0-.243.148-.461.374-.551l2.733-1.092 1.092-2.733.04-.08c.105-.18.299-.291.511-.291z" fill="#455f7c"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
