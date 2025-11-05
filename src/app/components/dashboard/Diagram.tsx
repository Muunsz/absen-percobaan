"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

type DataPoint = {
  name: string
  hadir: number // dalam persen (0–100)
  total: number
}

type Props = {
  data: {
    kehadiranMingguan: DataPoint[]
  }
}

// Icons
const ExpandIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 9a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 110 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
)

const MinimizeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-7-9a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm14 0a1 1 0 100 2h-6a1 1 0 100-2h6z" clipRule="evenodd" />
  </svg>
)

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
)

export default function Diagram({ data }: Props) {
  const { kehadiranMingguan } = data

  const [mounted, setMounted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    x: number // absolute x in pixels (for tooltip positioning)
    y: number
    hadir: number
    total: number
    day: string
    percent: number
  }>({
    visible: false,
    x: 0,
    y: 0,
    hadir: 0,
    total: 0,
    day: "",
    percent: 0,
  })

  // Handle resize for both normal and fullscreen
  useEffect(() => {
    setMounted(true)

    const updateSize = () => {
      if (isFullscreen) {
        setContainerSize({
          width: Math.min(window.innerWidth * 0.95, 1400),
          height: Math.min(window.innerHeight * 0.85, 800),
        })
      }
    }

    updateSize()
    if (isFullscreen) {
      window.addEventListener('resize', updateSize)
      return () => window.removeEventListener('resize', updateSize)
    }
  }, [isFullscreen])

  // Get container ref for responsive width in normal mode
  const containerRef = useCallback((node: HTMLDivElement) => {
    if (node && !isFullscreen) {
      const resizeObserver = new ResizeObserver(() => {
        setContainerSize({
          width: node.clientWidth,
          height: Math.max(200, node.clientHeight),
        })
      })
      resizeObserver.observe(node)
      return () => resizeObserver.disconnect()
    }
  }, [isFullscreen])

  // Memoized chart data
  const chartData = useMemo(() => {
    if (kehadiranMingguan.length === 0) {
      return {
        w: isFullscreen ? containerSize.width : 600,
        h: isFullscreen ? containerSize.height : 200,
        pad: isFullscreen ? 50 : 30,
        points: [],
        areaPath: '',
        gridYs: [],
        innerH: 0,
      }
    }

    const width = isFullscreen ? containerSize.width : containerSize.width || 600
    const height = isFullscreen ? containerSize.height : Math.max(200, containerSize.height || 200)

    const pad = isFullscreen ? 50 : 30
    const innerW = width - pad * 2
    const innerH = height - pad * 2

    // Scale Y: 0% → bottom, 100% → top
    const scaleY = (pct: number) => pad + innerH - (pct / 100) * innerH

    const stepX = kehadiranMingguan.length > 1 ? innerW / (kehadiranMingguan.length - 1) : 0
    const points = kehadiranMingguan.map((_, i) => [
      pad + (i * stepX),
      scaleY(kehadiranMingguan[i].hadir),
    ] as const)

    // Area path
    let areaPath = ''
    if (points.length > 0) {
      const topPath = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ')
      areaPath =
        topPath +
        ` L ${points[points.length - 1][0]} ${pad + innerH}` +
        ` L ${pad} ${pad + innerH}` +
        ' Z'
    }

    const gridYs = [0, 20, 40, 60, 80, 100].map((pct) => ({
      y: scaleY(pct),
      label: `${pct}%`,
      value: pct,
    }))

    return { w: width, h: height, pad, points, areaPath, gridYs, innerH }
  }, [kehadiranMingguan, isFullscreen, containerSize])

  const { w, h, pad, points, areaPath, gridYs, innerH } = chartData

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (points.length === 0) return

      const svg = e.currentTarget
      const rect = svg.getBoundingClientRect()
      const clientX = e.clientX - rect.left

      let closestIndex = -1
      let minDist = Infinity

      points.forEach((p, i) => {
        const dist = Math.abs(p[0] - clientX)
        if (dist < minDist) {
          minDist = dist
          closestIndex = i
        }
      })

      const threshold = isFullscreen ? 60 : 40

      if (closestIndex !== -1 && minDist < threshold) {
        const dp = kehadiranMingguan[closestIndex]
        const hadirCount = Math.round((dp.hadir / 100) * dp.total)

        setTooltip({
          visible: true,
          x: points[closestIndex][0], // absolute SVG x
          y: points[closestIndex][1],
          hadir: hadirCount,
          total: dp.total,
          day: dp.name,
          percent: dp.hadir,
        })
      } else {
        setTooltip((prev) => ({ ...prev, visible: false }))
      }
    },
    [points, kehadiranMingguan, isFullscreen]
  )

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }, [])

  if (!mounted) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md w-full border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-gray-700 dark:text-gray-300 text-sm">Diagram Kehadiran Mingguan</h2>
        </div>
        <div className="mt-4 h-48 rounded-md bg-gray-100 dark:bg-gray-700 w-full animate-pulse" />
      </section>
    )
  }

  return (
    <section
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md ${
        isFullscreen ? 'fixed inset-0 z-50 flex flex-col m-auto w-full h-full p-4' : 'w-full'
      } border border-gray-200 dark:border-gray-700 transition-all duration-300`}
      style={isFullscreen ? { backgroundColor: 'rgba(0,0,0,0.85)' } : {}}
    >
      <div
        className={`flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-2xl ${
          isFullscreen ? 'w-full h-full p-4' : 'h-full'
        }`}
        style={
          isFullscreen
            ? {
                maxWidth: containerSize.width,
                maxHeight: containerSize.height,
                margin: 'auto',
              }
            : {}
        }
      >
        <div className="flex justify-between items-center pb-3 border-b dark:border-gray-700">
          <h2 className="text-gray-700 dark:text-gray-300 text-lg font-semibold">
            {isFullscreen
              ? 'Grafik Kehadiran Mingguan (Mode Layar Penuh)'
              : 'Diagram Kehadiran Mingguan'}
          </h2>
          <div className="flex gap-2">
            <button
              className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsFullscreen(!isFullscreen)}
              aria-label={isFullscreen ? 'Kecilkan grafik' : 'Perbesar grafik'}
            >
              {isFullscreen ? <MinimizeIcon /> : <ExpandIcon />}
            </button>
            {isFullscreen && (
              <button
                className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setIsFullscreen(false)}
                aria-label="Tutup mode layar penuh"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        </div>

        <div
          ref={containerRef}
          className={`mt-4 w-full relative ${isFullscreen ? 'flex-grow min-h-0' : 'min-h-[200px]'}`}
        >
          {kehadiranMingguan.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              Tidak ada data kehadiran mingguan.
            </div>
          ) : (
            <svg
              viewBox={`0 0 ${w} ${h}`}
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Diagram Kehadiran Mingguan"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity="0.5" />
                  <stop offset="95%" stopColor="#10b981" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              <rect
                x="0.5"
                y="0.5"
                width={w - 1}
                height={h - 1}
                rx="8"
                fill="none"
                stroke="#e5e7eb"
                className="dark:stroke-gray-600"
              />

              {/* Horizontal grid lines */}
              {gridYs.map((g, i) => (
                <g key={i}>
                  <line
                    x1={pad}
                    x2={w - pad / 2}
                    y1={g.y}
                    y2={g.y}
                    stroke="#e5e7eb"
                    className="dark:stroke-gray-600"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={pad - 10}
                    y={g.y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize={isFullscreen ? '12' : '10'}
                    fill="#9ca3af"
                    className="dark:fill-gray-400"
                  >
                    {g.label}
                  </text>
                </g>
              ))}

              {/* X-axis labels */}
              {points.map((p, i) => (
                <text
                  key={`x-${i}`}
                  x={p[0]}
                  y={h - pad + 16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={isFullscreen ? '12' : '10'}
                  fill="#9ca3af"
                  className="dark:fill-gray-400"
                >
                  {kehadiranMingguan[i].name}
                </text>
              ))}

              {/* Area under the line */}
              <path d={areaPath} fill="url(#c1)" />

              {/* Line */}
              <path
                d={points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((p, i) => (
                <g key={`pt-${i}`}>
                  <circle
                    cx={p[0]}
                    cy={p[1]}
                    r={isFullscreen ? '5' : '3'}
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="dark:stroke-gray-800"
                  />
                  <title>
                    {kehadiranMingguan[i].name}: {kehadiranMingguan[i].hadir}%
                  </title>
                </g>
              ))}

              {/* Tooltip guide line & highlight */}
              {tooltip.visible && (
                <g>
                  <line
                    x1={tooltip.x}
                    y1={pad}
                    x2={tooltip.x}
                    y2={pad + innerH}
                    stroke="#9ca3af"
                    strokeDasharray="4 4"
                    className="dark:stroke-gray-400"
                  />
                  <circle
                    cx={tooltip.x}
                    cy={tooltip.y}
                    r={isFullscreen ? '6' : '4'}
                    fill="#ffffff"
                    stroke="#10b981"
                    strokeWidth="2"
                    className="dark:fill-gray-900"
                  />
                </g>
              )}
            </svg>
          )}

          {/* Tooltip overlay */}
          {tooltip.visible && (
            <div
              className="absolute bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-xl pointer-events-none z-10 transition-opacity duration-150 whitespace-nowrap"
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y - (isFullscreen ? 20 : 15)}px`,
                transform: 'translateX(-50%) translateY(-100%)',
              }}
            >
              <div className="font-bold mb-1 text-center">{tooltip.day}</div>
              <div className="flex items-center gap-2 text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                <span>Hadir: {tooltip.hadir}/{tooltip.total}</span>
              </div>
              <div className="flex items-center gap-2 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span>Tidak Hadir: {tooltip.total - tooltip.hadir}</span>
              </div>
              <div className="mt-1 text-center font-semibold text-white">
                ({tooltip.percent}% Kehadiran)
              </div>
              <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900 transform -translate-x-1/2"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}