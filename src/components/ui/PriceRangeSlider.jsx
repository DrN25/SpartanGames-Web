import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import * as Slider from "@radix-ui/react-slider";
import {
  priceToSliderPos,
  sliderPosToPrice,
  getActiveThumbIndex,
} from "../../utils/priceSliderUtils.js";

export { priceToSliderPos, sliderPosToPrice, getActiveThumbIndex };


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
  const prevSliderPosRef = useRef(initialPos);

  // ponytail: track active thumb for tooltip visibility (0, 1, 'both', or null)
  const [activeThumb, setActiveThumb] = useState(null);
  const activeThumbRef = useRef(null);
  const isDraggingRef = useRef(false);
  const hideTimerRef = useRef(null);
  const isFirstRender = useRef(true);

  // Precios calculados para display en tiempo real
  const currentPrices = useMemo(() => {
    return [
      sliderPosToPrice(sliderPos[0], max),
      sliderPosToPrice(sliderPos[1], max),
    ];
  }, [sliderPos, max]);

  // Programar ocultamiento suave con 1000ms de gracia (permite leer el tooltip en toques rápidos y al soltar)
  const scheduleHide = useCallback(() => {
    isDraggingRef.current = false;
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      activeThumbRef.current = null;
      setActiveThumb(null);
    }, 1000);
  }, []);

  const handleThumbPointerDown = useCallback((index) => {
    isDraggingRef.current = true;
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    activeThumbRef.current = index;
    setActiveThumb(index);
  }, []);

  // Sincronizar si cambian las props externas (botones rápidos o inputs numéricos)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSliderPos(initialPos);
    prevSliderPosRef.current = initialPos;

    // Si el cambio viene de un botón externo de presupuesto o input manual
    if (!isDraggingRef.current) {
      activeThumbRef.current = "both";
      setActiveThumb("both");
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = setTimeout(() => {
        activeThumbRef.current = null;
        setActiveThumb(null);
      }, 1000);
    }
  }, [initialPos]);

  // Listener global pointerup / pointercancel para asegurar que al soltar fuera del thumb se active el temporizador
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDraggingRef.current) {
        scheduleHide();
      }
    };

    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("pointercancel", handleGlobalPointerUp);

    return () => {
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("pointercancel", handleGlobalPointerUp);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [scheduleHide]);

  const handleSliderChange = useCallback(
    (newPos) => {
      const prevPos = prevSliderPosRef.current;
      prevSliderPosRef.current = newPos;
      setSliderPos(newPos);

      // Detectar con precisión qué thumb se movió o si cruzó al otro
      const nextActive = getActiveThumbIndex(prevPos, newPos, activeThumbRef.current ?? 0);
      activeThumbRef.current = nextActive;
      setActiveThumb(nextActive);

      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }

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
      scheduleHide();
      const finalPrices = [
        sliderPosToPrice(finalPos[0], max),
        sliderPosToPrice(finalPos[1], max),
      ];
      if (onValueCommit) {
        onValueCommit(finalPrices);
      }
    },
    [max, onValueCommit, scheduleHide]
  );

  const isThumb0Active = activeThumb === 0 || activeThumb === "both";
  const isThumb1Active = activeThumb === 1 || activeThumb === "both";

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
            className={`group relative block w-5 h-5 bg-white dark:bg-[#FFDE17] border-[2.5px] border-amber-500 dark:border-black shadow-md rounded-full hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:focus-visible:ring-[#FFDE17] cursor-grab active:cursor-grabbing transition-transform touch-none ${
              activeThumb === 0 ? "z-20" : "z-10"
            }`}
            aria-label="Precio mínimo"
            onPointerDown={() => handleThumbPointerDown(0)}
            onPointerUp={scheduleHide}
            onPointerCancel={scheduleHide}
          >
            {/* Floating Value Badge — state-driven for reliable touch lifecycle */}
            <div
              className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-mono font-bold pointer-events-none z-30 transition-all duration-150 ${
                isThumb0Active
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-90 translate-y-1"
              } ${
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
            className={`group relative block w-5 h-5 bg-white dark:bg-[#FFDE17] border-[2.5px] border-amber-500 dark:border-black shadow-md rounded-full hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:focus-visible:ring-[#FFDE17] cursor-grab active:cursor-grabbing transition-transform touch-none ${
              activeThumb === 1 ? "z-20" : "z-10"
            }`}
            aria-label="Precio máximo"
            onPointerDown={() => handleThumbPointerDown(1)}
            onPointerUp={scheduleHide}
            onPointerCancel={scheduleHide}
          >
            {/* Floating Value Badge — state-driven for reliable touch lifecycle */}
            <div
              className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-mono font-bold pointer-events-none z-30 transition-all duration-150 ${
                isThumb1Active
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-90 translate-y-1"
              } ${
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
