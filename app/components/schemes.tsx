import React from "react";

// Общие настройки стилей схемы
const size = 260;
const center = size / 2;
const strokeColor = "#18181b"; // черный
const dimColor = "#2563EB";    // синий

const Defs = () => (
  <defs>
    <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
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

const Dim = ({ x1, y1, x2, y2, label, offset = 25, vertical = false }: any) => {
  const offX = vertical ? offset : 0;
  const offY = vertical ? 0 : offset;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x1 + offX} y2={y1 + offY} stroke={dimColor} strokeWidth="0.5" opacity="0.5" />
      <line x1={x2} y1={y2} x2={x2 + offX} y2={y2 + offY} stroke={dimColor} strokeWidth="0.5" opacity="0.5" />
      <line x1={x1 + (vertical ? offset - 5 : 0)} y1={y1 + (vertical ? 0 : offset - 5)} x2={x2 + (vertical ? offset - 5 : 0)} y2={y2 + (vertical ? 0 : offset - 5)} stroke={dimColor} strokeWidth="1.5" markerStart="url(#arrow-rev)" markerEnd="url(#arrow)" />
      <rect x={(x1+x2)/2 + (vertical ? offset - 20 : -15)} y={(y1+y2)/2 + (vertical ? -10 : offset - 15)} width="30" height="16" fill="white" fillOpacity="0.8" rx="2" />
      <text x={(x1+x2)/2 + (vertical ? offset - 5 : 0)} y={(y1+y2)/2 + (vertical ? 4 : offset - 4)} textAnchor="middle" fill={dimColor} fontSize="11" fontWeight="700">{label}</text>
    </g>
  );
}

const DimDiameter = ({
  x1,
  x2,
  yTouch,
  yDim,
  label,
}: {
  x1: number;        // левая точка касания тела (без ушек)
  x2: number;        // правая точка касания тела (без ушек)
  yTouch: number;    // y касания тела (обычно center)
  yDim: number;      // y размерной линии
  label: string;     // например "D 10"
}) => {
  // защита от NaN
  if (![x1, x2, yTouch, yDim].every(Number.isFinite)) return null;

  return (
    <g>
      {/* выносные линии (палочки) */}
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

      {/* подпись (без белой плашки) */}
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
  b: string;
  t: string;
};

export default function AssortmentScheme({ assortment, d, a, b, t }: SchemeProps) {
  if (!assortment) return <span className="text-4xl text-zinc-200">?</span>;

  if (assortment === "Арматура") {
  // 1. Уменьшаем размеры, чтобы было аккуратнее
  const rBody = 58;       // Основной радиус (тело)
  const ribHeight = 10;   // Высота "серпа" (рифления)
  
  // Ушки делаем маленькими прямоугольниками, как на чертеже
  const earW = 8;         
  const earH = 12;

  const xL = center - rBody;
  const xR = center + rBody;

  // Координаты для размерных линий
  const yTouch = center;
  const yDim = center + rBody + ribHeight + 25; // Отступ вниз для размера

  // ГЛАВНЫЙ СЕКРЕТ ВИЗУАЛА:
  // Рисуем эллиптическую дугу. 
  // rx = rBody (ширина равна телу)
  // ry = rBody + ribHeight (высота больше тела)
  // Это создает эффект плавного схождения "на нет" по бокам.
  const rOuterY = rBody + ribHeight; 
  
  // Формула SVG пути: M (начало) A (радиусХ радиусY ...) (конец)
  const arcTop = `M ${xL},${center} A ${rBody},${rOuterY} 0 0 1 ${xR},${center}`;
  const arcBot = `M ${xL},${center} A ${rBody},${rOuterY} 0 0 0 ${xR},${center}`;

  // Цвет линий делаем чуть строже, если strokeColor приходит цветным, 
  // для чертежа лучше использовать почти черный или темно-серый.
  const drawingColor = strokeColor || "#333";
  const lineWidth = "2"; // Тонкие линии как на чертеже (было 3)

  return (
    <Wrapper>
      {/* 1. Тело арматуры (заштрихованный круг) */}
      <circle 
        cx={center} 
        cy={center} 
        r={rBody} 
        fill="url(#hatch)" 
        stroke={drawingColor} 
        strokeWidth={lineWidth} 
      />

      {/* 2. Верхняя и нижняя дуги (рифление) */}
      {/* fill="none" оставляет фон прозрачным/белым */}
      <path d={arcTop} fill="none" stroke={drawingColor} strokeWidth={lineWidth} strokeLinecap="round" />
      <path d={arcBot} fill="none" stroke={drawingColor} strokeWidth={lineWidth} strokeLinecap="round" />

      {/* 3. Ушки (прямоугольники) */}
      {/* fill="white" перекрывает штриховку, если она попадет под них,
          но важнее, что они пристыкованы ровно к краям xL и xR */}
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

      {/* 4. Осевые пунктирные линии */}
      {/* Они должны проходить ПОВЕРХ ушек (как на скриншоте конкурентов) */}
      <line 
        x1={center} 
        y1={center - rOuterY - 15} 
        x2={center} 
        y2={center + rOuterY + 15} 
        stroke={drawingColor}
        strokeWidth="1" 
        strokeDasharray="4,4" // Более частый пунктир для аккуратности
        className="dash" 
      />
      <line 
        x1={center - rBody - earW - 10} // Линия выходит за ушки
        y1={center} 
        x2={center + rBody + earW + 10} 
        y2={center} 
        stroke={drawingColor}
        strokeWidth="1" 
        strokeDasharray="4,4"
        className="dash" 
      />

      {/* 5. Размер D */}
      {/* Важно: размер меряется по ТЕЛУ (xL, xR), линии идут от стыка ушка и круга */}
      <DimDiameter 
        x1={xL} 
        x2={xR} 
        yTouch={yTouch} 
        yDim={yDim} 
        label={`D ${d || ""}`} 
      />
    </Wrapper>
  );
}


  if (assortment === "Балка/двутавр") {
    const w = 90; const h = 120; const th = 15;
    const x = center - w/2; const y = center - h/2;
    const path = `M ${x},${y} L ${x+w},${y} L ${x+w},${y+th} L ${center+th/2},${y+th} L ${center+th/2},${y+h-th} L ${x+w},${y+h-th} L ${x+w},${y+h} L ${x},${y+h} L ${x},${y+h-th} L ${center-th/2},${y+h-th} L ${center-th/2},${y+th} L ${x},${y+th} Z`;
    return (
      <Wrapper>
        <path d={path} fill="url(#hatch)" stroke={strokeColor} strokeWidth="2" />
        <Dim x1={x} y1={y+h} x2={x+w} y2={y+h} label={`B ${b || "?"}`} offset={20} />
        <Dim x1={x} y1={y} x2={x} y2={y+h} label={`H ${a || "?"}`} offset={-20} vertical />
        <text x={x+w+10} y={y+th+5} fill={dimColor} fontSize="11" fontWeight="700">t {t}</text>
      </Wrapper>
    );
  }

  if (assortment === "Труба профильная") {
    const w = 120; const h = 80;
    return (
      <Wrapper>
        <rect x={center-w/2} y={center-h/2} width={w} height={h} fill="url(#hatch)" stroke={strokeColor} strokeWidth="2" rx="2" />
        <rect x={center-w/2+12} y={center-h/2+12} width={w-24} height={h-24} fill="white" stroke={strokeColor} strokeWidth="2" rx="1" />
        <Dim x1={center-w/2} y1={center+h/2} x2={center+w/2} y2={center+h/2} label={`A ${a || "?"}`} offset={25} />
        <Dim x1={center-w/2} y1={center-h/2} x2={center-w/2} y2={center+h/2} label={`B ${b || "?"}`} offset={-25} vertical />
        <text x={center} y={center} fill={dimColor} fontSize="11" fontWeight="700" textAnchor="middle">s {t}</text>
      </Wrapper>
    );
  }

  if (assortment === "Квадрат" || assortment === "Лист/плита") {
     const w = 100; const h = assortment === "Квадрат" ? 100 : 130;
     return (
        <Wrapper>
           <rect x={center-w/2} y={center-h/2} width={w} height={h} fill="url(#hatch)" stroke={strokeColor} strokeWidth="2" />
           <Dim x1={center-w/2} y1={center+h/2} x2={center+w/2} y2={center+h/2} label={`a ${a || "?"}`} offset={25} />
           {assortment === "Лист/плита" && (
             <Dim x1={center-w/2} y1={center-h/2} x2={center-w/2} y2={center+h/2} label={`b ${b || "?"}`} offset={-25} vertical />
           )}
        </Wrapper>
     )
  }

  if (assortment === "Круг/пруток" || assortment === "Труба круглая" || assortment === "Проволока") {
      const r = 60;
      return (
        <Wrapper>
           <circle cx={center} cy={center} r={r} fill="url(#hatch)" stroke={strokeColor} strokeWidth="2" />
           {assortment === "Труба круглая" && (
              <circle cx={center} cy={center} r={r-15} fill="white" stroke={strokeColor} strokeWidth="2" />
           )}
           <line x1={center} y1={center-r-15} x2={center} y2={center+r+15} strokeWidth="1" className="dash" />
           <line x1={center-r-15} y1={center} x2={center+r+15} y2={center} strokeWidth="1" className="dash" />
           <Dim x1={center-r} y1={center+r} x2={center+r} y2={center+r} label={`D ${d || "?"}`} offset={25} />
        </Wrapper>
      )
  }

  return (
    <div className="w-40 h-40 border-2 border-dashed border-zinc-200 rounded-xl flex items-center justify-center text-zinc-300">
      ?
    </div>
  );
}