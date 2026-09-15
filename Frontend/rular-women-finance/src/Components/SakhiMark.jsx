import { colors } from "../data";

function WarliFigure({ angle, radius }) {
  const rad = (angle * Math.PI) / 180;

  const cx =
    150 + radius * Math.cos(rad);

  const cy =
    150 + radius * Math.sin(rad);

  const rot = angle + 90;

  return (
    <g
      transform={`translate(${cx} ${cy}) rotate(${rot})`}
    >
      <circle
        cx="0"
        cy="-21"
        r="4.5"
        fill={colors.paper}
      />

      <path
        d="M -6 -14 L 6 -14 L 3 4 L -3 4 Z"
        fill="none"
        stroke={colors.paper}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <line
        x1="-6"
        y1="-11"
        x2="-13"
        y2="-2"
        stroke={colors.paper}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <line
        x1="6"
        y1="-11"
        x2="13"
        y2="-2"
        stroke={colors.paper}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <line
        x1="-3"
        y1="4"
        x2="-8"
        y2="16"
        stroke={colors.paper}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <line
        x1="3"
        y1="4"
        x2="8"
        y2="16"
        stroke={colors.paper}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </g>
  );
}

export default function SakhiMark({ size = 300 }) {
  const angles = Array.from(
    { length: 9 },
    (_, i) => (360 / 9) * i - 90
  );

  return (
    <svg
      viewBox="0 0 300 300"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <circle
        cx="150"
        cy="150"
        r="112"
        fill="none"
        stroke={colors.paper}
        strokeOpacity="0.18"
        strokeWidth="1"
      />

      {angles.map((angle) => (
        <WarliFigure
          key={angle}
          angle={angle}
          radius={78}
        />
      ))}

      <circle
        cx="150"
        cy="150"
        r="26"
        fill="none"
        stroke={colors.marigold}
        strokeWidth="2.5"
      />

      <circle
        cx="150"
        cy="150"
        r="19"
        fill="none"
        stroke={colors.marigold}
        strokeWidth="1"
        strokeDasharray="2 3"
      />

      <path
        d="
          M150 150
          C 150 138, 144 132, 138 126
          M150 150
          C150 136, 157 129, 165 124
        "
        stroke={colors.marigold}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      <circle
        cx="137"
        cy="124"
        r="3"
        fill={colors.marigold}
      />

      <circle
        cx="166"
        cy="122"
        r="3"
        fill={colors.marigold}
      />
    </svg>
  );
}