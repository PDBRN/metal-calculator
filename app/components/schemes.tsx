import React from "react";

// Общие настройки стилей схемы
const size = 260;
const center = size / 2;
const strokeColor = "#18181b"; // черный
const dimColor = "#2563EB"; // синий

const Defs = () => (
  <defs>
    <pattern
      id="hatch"
      patternUnits="userSpaceOnUse"
      width="6"
      height="6"
      patternTransform="rotate(45)"
    >
      <line x1="0" y1="0" x2="0" y2="6" stroke="#d4d4d8" strokeWidth="1" />
    </pattern>

    <marker id="arrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill={dimColor} />
    </marker>

    <marker id="arrow-rev" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
      <path d="M6,0 L0,3 L6,6 Z" fill={dimColor} />
    </marker>

    <style>{`.dash { stroke-dasharray: 4, 2; stroke: #a1a1aa; }`}</style>
  </defs>
);

type DimProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  offset?: number;
  vertical?: boolean;
};

const Dim = ({ x1, y1, x2, y2, label, offset = 25, vertical = false }: DimProps) => {
  const offX = vertical ? offset : 0;
  const offY = vertical ? 0 : offset;

  return (
    <g>
      {/* выносные линии */}
      <line
        x1={x1}
        y1={y1}
        x2={x1 + offX}
        y2={y1 + offY}
        stroke={dimColor}
        strokeWidth="0.5"
        opacity="0.5"
      />
      <line
        x1={x2}
        y1={y2}
        x2={x2 + offX}
        y2={y2 + offY}
        stroke={dimColor}
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* размерная линия */}
      <line
        x1={x1 + (vertical ? offset - 5 : 0)}
        y1={y1 + (vertical ? 0 : offset - 5)}
        x2={x2 + (vertical ? offset - 5 : 0)}
        y2={y2 + (vertical ? 0 : offset - 5)}
        stroke={dimColor}
        strokeWidth="1.5"
        markerStart="url(#arrow-rev)"
        markerEnd="url(#arrow)"
      />

      {/* белая подложка под текст */}
      <rect
        x={(x1 + x2) / 2 + (vertical ? offset - 20 : -15)}
        y={(y1 + y2) / 2 + (vertical ? -10 : offset - 15)}
        width="30"
        height="16"
        fill="white"
        fillOpacity="0.8"
        rx="2"
      />

      {/* текст */}
      <text
        x={(x1 + x2) / 2 + (vertical ? offset - 5 : 0)}
        y={(y1 + y2) / 2 + (vertical ? 4 : offset - 4)}
        textAnchor="middle"
        fill={dimColor}
        fontSize="11"
        fontWeight="700"
      >
        {label}
      </text>
    </g>
  );
};

type DimDiameterProps = {
  x1: number; // левая точка касания тела
  x2: number; // правая точка касания тела
  yTouch: number; // y касания тела (обычно center)
  yDim: number; // y размерной линии
  label: string; // например "D 10"
};

const DimDiameter = ({ x1, x2, yTouch, yDim, label }: DimDiameterProps) => {
  if (![x1, x2, yTouch, yDim].every(Number.isFinite)) return null;

  return (
    <g>
      {/* выносные линии */}
      <line x1={x1} y1={yTouch} x2={x1} y2={yDim} stroke={dimColor} strokeWidth="1.5" />
      <line x1={x2} y1={yTouch} x2={x2} y2={yDim} stroke={dimColor} strokeWidth="1.5" />

      {/* размерная линия */}
      <line
        x1={x1}
        y1={yDim}
        x2={x2}
        y2={yDim}
        stroke={dimColor}
        strokeWidth="2"
        markerStart="url(#arrow-rev)"
        markerEnd="url(#arrow)"
      />

      {/* подпись */}
      <text
        x={(x1 + x2) / 2}
        y={yDim + 16}
        textAnchor="middle"
        fill={dimColor}
        fontSize="14"
        fontWeight="800"
      >
        {label}
      </text>
    </g>
  );
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center">
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
      <Defs />
      {children}
    </svg>
  </div>
);

type SchemeProps = {
  assortment: string;
  d: string;
  a: string;
  b: string; // для "Ленты" используем как L (если надо — прокинь len сюда из Calculator.tsx)
  t: string;
};

export default function AssortmentScheme({ assortment, d, a, b, t }: SchemeProps) {
  if (!assortment) return <span className="text-4xl text-zinc-200">?</span>;

  // ---- АРМАТУРА ----
  if (assortment === "Арматура") {
    const rBody = 58;
    const ribHeight = 10;

    const earW = 8;
    const earH = 12;

    const xL = center - rBody;
    const xR = center + rBody;

    const yTouch = center;
    const yDim = center + rBody + ribHeight + 25;

    const rOuterY = rBody + ribHeight;

    const arcTop = `M ${xL},${center} A ${rBody},${rOuterY} 0 0 1 ${xR},${center}`;
    const arcBot = `M ${xL},${center} A ${rBody},${rOuterY} 0 0 0 ${xR},${center}`;

    const drawingColor = strokeColor || "#333";
    const lineWidth = "2";

    return (
      <Wrapper>
        <circle
          cx={center}
          cy={center}
          r={rBody}
          fill="url(#hatch)"
          stroke={drawingColor}
          strokeWidth={lineWidth}
        />

        <path d={arcTop} fill="none" stroke={drawingColor} strokeWidth={lineWidth} strokeLinecap="round" />
        <path d={arcBot} fill="none" stroke={drawingColor} strokeWidth={lineWidth} strokeLinecap="round" />

        <rect
          x={xL - earW}
          y={center - earH / 2}
          width={earW}
          height={earH}
          fill="white"
          stroke={drawingColor}
          strokeWidth={lineWidth}
        />
        <rect
          x={xR}
          y={center - earH / 2}
          width={earW}
          height={earH}
          fill="white"
          stroke={drawingColor}
          strokeWidth={lineWidth}
        />

        <line
          x1={center}
          y1={center - rOuterY - 15}
          x2={center}
          y2={center + rOuterY + 15}
          stroke={drawingColor}
          strokeWidth="1"
          strokeDasharray="4,4"
          className="dash"
        />
        <line
          x1={center - rBody - earW - 10}
          y1={center}
          x2={center + rBody + earW + 10}
          y2={center}
          stroke={drawingColor}
          strokeWidth="1"
          strokeDasharray="4,4"
          className="dash"
        />

        <DimDiameter x1={xL} x2={xR} yTouch={yTouch} yDim={yDim} label={`D ${d || ""}`} />
      </Wrapper>
    );
  }

  // ---- БАЛКА/ДВУТАВР ----
  if (assortment === "Балка/двутавр") {
    const w = 90;
    const h = 120;
    const th = 15;
    const x = center - w / 2;
    const y = center - h / 2;

    const path = `M ${x},${y} L ${x + w},${y} L ${x + w},${y + th} L ${center + th / 2},${y + th
      } L ${center + th / 2},${y + h - th} L ${x + w},${y + h - th} L ${x + w},${y + h
      } L ${x},${y + h} L ${x},${y + h - th} L ${center - th / 2},${y + h - th} L ${center - th / 2
      },${y + th} L ${x},${y + th} Z`;

    return (
      <Wrapper>
        <path d={path} fill="url(#hatch)" stroke={strokeColor} strokeWidth="2" />
        <Dim x1={x} y1={y + h} x2={x + w} y2={y + h} label={`B ${b || "?"}`} offset={20} />
        <Dim x1={x} y1={y} x2={x} y2={y + h} label={`H ${a || "?"}`} offset={-20} vertical />
        <text x={x + w + 10} y={y + th + 5} fill={dimColor} fontSize="11" fontWeight="700">
          t {t}
        </text>
      </Wrapper>
    );
  }

  // ---- ТРУБА ПРОФИЛЬНАЯ ----
  if (assortment === "Труба профильная") {
    const w = 120;
    const h = 80;

    return (
      <Wrapper>
        <rect
          x={center - w / 2}
          y={center - h / 2}
          width={w}
          height={h}
          fill="url(#hatch)"
          stroke={strokeColor}
          strokeWidth="2"
          rx="2"
        />
        <rect
          x={center - w / 2 + 12}
          y={center - h / 2 + 12}
          width={w - 24}
          height={h - 24}
          fill="white"
          stroke={strokeColor}
          strokeWidth="2"
          rx="1"
        />
        <Dim x1={center - w / 2} y1={center + h / 2} x2={center + w / 2} y2={center + h / 2} label={`A ${a || "?"}`} offset={25} />
        <Dim x1={center - w / 2} y1={center - h / 2} x2={center - w / 2} y2={center + h / 2} label={`B ${b || "?"}`} offset={-25} vertical />
        <text x={center} y={center} fill={dimColor} fontSize="11" fontWeight="700" textAnchor="middle">
          s {t}
        </text>
      </Wrapper>
    );
  }

  // ---- КВАДРАТ / ЛИСТ / ЛЕНТА ----
  if (assortment === "Квадрат" || assortment === "Лист/плита" || assortment === "Лента") {
    const w = 100;
    const h = assortment === "Квадрат" ? 100 : 130;

    return (
      <Wrapper>
        <rect
          x={center - w / 2}
          y={center - h / 2}
          width={w}
          height={h}
          fill="url(#hatch)"
          stroke={strokeColor}
          strokeWidth="2"
        />

        {/* a — ширина */}
        <Dim
          x1={center - w / 2}
          y1={center + h / 2}
          x2={center + w / 2}
          y2={center + h / 2}
          label={`a ${a || "?"}`}
          offset={25}
        />

        {/* b — для листа */}
        {assortment === "Лист/плита" && (
          <Dim
            x1={center - w / 2}
            y1={center - h / 2}
            x2={center - w / 2}
            y2={center + h / 2}
            label={`b ${b || "?"}`}
            offset={-25}
            vertical
          />
        )}

        {/* L + t — для ленты */}
        {assortment === "Лента" && (
          <>
            <Dim
              x1={center - w / 2}
              y1={center - h / 2}
              x2={center - w / 2}
              y2={center + h / 2}
              label={`L ${b || "?"}`}
              offset={-25}
              vertical
            />
            <text x={center + w / 2 + 10} y={center} fill={dimColor} fontSize="11" fontWeight="700">
              t {t || ""}
            </text>
          </>
        )}
      </Wrapper>
    );
  }

  // ---- КРУГ/ПРУТОК / ТРУБА КРУГЛАЯ / ПРОВОЛОКА ----
  if (assortment === "Круг/пруток" || assortment === "Труба круглая" || assortment === "Проволока") {
    const r = 60;

    return (
      <Wrapper>
        <circle cx={center} cy={center} r={r} fill="url(#hatch)" stroke={strokeColor} strokeWidth="2" />
        {assortment === "Труба круглая" && (
          <circle cx={center} cy={center} r={r - 15} fill="white" stroke={strokeColor} strokeWidth="2" />
        )}
        <line x1={center} y1={center - r - 15} x2={center} y2={center + r + 15} strokeWidth="1" className="dash" />
        <line x1={center - r - 15} y1={center} x2={center + r + 15} y2={center} strokeWidth="1" className="dash" />
        <Dim x1={center - r} y1={center + r} x2={center + r} y2={center + r} label={`D ${d || "?"}`} offset={25} />
      </Wrapper>
    );
  }

  if (assortment === "Уголок") {
    const w = 120;
    const h = 120;
    const tPx = 28;

    return (
      <Wrapper>
        <path
          d={`
          M ${center - w / 2},${center - h / 2}
          H ${center - w / 2 + tPx}
          V ${center + h / 2 - tPx}
          H ${center + w / 2}
          V ${center + h / 2}
          H ${center - w / 2}
          Z
        `}
          fill="url(#hatch)"
          stroke={strokeColor}
          strokeWidth="2"
        />

        <Dim
          x1={center - w / 2}
          y1={center + h / 2}
          x2={center + w / 2}
          y2={center + h / 2}
          label={`a ${a || "?"}`}
          offset={25}
        />

        <Dim
          x1={center - w / 2}
          y1={center - h / 2}
          x2={center - w / 2}
          y2={center + h / 2}
          label={`b ${b || "?"}`}
          offset={-25}
          vertical
        />

        <text
          x={center - w / 2 + tPx + 6}
          y={center}
          fill={dimColor}
          fontSize="11"
          fontWeight="700"
        >
          t {t || "?"}
        </text>
      </Wrapper>
    );
  }


  if (assortment === "Швеллер") {
    const num = (d || "").toUpperCase();      // сюда мы прокидываем channelNumber
    const isU = num.includes("У");
    const label = num || "Швеллер";

    // размеры в пикселях
    const H = 150;   // высота
    const B = 95;    // ширина полок
    const s = 18;    // стенка
    const tFl = 22;  // полки
    const x0 = center - B / 2;
    const y0 = center - H / 2;
    const x1 = x0 + B;
    const y1 = y0 + H;

    // внешний контур "П"
    const outer =
      `M ${x0},${y0} ` +
      `H ${x1} ` +
      `V ${y0 + tFl} ` +
      `H ${x0 + s} ` +
      `V ${y1 - tFl} ` +
      `H ${x1} ` +
      `V ${y1} ` +
      `H ${x0} ` +
      `Z`;

    // внутренний контур (дырка) — одинаковый для П и У, только у "У" сделаем наклон линиями
    const innerX = x0 + s;
    const innerTopY = y0 + tFl;
    const innerBotY = y1 - tFl;
    const innerRightX = x1 - 10;

    const inner =
      `M ${innerX},${innerTopY} ` +
      `H ${innerRightX} ` +
      `V ${innerBotY} ` +
      `H ${innerX} ` +
      `Z`;

    return (
      <Wrapper>
        {/* тело */}
        <path
          d={`${outer} ${inner}`}
          fill="url(#hatch)"
          stroke={strokeColor}
          strokeWidth="2"
          fillRule="evenodd"
        />

        {/* размер по высоте */}
        <Dim
          x1={x0}
          y1={y0}
          x2={x0}
          y2={y1}
          label={label}
          offset={-25}
          vertical
        />

        {/* уклон полок (для У) — просто две диагональные подсказки внутри, без ломания геометрии */}
        {isU && (
          <>
            <line
              x1={innerX + 6}
              y1={innerTopY + 6}
              x2={innerX + 26}
              y2={innerTopY + 2}
              stroke={strokeColor}
              strokeWidth="2"
              opacity="0.8"
            />
            <line
              x1={innerX + 6}
              y1={innerBotY - 6}
              x2={innerX + 26}
              y2={innerBotY - 2}
              stroke={strokeColor}
              strokeWidth="2"
              opacity="0.8"
            />
          </>
        )}

        {/* подпись типа снизу */}
        <text
          x={center}
          y={y1 + 28}
          textAnchor="middle"
          fill={dimColor}
          fontSize="12"
          fontWeight="800"
        >
          {isU ? "У (уклон полок)" : "П (параллельные полки)"}
        </text>
      </Wrapper>
    );
  }

  if (assortment === "Шестигранник") {
    const A = a || "?";

    const R = 70;
    const cx = center;
    const cy = center;

    const points = Array.from({ length: 6 }).map((_, i) => {
      const ang = (Math.PI / 3) * i; // плоский верх/низ
      return {
        x: cx + R * Math.cos(ang),
        y: cy + R * Math.sin(ang),
      };
    });

    const ptsStr = points.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");

    const yMin = Math.min(...points.map(p => p.y));
    const yMax = Math.max(...points.map(p => p.y));

    const EPS = 1e-6;
    const xAtTop = Math.min(...points.filter(p => Math.abs(p.y - yMin) < EPS).map(p => p.x));
    const xAtBot = Math.min(...points.filter(p => Math.abs(p.y - yMax) < EPS).map(p => p.x));
    const xTouch = Math.min(xAtTop, xAtBot);

    return (
      <Wrapper>
        <polygon
          points={ptsStr}
          fill="url(#hatch)"
          stroke={strokeColor}
          strokeWidth="2"
        />

        <Dim
          x1={xTouch}
          y1={yMin}
          x2={xTouch}
          y2={yMax}
          label={`a ${A}`}
          offset={-50}   // <-- БЫЛО -25, СТАВЬ -35/-40 как в примерах
          vertical
        />
      </Wrapper>
    );
  }


  if (assortment === "Отвод") {
    const R = 85;
    const D_px = 70;
    const rout = R + D_px / 2;
    const rin = R - D_px / 2;
    const off = 45;
    const x0 = size - off;
    const y0 = size - off;

    const x_out_bot = x0 - rout;
    const y_out_bot = y0;
    const x_in_bot = x0 - rin;
    const y_in_bot = y0;

    const x_out_right = x0;
    const y_out_right = y0 - rout;
    const x_in_right = x0;
    const y_in_right = y0 - rin;

    // Парсим размер типа "21.3x2"
    const parts = (d || "").split("x");
    const dLabel = parts[0] || "?";
    const sLabel = parts[1] || "";

    return (
      <Wrapper>
        {/* Тело отвода */}
        <path
          d={`
          M ${x_out_bot},${y_out_bot}
          A ${rout},${rout} 0 0 1 ${x_out_right},${y_out_right}
          L ${x_in_right},${y_in_right}
          A ${rin},${rin} 0 0 0 ${x_in_bot},${y_in_bot}
          Z
        `}
          fill="url(#hatch)"
          stroke={strokeColor}
          strokeWidth="2"
        />

        {/* Осевая линия */}
        <path
          d={`M ${x0 - R},${y0} A ${R},${R} 0 0 1 ${x0},${y0 - R}`}
          fill="none"
          stroke="#a1a1aa"
          strokeWidth="1"
          strokeDasharray="4,2"
        />

        {/* Размер D */}
        <DimDiameter
          x1={x_out_bot}
          x2={x_in_bot}
          yTouch={y_out_bot}
          yDim={y_out_bot + 25}
          label={`D ${dLabel}`}
        />

        {/* Размер S */}
        <text x={x_in_bot + 10} y={y_in_bot - 10} fill={dimColor} fontSize="12" fontWeight="800">
          s {sLabel}
        </text>
      </Wrapper>
    );
  }


  // ---- ПЛЕЙСХОЛДЕР ----
  return (
    <div className="w-40 h-40 border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center text-zinc-300">
      ?
    </div>
  );
}