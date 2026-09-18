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

/**
 * Detecta qué thumb se está moviendo de forma determinista,
 * gestionando el cruce de puntos (crossover) donde Radix UI
 * reordena los valores internamente manteniendo values[0] <= values[1].
 */
export function getActiveThumbIndex(prevPos, newPos, currentActive = 0) {
  if (!prevPos || !newPos) return currentActive;
  const [p0, p1] = prevPos;
  const [n0, n1] = newPos;

  // Movimiento individual regular
  if (n0 !== p0 && n1 === p1) return 0;
  if (n1 !== p1 && n0 === p0) return 1;

  // Ambos cambiaron en un mismo frame: ocurrió un cruce de puntos (crossover)
  if (n0 !== p0 && n1 !== p1) {
    // Si thumb 0 cruzó hacia la derecha a thumb 1:
    // La posición previa de thumb 1 (p1) ahora es n0, y el punto móvil quedó en n1.
    // Si thumb 1 cruzó hacia la izquierda a thumb 0:
    // La posición previa de thumb 0 (p0) ahora es n1, y el punto móvil quedó en n0.
    const distRightCross = Math.abs(p1 - n0);
    const distLeftCross = Math.abs(p0 - n1);

    if (distRightCross < distLeftCross) {
      return 1;
    } else if (distLeftCross < distRightCross) {
      return 0;
    }
  }

  return currentActive;
}
