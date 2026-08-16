// Subtle topographic contour texture used behind sections and hero art.
// Thin technical linework per the brand's graphic language.

export default function TopoPattern({
  className,
  opacity = 0.5,
  stroke = '#A7A29A',
}: {
  className?: string
  opacity?: number
  stroke?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g fill="none" stroke={stroke} strokeWidth="1" opacity={opacity}>
        <path d="M-50 120 C 200 60, 420 180, 640 120 S 1050 40, 1250 140" />
        <path d="M-50 190 C 220 130, 430 250, 660 190 S 1060 110, 1250 210" />
        <path d="M-50 270 C 240 210, 450 330, 680 270 S 1080 190, 1250 290" />
        <path d="M-50 360 C 260 300, 470 420, 700 360 S 1100 280, 1250 380" />
        <path d="M-50 450 C 260 400, 480 510, 700 450 S 1110 380, 1250 470" />
        <path d="M-50 540 C 250 500, 470 600, 690 540 S 1110 470, 1250 560" />
        <path d="M-50 630 C 250 600, 470 690, 690 630 S 1110 560, 1250 650" />
      </g>
      <g fill="none" stroke={stroke} strokeWidth="1" opacity={opacity * 0.5}>
        <path d="M-50 155 C 210 95, 425 215, 650 155 S 1055 75, 1250 175" />
        <path d="M-50 315 C 250 255, 460 375, 690 315 S 1090 235, 1250 335" />
        <path d="M-50 495 C 255 450, 475 555, 695 495 S 1110 425, 1250 515" />
      </g>
    </svg>
  )
}
