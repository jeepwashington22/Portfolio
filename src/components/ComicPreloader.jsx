import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import "./ComicPreloader.css"

/*
  ComicPreloader
  Full-bleed comic spreads fill the whole screen and FLIP like a flipbook: the
  bottom half of the page lifts, swings UP over the horizontal centre spine and
  lands on the top half showing its back (= the top half of the next page). The flips
  accelerate toward a cover slam with your name — then the camera dives in and the site is revealed. Every cut has a synthesized
  "page-turn" stinger (no audio files needed), with a bigger hit on the
  cover reveal, Marvel-logo style.

  Props (same as before):
    images    array of image URLs used as comic panels
    onReveal  called once, right when the exit begins (drive your hero intro)
    onDone    called once, after the preloader has unmounted
    title     cover title, e.g. "Jeffrey Bonina" (one line per word)
    subtitle  cover tagline
*/

// how long each full-screen page holds before punch-cutting to the next.
// these shrink fast, then the last one lingers a beat before the cover lands.
const PAGE_DURS = [0.62, 0.52, 0.44, 0.38, 0.33, 0.29, 0.26, 0.24, 0.22, 0.5]
const CONTENT_PAGES = PAGE_DURS.length // pages before the cover
const TOTAL_PAGES = CONTENT_PAGES + 1 // + cover
const TITLE_HOLD = 1.3 // seconds the cover stays up before the exit

const LAYOUTS = ["trio", "quad", "inset", "strip"]
const TINTS = [
  "rgba(224, 33, 63, 0.32)",
  "rgba(29, 111, 232, 0.28)",
  "rgba(255, 196, 0, 0.3)",
  "rgba(130, 50, 210, 0.26)",
]
const FOCUS = ["50% 20%", "30% 50%", "70% 40%", "50% 80%"]
const CAPTIONS = [
  "Meanwhile, in the repo...",
  "Three commits later...",
  "Somewhere past midnight...",
  "Deploy day.",
  "No bugs were harmed.",
  "One more feature...",
]
const BUBBLES = ["It compiles!", "Ship it.", "One more tweak...", "Hello, World!", "Tests: green.", "Looks good!"]
const SFX = ["ZAP!", "BUILD!", "PUSH!", "BOOM!", "CLICK!", "WHAM!", "SHIP!"]
const SFX_COLORS = ["yellow", "red", "blue"]

/* ---------------- synthesized "page turn" sound, no audio files ---------------- */
function usePageSound() {
  const ctxRef = useRef(null)
  const noiseRef = useRef(null)
  const soundEnabledRef = useRef(false)
  const [soundEnabled, setSoundEnabled] = useState(false)

  const getCtx = useCallback(() => {
    if (typeof window === "undefined") return null
    const Ctor = window.AudioContext || window.webkitAudioContext
    if (!Ctor) return null
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new Ctor()
      const buf = ctxRef.current.createBuffer(1, ctxRef.current.sampleRate * 0.3, ctxRef.current.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
      noiseRef.current = buf
    }
    return ctxRef.current
  }, [])

  const enableSound = useCallback(async () => {
    let ctx
    try {
      ctx = getCtx()
      if (!ctx) return false
      if (ctx.state !== "running") await ctx.resume()
    } catch {
      return false
    }
    const enabled = ctx.state === "running"
    soundEnabledRef.current = enabled
    setSoundEnabled(enabled)
    return enabled
  }, [getCtx])

  const muteSound = () => {
    soundEnabledRef.current = false
    setSoundEnabled(false)
  }

  useEffect(() => {
    void enableSound()
  }, [enableSound])

  useEffect(() => () => ctxRef.current?.close?.(), [])

  const playSound = useCallback((big = false) => {
    const ctx = ctxRef.current
    if (!soundEnabledRef.current || !ctx || ctx.state !== "running" || !noiseRef.current) return
    const now = ctx.currentTime

    // quick filtered noise burst = the "page snap"
    const src = ctx.createBufferSource()
    src.buffer = noiseRef.current
    const bp = ctx.createBiquadFilter()
    bp.type = "bandpass"
    bp.Q.value = 0.7
    bp.frequency.setValueAtTime(big ? 2200 : 2600, now)
    bp.frequency.exponentialRampToValueAtTime(big ? 250 : 650, now + (big ? 0.26 : 0.1))
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(big ? 0.85 : 0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + (big ? 0.32 : 0.13))
    src.connect(bp).connect(gain).connect(ctx.destination)
    src.start(now)
    src.stop(now + (big ? 0.34 : 0.15))

    if (big) {
      // low punchy hit under the cover slam, Marvel-stinger style
      const osc = ctx.createOscillator()
      osc.type = "sine"
      osc.frequency.setValueAtTime(150, now)
      osc.frequency.exponentialRampToValueAtTime(48, now + 0.32)
      const og = ctx.createGain()
      og.gain.setValueAtTime(0.65, now)
      og.gain.exponentialRampToValueAtTime(0.001, now + 0.38)
      osc.connect(og).connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.4)
    }
  }, [])

  return { playSound, soundEnabled, enableSound, muteSound }
}

const Cap = ({ pos, children }) => <span className={`cb-cap cb-pos--${pos}`}>{children}</span>
const Bubble = ({ pos, children }) => <span className={`cb-bubble cb-pos--${pos}`}>{children}</span>
const Sfx = ({ pos, color, children }) => (
  <span className={`cb-sfx cb-sfx--${color} cb-pos--${pos}`}>{children}</span>
)

function Panel({ area, src, tint, focus, className = "", children }) {
  return (
    <div className={`cb-panel ${className}`} style={{ gridArea: area }}>
      <div className="cb-panel__art">
        {src ? (
          <img src={src} alt="" draggable="false" decoding="async" style={{ objectPosition: focus }} />
        ) : null}
        <span className="cb-panel__tint" style={{ background: tint }} />
        <span className="cb-panel__dots" />
      </div>
      {children}
    </div>
  )
}

function Face({ n, pics, splash = false }) {
  const pick = (list, k = 0) => list[(n + k) % list.length]
  const img = (k = 0) => (pics.length ? pics[(n + k) % pics.length] : null)
  const tint = (k = 0) => TINTS[(n + k) % TINTS.length]
  const focus = (k = 0) => FOCUS[(n + k) % FOCUS.length]
  const color = (k = 0) => pick(SFX_COLORS, k)

  if (splash) {
    return (
      <div className="cb-page cb-page--splash">
        <Panel area="a" src={img(1)} tint={TINTS[0]} focus="50% 30%" className="cb-panel--splash">
          <span className="cb-burst" />
          <Bubble pos="tl">Welcome to my world.</Bubble>
          <Sfx pos="br" color="red">
            HELLO!
          </Sfx>
        </Panel>
      </div>
    )
  }

  const kind = LAYOUTS[(n + (n >> 2)) % LAYOUTS.length]

  if (kind === "trio") {
    return (
      <div className="cb-page cb-page--trio">
        <Panel area="a" src={img(0)} tint={tint(0)} focus={focus(0)}>
          <Cap pos="tl">{pick(CAPTIONS)}</Cap>
        </Panel>
        <Panel area="b" src={img(1)} tint={tint(1)} focus={focus(1)}>
          <Bubble pos="tr">{pick(BUBBLES)}</Bubble>
        </Panel>
        <Panel area="c" src={img(2)} tint={tint(2)} focus={focus(2)}>
          <Sfx pos="bl" color={color()}>
            {pick(SFX)}
          </Sfx>
        </Panel>
      </div>
    )
  }

  if (kind === "quad") {
    return (
      <div className="cb-page cb-page--quad">
        <Panel area="a" src={img(0)} tint={tint(0)} focus={focus(0)}>
          <Sfx pos="br" color={color(1)}>
            {pick(SFX, 1)}
          </Sfx>
        </Panel>
        <Panel area="b" src={img(1)} tint={tint(1)} focus={focus(1)}>
          <Cap pos="tl">{pick(CAPTIONS, 1)}</Cap>
        </Panel>
        <Panel area="c" src={img(2)} tint={tint(2)} focus={focus(2)}>
          <Bubble pos="tr">{pick(BUBBLES, 1)}</Bubble>
        </Panel>
        <Panel area="d" src={img(3)} tint={tint(3)} focus={focus(3)}>
          <Cap pos="bl">{pick(CAPTIONS, 2)}</Cap>
        </Panel>
      </div>
    )
  }

  if (kind === "inset") {
    return (
      <div className="cb-page cb-page--inset">
        <Panel area="a" src={img(0)} tint={tint(0)} focus={focus(0)}>
          <Cap pos="tl">{pick(CAPTIONS, 3)}</Cap>
          <Sfx pos="bl" color={color(2)}>
            {pick(SFX, 2)}
          </Sfx>
        </Panel>
        <Panel src={img(1)} tint={tint(2)} focus={focus(1)} className="cb-inset">
          <Bubble pos="tl">{pick(BUBBLES, 2)}</Bubble>
        </Panel>
      </div>
    )
  }

  return (
    <div className="cb-page cb-page--strip">
      <Panel area="a" src={img(0)} tint={tint(0)} focus={focus(0)}>
        <Bubble pos="tl">{pick(BUBBLES, 3)}</Bubble>
      </Panel>
      <Panel area="b" src={img(1)} tint={tint(1)} focus={focus(1)}>
        <Sfx pos="bc" color={color(3)}>
          {pick(SFX, 3)}
        </Sfx>
      </Panel>
      <Panel area="c" src={img(2)} tint={tint(2)} focus={focus(2)}>
        <Cap pos="tl">{pick(CAPTIONS, 4)}</Cap>
      </Panel>
      <Panel area="d" src={img(3)} tint={tint(3)} focus={focus(3)}>
        <Bubble pos="tr">{pick(BUBBLES, 4)}</Bubble>
      </Panel>
    </div>
  )
}

function Cover({ pics, title, subtitle }) {
  const lines = title.split(/\s+/).filter(Boolean)
  const longest = Math.max(4, ...lines.map((l) => l.length))
  return (
    <div className="cb-page cb-page--cover">
      <Panel
        area="a"
        src={pics.length ? pics[pics.length - 1] : null}
        tint={TINTS[1]}
        focus="50% 25%"
        className="cb-panel--splash"
      >
        <span className="cb-burst cb-burst--cover" />
        <span className="cb-cover__issue cb-title" style={{ "--i": 0 }}>
          Issue No. 1
        </span>
        <h2 className="cb-cover__name" style={{ "--w": longest }}>
          {lines.map((line, i) => (
            <span key={i} className="cb-title" style={{ "--i": i + 1 }}>
              {line}
            </span>
          ))}
        </h2>
        <span className="cb-cover__role cb-title" style={{ "--i": lines.length + 1 }}>
          {subtitle}
        </span>
      </Panel>
    </div>
  )
}

export default function ComicPreloader({
  images = [],
  onReveal,
  onDone,
  title = "Jeffrey Bonina",
  subtitle = "Fullstack Developer",
}) {
  const [phase, setPhase] = useState("loading") // loading | flip | title | exit
  const [pageIndex, setPageIndex] = useState(0)
  const [flash, setFlash] = useState(0)
  const [leaving, setLeaving] = useState(null) // index of the page currently being turned away
  const [gone, setGone] = useState(false)
  const [soundError, setSoundError] = useState("")
  const { playSound, soundEnabled, enableSound, muteSound } = usePageSound()

  // App passes a fresh array every render, so key everything off the URLs
  const key = images.filter(Boolean).join("|")
  const pics = useMemo(() => (key ? key.split("|") : []), [key])

  const revealed = useRef(false)
  const onRevealRef = useRef(onReveal)
  const onDoneRef = useRef(onDone)
  onRevealRef.current = onReveal
  onDoneRef.current = onDone

  // keep the page still while the intro plays.
  // IMPORTANT: App keeps this component mounted (it just renders null once `gone`),
  // so the lock must be released when `gone` flips, not only on unmount. Otherwise
  // html/body stay overflow:hidden forever and the scroll-driven home transition
  // can never run.
  useEffect(() => {
    if (gone) return undefined
    const html = document.documentElement
    const body = document.body
    const prev = [html.style.overflow, body.style.overflow]
    html.style.overflow = "hidden"
    body.style.overflow = "hidden"
    return () => {
      html.style.overflow = prev[0]
      body.style.overflow = prev[1]
    }
  }, [gone])

  // 1. wait for the panel images (max 3s), then start the page-turns
  useEffect(() => {
    let alive = true
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const decode = (src) =>
      new Promise((resolve) => {
        const im = new Image()
        im.src = src
        if (im.decode) im.decode().then(resolve, resolve)
        else im.onload = im.onerror = resolve
      })
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))

    Promise.all([Promise.race([Promise.all(pics.map(decode)), wait(3000)]), wait(400)]).then(() => {
      if (!alive) return
      if (reduce) {
        setPageIndex(CONTENT_PAGES)
        setPhase("title")
      } else {
        setPhase("flip")
      }
    })
    return () => {
      alive = false
    }
  }, [pics])

  // 2. punch-cut through the pages, faster each time, then slam the cover
  useEffect(() => {
    if (phase !== "flip") return
    let cumulative = 0
    const timers = PAGE_DURS.map((d, i) => {
      cumulative += d
      const isCover = i === PAGE_DURS.length - 1
      return setTimeout(() => {
        setLeaving(i) // page i turns away, page i + 1 is revealed underneath
        setPageIndex(i + 1)
        if (isCover) setFlash((f) => f + 1) // white snap only for the big cover hit
        playSound(isCover)
        if (isCover) setPhase("title")
      }, cumulative * 1000)
    })
    return () => timers.forEach(clearTimeout)
  }, [phase, playSound])

  // 3. hold the cover, then exit
  useEffect(() => {
    if (phase !== "title") return
    const t = setTimeout(() => setPhase("exit"), TITLE_HOLD * 1000)
    return () => clearTimeout(t)
  }, [phase])

  // 4. reveal the site as the camera dives in
  useEffect(() => {
    if (phase !== "exit") return
    if (!revealed.current) {
      revealed.current = true
      onRevealRef.current?.()
    }
    const t = setTimeout(() => setGone(true), 1000) // fallback if animationend never fires
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (gone) onDoneRef.current?.()
  }, [gone])

  if (gone) return null

  const cls = [
    "cb-root",
    phase !== "loading" && "is-flip",
    (phase === "title" || phase === "exit") && "is-title",
    phase === "exit" && "is-exit",
  ]
    .filter(Boolean)
    .join(" ")

  const currentPage = Math.min(TOTAL_PAGES, pageIndex + 1)

  // the flip speeds up with the cuts: it can never outlast the page it reveals
  const turnDur = Math.max(0.18, Math.min(0.6, (PAGE_DURS[pageIndex] ?? 0.5) * 0.95))

  const toggleSound = async () => {
    setSoundError("")
    if (soundEnabled) {
      muteSound()
      return
    }
    if (!(await enableSound())) {
      setSoundError("Audio could not be enabled. Check your browser audio settings.")
    }
  }

  const renderPage = (idx) =>
    idx >= CONTENT_PAGES ? (
      <Cover pics={pics} title={title} subtitle={subtitle} />
    ) : (
      <Face n={idx} pics={pics} splash={idx === CONTENT_PAGES - 1} />
    )

  return (
    <div
      className={cls}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && e.animationName === "cbOut") setGone(true)
      }}
    >
      <span className="cb-sr" role="status">
        Loading portfolio
      </span>
      <div className="cb-bg" aria-hidden="true" />

	      <div
	        className="cb-viewport"
	        aria-hidden="true"
	        style={{
	          "--turn": `${turnDur}s`,
	          // Scale the camera-facing bow with the viewport, without changing timing.
	          "--leaf-depth": "clamp(28px, 5vw, 96px)",
	        }}
	      >
	        {/* The next page is already underneath; the lower leaf uncovers it from bottom to top. */}
        <div key={pageIndex} className="cb-slide">
          {renderPage(pageIndex)}
        </div>

        {leaving !== null && (
	          <div key={`flip-${pageIndex}`} className="cb-fu cb-fu--diagonal">
	            {/* The next page remains underneath the full diagonal turning sheet. */}
	            <div className="cb-fu__half cb-fu__half--top">
	              <div className="cb-fu__page cb-fu__page--top">{renderPage(pageIndex)}</div>
            </div>

            {/* shadow cast on the page underneath + spine crease */}
            <span className="cb-fu__cast" />
            <span className="cb-fu__spine" />

	            {/* The full old page turns around a diagonal axis.
	                The bottom-right corner leads toward the top-left. */}
	            <div
	              className="cb-fu__leaf cb-fu__leaf--physical"
	              aria-hidden="true"
	              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget) setLeaving(null)
              }}
            >
              <div className="cb-fu__face cb-fu__face--front">
	                <div className="cb-fu__page">{renderPage(leaving)}</div>
              </div>
              <div className="cb-fu__face cb-fu__face--back">
	                <div className="cb-fu__page">{renderPage(pageIndex)}</div>
              </div>
            </div>
          </div>
        )}

        <div key={`flash-${flash}`} className={flash ? "cb-flash is-active" : "cb-flash"} />
      </div>

      <div className="cb-hud">
        <span className="cb-hud__page" aria-hidden="true">
          Page {currentPage} of {TOTAL_PAGES}
        </span>
        <button
          type="button"
          className="cb-audio"
          aria-pressed={soundEnabled}
          onClick={toggleSound}
        >
          {soundEnabled ? "Mute sound" : "Enable sound"}
        </button>
        {soundError && (
          <span className="cb-audio__status" role="status">
            {soundError}
          </span>
        )}
        <button type="button" className="cb-skip" onClick={() => setPhase("exit")}>
          Skip intro
        </button>
      </div>
    </div>
  )
}
