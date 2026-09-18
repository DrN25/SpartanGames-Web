import React, { useState, useEffect, useCallback, useMemo } from "react";
import * as Slider from "@radix-ui/react-slider";

/**
 * Mapeo No Lineal / Escala Segmentada (Piecewise Scale)
 *
 * Divide la barra física de 0 a 1000 en 4 cuadrantes correspondientes
 * a los 4 rangos de presupuesto más comunes en hardware:
 * - 0% a 25%   (pos 0 - 250):    S/. 0 a S/. 100     (pasos finos de S/. 5)
 * - 25% a 50%  (pos 250 - 500):  S/. 100 a S/. 500   (pasos de S/. 10)
 * - 50% a 75%  (pos 500 - 750):  S/. 500 a S/. 2,000 (pasos de S/. 50)
 * - 75% a 100% (pos 750 - 1000): S/. 2,000 a maxPrice (pasos de S/. 100)
 */

export function priceToSliderPos(price, maxPrice = 8000) {
  const p = Math.max(0, Math.min(price, maxPrice));
  if (p <= 100) {
    return (p / 100) * 250;
  }
  if (p <= 500) {
    return 250 + ((p - 100) / 400) * 250;
  }
  if (p <= 2000) {
    return 500 + ((p - 500) / 1500) * 250;
  }
  const topSpan = Math.max(1, maxPrice - 2000);
  return 750 + ((p - 2000) / topSpan) * 250;
}

export function sliderPosToPrice(pos, maxPrice = 8000) {
  const p = Math.max(0, Math.min(pos, 1000));
  if (p <= 250) {
    const raw = (p / 250) * 100;
    return Math.round(raw / 5) * 5;
  }
  if (p <= 500) {
    const raw = 100 + ((p - 250) / 250) * 400;
    return Math.round(raw / 10) * 10;
  }
  if (p <= 750) {
    const raw = 500 + ((p - 500) / 250) * 1500;
    return Math.round(raw / 50) * 50;
  }
  const topSpan = Math.max(1, maxPrice - 2000);
  const raw = 2000 + ((p - 750) / 250) * topSpan;
  return Math.min(maxPrice, Math.round(raw / 100) * 100);
}

export default function PriceRangeSlider({
  value = [0, 8000],
  min = 0,
  max = 8000,
  isDarkMode = true,
  onValueCommit,
  onValueChange,
}) {
  // Convertir el valor de precio externo a posición interna (0 - 1000)
  const initialPos = useMemo(() => {
    const v0 = Array.isArray(value) ? value[0] : min;
    const v1 = Array.isArray(value) ? value[1] : max;
    return [priceToSliderPos(v0, max), priceToSliderPos(v1, max)];
  }, [value, min, max]);

  const [sliderPos, setSliderPos] = useState(initialPos);

  // Sincronizar si cambian las props externas (botones rápidos o inputs numéricos)
  useEffect(() => {
    setSliderPos(initialPos);
  }, [initialPos]);

  // Precios calculados para display en tiempo real
  const currentPrices = useMemo(() => {
    return [
      sliderPosToPrice(sliderPos[0], max),
      sliderPosToPrice(sliderPos[1], max),
    ];
  }, [sliderPos, max]);

  const handleSliderChange = useCallback(
    (newPos) => {
      setSliderPos(newPos);
      const newPrices = [
        sliderPosToPrice(newPos[0], max),
        sliderPosToPrice(newPos[1], max),
      ];
      if (onValueChange) {
        onValueChange(newPrices);
      }
    },
    [max, onValueChange]
  );

  const handleSliderCommit = useCallback(
    (finalPos) => {
      const finalPrices = [
        sliderPosToPrice(finalPos[0], max),
        sliderPosToPrice(finalPos[1], max),
      ];
      if (onValueCommit) {
        onValueCommit(finalPrices);
      }
    },
    [max, onValueCommit]
  );

  return (
    <div className="w-full select-none pt-2">
      {/* Slider Radix UI con escala no lineal */}
      <div className="relative pt-6 pb-2">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
          value={sliderPos}
          min={0}
          max={1000}
          step={1}
          minStepsBetweenThumbs={10}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          aria-label="Filtro de rango de precios con escala optimizada"
        >
          {/* Pista base (Track) */}
          <Slider.Track className="relative h-2 w-full grow rounded-full bg-slate-200 dark:bg-gray-800 overflow-hidden">
            {/* Rango coloreado en dorado Spartan */}
            <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-amber-400 via-[#FFDE17] to-amber-300 shadow-[0_0_8px_rgba(255,222,23,0.4)]" />
          </Slider.Track>

          {/* Desplazable Mínimo con Tooltip Flotante Táctico */}
          <Slider.Thumb
            className="group relative block w-5 h-5 bg-white dark:bg-[#FFDE17] border-[2.5px] border-amber-500 dark:border-black shadow-md rounded-full hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:focus-visible:ring-[#FFDE17] cursor-grab active:cursor-grabbing transition-transform z-10"
            aria-label="Precio mínimo"
          >
            {/* Floating Value Badge — ponytail: pure CSS hover/active, zero sticky state */}
            <div
              className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-mono font-bold pointer-events-none z-20 opacity-0 scale-90 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-active:opacity-100 group-active:scale-100 group-active:translate-y-0 transition-all duration-150 ${
                isDarkMode
                  ? "bg-[#18202F] text-[#FFDE17] border border-gray-700 shadow-lg shadow-black/60"
                  : "bg-slate-900 text-[#FFDE17] shadow-lg"
              }`}
            >
              S/. {currentPrices[0].toLocaleString("es-PE")}
              {/* Flechita inferior del tooltip */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${
                  isDarkMode ? "border-t-[#18202F]" : "border-t-slate-900"
                }`}
              />
            </div>
          </Slider.Thumb>

          {/* Desplazable Máximo con Tooltip Flotante Táctico */}
          <Slider.Thumb
            className="group relative block w-5 h-5 bg-white dark:bg-[#FFDE17] border-[2.5px] border-amber-500 dark:border-black shadow-md rounded-full hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:focus-visible:ring-[#FFDE17] cursor-grab active:cursor-grabbing transition-transform z-10"
            aria-label="Precio máximo"
          >
            {/* Floating Value Badge — ponytail: pure CSS hover/active, zero sticky state */}
            <div
              className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-mono font-bold pointer-events-none z-20 opacity-0 scale-90 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-active:opacity-100 group-active:scale-100 group-active:translate-y-0 transition-all duration-150 ${
                isDarkMode
                  ? "bg-[#18202F] text-[#FFDE17] border border-gray-700 shadow-lg shadow-black/60"
                  : "bg-slate-900 text-[#FFDE17] shadow-lg"
              }`}
            >
              S/. {currentPrices[1].toLocaleString("es-PE")}
              {/* Flechita inferior del tooltip */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${
                  isDarkMode ? "border-t-[#18202F]" : "border-t-slate-900"
                }`}
              />
            </div>
          </Slider.Thumb>
        </Slider.Root>

        {/* Marcas tácticas de escala (100, 500, 2000) bajo la barra */}
        <div className="flex justify-between text-[9px] font-mono text-slate-400 dark:text-gray-500 px-0.5 mt-1.5 select-none pointer-events-none">
          <span>0</span>
          <span>100</span>
          <span>500</span>
          <span>2k</span>
          <span>{max >= 1000 ? `${Math.round(max / 1000)}k` : max}</span>
        </div>
      </div>
    </div>
  );
}
