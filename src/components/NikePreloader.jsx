import { useEffect, useMemo, useRef, useState } from "react"
import { animate, motion, useReducedMotion } from "framer-motion"

/**
 * NikePreloader
 * Full-page background images that hard-cut from one to the next, a big script
 * "Hello World" at the center that changes language, a 000 -> 100 counter, then
 * a circular mask opens from the center (small -> big) and the hero section
 * is revealed inside it, with a glowing ring on the edge of the circle.
 *
 * Inspired by the "Nike preloader" idea from Skiper UI (skiper7) /
 * afterdarktour.nike.com. Independent recreation, not Skiper's source code.
 *
 * Font: needs the "Awesome Script" @font-face (see App.css) and the font files in
 * /public/fonts/. Without them it falls back to a generic cursive font.
 *
 * Usage:
 *   <NikePreloader images={[img1, img2, img3, img4]} />
 */

const EASE_REVEAL = [0.76, 0, 0.24, 1] // circle reveal easing

// Latin-script greetings only, so the script font renders every glyph.
// The list ends on English so the last word you see is "Hello World".
const DEFAULT_WORDS = [
  "Kumusta Mundo",
  "Hola Mundo",
  "Bonjour Monde",
  "Ciao Mondo",
  "Hallo Welt",
  "Konnichiwa Sekai",
  "Hallo Wereld",
  "Hello World",
]

// Fallback full-screen frames so the swap is visible before you add your own images.
const frame = (from, to, label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${from}"/>
          <stop offset="1" stop-color="${to}"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#g)"/>
      <text x="50%" y="62%" text-anchor="middle" font-family="Arial Black, Arial, sans-serif"
            font-size="520" font-weight="900" fill="rgba(255,255,255,0.08)">${label}</text>
    </svg>`
  )}`

const PLACEHOLDER_FRAMES = [
  frame("#020a26", "#0a2a78", "01"),
  frame("#0b2a7a", "#60a5fa", "02"),
  frame("#1d4ed8", "#020617", "03"),
  frame("#0f172a", "#3b82f6", "04"),
]

const SCRIPT_FONT = '"Awesome Script", "Brush Script MT", "Segoe Script", cursive'

export default function NikePreloader({
  images = [],
  words = DEFAULT_WORDS,
  duration = 2600, // ms before the slide-up starts
  frameInterval = duration / 4, // ms between the four background images
  revealDuration = 1.6, // seconds for the circle to open
  onReveal, // fires when the circle starts opening (start the hero animation here)
  onComplete, // fires when the preloader is fully gone
}) {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState("loading") // loading -> revealing -> done
  const overlayRef = useRef(null)
  const ringRef = useRef(null)
  const onRevealRef = useRef(onReveal)
  const onCompleteRef = useRef(onComplete)
  onRevealRef.current = onReveal
  onCompleteRef.current = onComplete
  const active = phase !== "done"
  const [imageIndex, setImageIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  // Your images first; pad with placeholders so there are always several to swap.
  const frames = useMemo(
    () => (images.length >= 4 ? images : [...images, ...PLACEHOLDER_FRAMES].slice(0, Math.max(4, images.length))),
    [images]
  )

  // Hard-cut background swapping
  useEffect(() => {
    if (phase !== "loading") return undefined
    const id = setInterval(
      () => setImageIndex((i) => Math.min(i + 1, frames.length - 1)),
      frameInterval,
    )
    return () => clearInterval(id)
  }, [phase, frames.length, frameInterval])

  // Greeting changes language, spread evenly over `duration`, stops on the last word
  useEffect(() => {
    if (!active || words.length < 2) return undefined
    const id = setInterval(
      () => setWordIndex((i) => Math.min(i + 1, words.length - 1)),
      duration / words.length
    )
    return () => clearInterval(id)
  }, [active, words.length, duration])

  // Counter 0 -> 100 over `duration`
  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      setProgress(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration])

  // After the counter finishes, start the circle reveal
  useEffect(() => {
    if (phase !== "loading") return undefined
    const id = setTimeout(() => setPhase("revealing"), duration + 150)
    return () => clearTimeout(id)
  }, [phase, duration])

  // Circle mask: radius grows from 0 to beyond the screen corner
  useEffect(() => {
    if (phase !== "revealing") return undefined
    onRevealRef.current?.()
    const max = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 40
    const controls = animate(0, 1, {
      duration: reduceMotion ? 0.4 : revealDuration,
      ease: EASE_REVEAL,
      onUpdate: (v) => {
        const r = v * max
        overlayRef.current?.style.setProperty("--r", `${r}px`)
        const ring = ringRef.current
        if (ring) {
          ring.style.width = `${r * 2}px`
          ring.style.height = `${r * 2}px`
          ring.style.opacity = v < 0.015 ? "0" : String(1 - Math.max(0, (v - 0.8) / 0.2))
        }
      },
      onComplete: () => {
        setPhase("done")
        onCompleteRef.current?.()
      },
    })
    return () => controls.stop()
  }, [phase, reduceMotion, revealDuration])

  // Lock page scroll while the preloader is on screen
  useEffect(() => {
    if (!active) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [active])

  if (phase === "done") return null

  const maskImage =
    "radial-gradient(circle at 50% 50%, transparent var(--r), #000 calc(var(--r) + 1.5px))"

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[100] overflow-hidden bg-black text-white"
        style={{ "--r": "0px", maskImage, WebkitMaskImage: maskImage }}
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        {/* full-page images, instant swap */}
          {frames.map((src, i) => (
            <img
              key={`${i}-${typeof src === "string" ? src.slice(-24) : i}`}
              src={src}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: i === imageIndex ? 1 : 0 }}
            />
          ))}

        {/* readability overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(2,6,23,0.25),rgba(2,6,23,0.7))]"
          />

        {/* top meta */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 text-[10px] font-semibold uppercase tracking-[0.34em] text-white/70 sm:px-10">
            <span>Software Developer</span>
            <span>Portfolio</span>
          </div>

        {/* center script greeting */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <motion.h1
              key={wordIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="select-none whitespace-nowrap text-center text-[clamp(4.5rem,21vw,22rem)] font-black leading-none text-white"
              style={{
                fontFamily: SCRIPT_FONT,
                // faux-bold: thicken the strokes of the script letters
                WebkitTextStroke: "0.035em #ffffff",
                paintOrder: "stroke fill",
                textShadow: "0 0 30px rgba(96,165,250,0.55), 0 8px 40px rgba(0,0,0,0.6)",
              }}
            >
              {words[wordIndex]}
            </motion.h1>
          </div>

        {/* counter */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 py-5 sm:px-10">
            <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-white/70">
              Loading
            </span>
            <span className="text-5xl font-black leading-none tabular-nums tracking-tight sm:text-7xl">
              {String(progress).padStart(3, "0")}
            </span>
          </div>
      </div>

      {/* glowing ring that rides the edge of the opening circle */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-1/2 z-[101] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/80"
        style={{
          width: 0,
          height: 0,
          opacity: 0,
          boxShadow:
            "0 0 40px rgba(96,165,250,0.75), 0 0 120px rgba(59,130,246,0.45), inset 0 0 50px rgba(147,197,253,0.35)",
        }}
      />
    </>
  )
}