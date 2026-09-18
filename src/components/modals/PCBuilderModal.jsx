import React, { useState, useMemo } from "react";
import { X, Check, RotateCcw, Sparkles, WhatsAppIcon } from "../common/Icons";
import { pcBuilderSteps, storeInfo as defaultStoreInfo } from "../../data/storeData";
import { useModalTransition } from "../../hooks/useModalTransition";

export default function PCBuilderModal({
  isOpen,
  onClose,
  isDarkMode,
  products = [],
  storeInfo = defaultStoreInfo
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState({});
  const { shouldRender, isClosing } = useModalTransition(isOpen, 220);

  // Group products dynamically by step category
  const stepItemsMap = useMemo(() => {
    const map = {};

    pcBuilderSteps.forEach((step) => {
      const stepCatId = (step.categoryId || "").toLowerCase();

      const matched = products.filter((p) => {
        const pCatId = (p.categoryId || "").toLowerCase();
        const pCatName = (p.category || "").toLowerCase();
        const pName = (p.name || "").toLowerCase();

        if (pCatId === stepCatId || pCatName.includes(stepCatId)) return true;

        if (stepCatId === "procesadores" || stepCatId === "cpu") {
          return (
            pCatId.includes("procesador") ||
            pCatName.includes("procesador") ||
            pCatId === "cpu" ||
            pName.includes("ryzen") ||
            pName.includes("core i")
          );
        }
        if (stepCatId === "placas-madre") {
          return (
            pCatId.includes("placa") ||
            pCatName.includes("placa") ||
            pCatId.includes("motherboard") ||
            pName.includes("b650") ||
            pName.includes("b760") ||
            pName.includes("z790")
          );
        }
        if (stepCatId === "ram") {
          return (
            pCatId === "ram" ||
            pCatName.includes("ram") ||
            pCatName.includes("memoria") ||
            pName.includes("ddr5") ||
            pName.includes("ddr4")
          );
        }
        if (stepCatId === "tarjetas-video") {
          return (
            pCatId.includes("video") ||
            pCatName.includes("video") ||
            pCatId === "gpu" ||
            pName.includes("rtx") ||
            pName.includes("radeon")
          );
        }
        if (stepCatId === "almacenamiento") {
          return (
            pCatId.includes("almacenamiento") ||
            pCatName.includes("almacenamiento") ||
            pCatId.includes("ssd") ||
            pName.includes("ssd") ||
            pName.includes("nvme")
          );
        }
        if (stepCatId === "fuentes") {
          return (
            pCatId.includes("fuente") ||
            pCatName.includes("fuente") ||
            pName.includes("fuente") ||
            pName.includes("psu") ||
            pName.includes("80 plus")
          );
        }
        if (stepCatId === "cases") {
          return (
            pCatId.includes("case") ||
            pCatName.includes("case") ||
            pName.includes("case") ||
            pName.includes("gabinete")
          );
        }
        if (stepCatId === "coolers") {
          return (
            pCatId.includes("cooler") ||
            pCatName.includes("cooler") ||
            pName.includes("cooler") ||
            pName.includes("refrigeracion") ||
            pName.includes("disipador")
          );
        }
        if (stepCatId === "monitores") {
          return (
            pCatId.includes("monitor") ||
            pCatName.includes("monitor") ||
            pName.includes("monitor") ||
            pName.includes("hz")
          );
        }
        if (stepCatId === "audio") {
          return (
            pCatId.includes("audio") ||
            pCatName.includes("audio") ||
            pName.includes("auricular") ||
            pName.includes("audifono") ||
            pName.includes("headset")
          );
        }
        return false;
      });

      map[step.id] = matched;
    });

    return map;
  }, [products]);

  if (!shouldRender) return null;

  const currentStep = pcBuilderSteps[currentStepIndex];
  const stepItems = stepItemsMap[currentStep?.id] || [];

  const handleSelectComponent = (item) => {
    setSelections((prev) => ({
      ...prev,
      [currentStep.id]: item
    }));
    if (currentStepIndex < pcBuilderSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleSkipStep = () => {
    if (currentStepIndex < pcBuilderSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setSelections({});
    setCurrentStepIndex(0);
  };

  const totalPrice = Object.values(selections).reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0
  );

  // WhatsApp Quote Builder
  const quoteItems = Object.entries(selections)
    .map(([stepId, item]) => {
      const step = pcBuilderSteps.find((s) => s.id === Number(stepId));
      return `• [${step?.name}]: ${item.name} (S/. ${Number(item.price).toFixed(2)})`;
    })
    .join("\n");

  const whatsappPhone = (storeInfo?.whatsappMain || storeInfo?.phones?.[0] || "").replace(/[^0-9]/g, "");
  const storeName = storeInfo?.name || "Tienda";
  const storeLoc = storeInfo?.address || (storeInfo?.city ? `tienda física (${storeInfo.city})` : "tienda física");
  const whatsappQuoteMsg = `Hola ${storeName}, acabo de armar la siguiente cotización en su configurador online:\n\n${quoteItems}\n\n*TOTAL ESTIMADO:* S/. ${totalPrice.toFixed(2)}\n\nPor favor confirmar compatibilidad, armado y disponibilidad en ${storeLoc}.`;
  const whatsappQuoteUrl = whatsappPhone ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappQuoteMsg)}` : "";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md ${
        isClosing ? "animate-spartan-fade-out" : "animate-spartan-fade-in"
      }`}
    >
      <div
        className={`relative w-full max-w-5xl border rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${
          isClosing ? "animate-spartan-modal-exit" : "animate-spartan-modal"
        } ${
          isDarkMode
            ? "bg-[#0B0E14] text-white"
            : "bg-white text-slate-900"
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDarkMode ? "border-gray-800 bg-[#111620]" : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFDE17] text-slate-950 flex items-center justify-center font-black shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wide">
                Configurador de PC
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-gray-400">
                Componentes 100% compatibles con armado y testeo gratis en Arequipa
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className={`p-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-slate-600 hover:text-black hover:bg-slate-200"
              }`}
              title="Reiniciar ensamble"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-slate-600 hover:text-black hover:bg-slate-200"
              }`}
              aria-label="Cerrar configurador"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div
          className={`px-6 py-3 border-b flex items-center gap-2 overflow-x-auto ${
            isDarkMode ? "bg-black/30 border-gray-800" : "bg-slate-100/60 border-slate-200"
          }`}
        >
          {pcBuilderSteps.map((step, idx) => {
            const isSelected = Boolean(selections[step.id]);
            const isCurrent = currentStepIndex === idx;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isCurrent
                    ? "bg-[#FFDE17] text-slate-950 font-black shadow-xs scale-105"
                    : isSelected
                    ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40"
                    : isDarkMode
                    ? "text-gray-400 hover:bg-gray-800"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{step.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
          {/* Step Catalog */}
          <div className="flex-1 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-gray-800">
              <div>
                <h3 className="text-lg font-black uppercase text-slate-950 dark:text-[#FFDE17]">
                  Selecciona: {currentStep.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">{currentStep.hint}</p>
              </div>

              {!currentStep.required && (
                <button
                  onClick={handleSkipStep}
                  className="text-xs text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:underline font-bold cursor-pointer"
                >
                  Omitir este componente →
                </button>
              )}
            </div>

            {stepItems.length === 0 ? (
              <div className="p-8 border border-dashed rounded-2xl text-center space-y-2">
                <p className="text-sm font-bold text-slate-500 dark:text-gray-400">
                  No hay componentes disponibles en stock para {currentStep.name}.
                </p>
                <p className="text-xs text-slate-400">
                  Agrega nuevos componentes en la hoja de Google Sheets bajo la categoría correspondiente para verlos aquí.
                </p>
                <button
                  onClick={handleSkipStep}
                  className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                >
                  Continuar al siguiente paso →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {stepItems.map((item) => {
                  const isItemChosen = selections[currentStep.id]?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectComponent(item)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isItemChosen
                          ? "border-amber-500 bg-amber-50/60 ring-1 ring-amber-500 dark:border-[#FFDE17] dark:bg-[#FFDE17]/10 dark:ring-[#FFDE17]"
                          : isDarkMode
                          ? "bg-[#111620] border-gray-800 hover:border-gray-700"
                          : "bg-white border-slate-200 hover:border-amber-300 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {item.image && (
                          <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-black/30 p-1 flex items-center justify-center flex-shrink-0 border border-slate-200/60 dark:border-gray-800">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/assets/images/spartan_games_banner.jpg";
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-black dark:text-[#FFDE17]">
                              {item.brand}
                            </span>
                            {item.stock !== undefined && item.stock <= 4 && (
                              <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                                ¡Solo {item.stock} en tienda!
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                            {item.name}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-base font-black text-slate-950 dark:text-[#FFDE17]">
                          S/. {Number(item.price).toFixed(2)}
                        </div>
                        <span className="text-[10px] text-slate-400">Inc. IGV</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quote Sidebar */}
          <div
            className={`w-full md:w-80 p-6 border-t md:border-t-0 md:border-l flex flex-col justify-between ${
              isDarkMode ? "border-gray-800 bg-[#0E121A]" : "border-slate-200 bg-slate-50"
            }`}
          >
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 dark:text-white mb-3">
                Tu Arsenal Configurado
              </h4>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 text-xs">
                {Object.keys(selections).length === 0 ? (
                  <p className="text-slate-400 text-xs italic">Aún no has seleccionado ningún componente.</p>
                ) : (
                  Object.entries(selections).map(([stepId, item]) => {
                    const step = pcBuilderSteps.find((s) => s.id === Number(stepId));
                    return (
                      <div
                        key={stepId}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111620] flex items-center justify-between gap-2"
                      >
                        <div className="truncate">
                          <div className="text-[10px] font-bold text-slate-400">{step?.name}</div>
                          <div className="font-bold text-slate-800 dark:text-gray-200 truncate">{item.name}</div>
                        </div>
                        <div className="font-mono font-bold text-right text-xs">
                          S/. {Number(item.price).toFixed(2)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-gray-800 space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-gray-400">Total Proforma:</span>
                <span className="text-xl font-black text-slate-950 dark:text-[#FFDE17]">
                  S/. {totalPrice.toFixed(2)}
                </span>
              </div>

              <a
                href={whatsappQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 px-4 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                  Object.keys(selections).length > 0
                    ? "bg-[#25D366] hover:bg-emerald-600 text-white shadow-emerald-500/20"
                    : "bg-slate-300 dark:bg-gray-800 text-slate-500 pointer-events-none"
                }`}
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Exportar Proforma a WhatsApp</span>
              </a>

              <p className="text-[10px] text-center text-slate-400 leading-tight">
                * Incluye armado gratuito, gestión de cables y pruebas de rendimiento en Compuplaza Arequipa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
