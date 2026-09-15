import React, { useState } from "react";
import { X, Check, RotateCcw, Sparkles } from "./Icons";
import { WhatsAppIcon } from "./Icons";
import { pcBuilderSteps, storeInfo } from "../data/storeData";

const HARDWARE_CATALOG = {
  1: [
    { id: "cpu-1", name: "AMD Ryzen 7 7800X3D (8C/16T, 96MB Cache AM5)", price: 1899.0, brand: "AMD" },
    { id: "cpu-2", name: "Intel Core i7-14700K (20C/28T, 5.6 GHz Turbo LGA1700)", price: 1780.0, brand: "Intel" },
    { id: "cpu-3", name: "AMD Ryzen 5 7600X (6C/12T, 5.3 GHz Turbo AM5)", price: 1050.0, brand: "AMD" }
  ],
  2: [
    { id: "mb-1", name: "ASUS TUF GAMING B650-PLUS WIFI (Socket AM5, DDR5)", price: 980.0, brand: "ASUS" },
    { id: "mb-2", name: "MSI MAG B760 TOMAHAWK WIFI (Socket LGA1700, DDR5)", price: 990.0, brand: "MSI" }
  ],
  3: [
    { id: "ram-1", name: "CORSAIR VENGEANCE RGB 16GB DDR5 6400MHz", price: 989.1, brand: "Corsair" },
    { id: "ram-2", name: "KINGSTON FURY BEAST RGB 32GB (2x16GB) DDR5 6000MHz", price: 649.0, brand: "Kingston" }
  ],
  4: [
    { id: "gpu-1", name: "ASUS TUF GAMING GEFORCE RTX 4070 Ti SUPER 16GB", price: 3950.0, brand: "ASUS" },
    { id: "gpu-2", name: "ASUS DUAL GEFORCE RTX 4060 OC 8GB GDDR6", price: 1499.0, brand: "ASUS" }
  ],
  5: [
    { id: "ssd-1", name: "SSD M.2 NVMe KINGSTON KC3000 1TB PCIe 4.0 (7000 MB/s)", price: 439.0, brand: "Kingston" },
    { id: "ssd-2", name: "SSD M.2 NVMe Lexar NM790 2TB PCIe 4.0 (7400 MB/s)", price: 690.0, brand: "Lexar" }
  ],
  6: [
    { id: "psu-1", name: "Corsair RM750e 750W 80 Plus Gold Modular ATX 3.0", price: 540.0, brand: "Corsair" },
    { id: "psu-2", name: "ASUS TUF Gaming 650W 80 Plus Bronze", price: 340.0, brand: "ASUS" }
  ],
  7: [
    { id: "case-1", name: "Gabinete Montech AIR 903 MAX (4x Fans 140mm ARGB)", price: 380.0, brand: "Montech" },
    { id: "case-2", name: "Gabinete Lian Li Lancool 216 RGB Black", price: 490.0, brand: "Lian Li" }
  ]
};

export default function PCBuilderModal({ isOpen, onClose, isDarkMode }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState({});

  if (!isOpen) return null;

  const currentStep = pcBuilderSteps[currentStepIndex];
  const stepItems = HARDWARE_CATALOG[currentStep.id] || [
    { id: `demo-${currentStep.id}-1`, name: `${currentStep.name} Spartan Standard`, price: 290.0, brand: "Spartan" },
    { id: `demo-${currentStep.id}-2`, name: `${currentStep.name} High Performance`, price: 480.0, brand: "Gamer Pro" }
  ];

  const handleSelectComponent = (item) => {
    setSelections({ ...selections, [currentStep.id]: item });
    if (currentStepIndex < pcBuilderSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleSkipStep = () => {
    const updated = { ...selections };
    delete updated[currentStep.id];
    setSelections(updated);
    if (currentStepIndex < pcBuilderSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleReset = () => {
    setSelections({});
    setCurrentStepIndex(0);
  };

  const totalPrice = Object.values(selections).reduce((sum, item) => sum + item.price, 0);

  // WhatsApp Quote Builder
  const quoteItems = Object.entries(selections)
    .map(([stepId, item]) => {
      const step = pcBuilderSteps.find((s) => s.id === Number(stepId));
      return `• [${step?.name}]: ${item.name} (S/. ${item.price.toFixed(2)})`;
    })
    .join("\n");

  const whatsappQuoteMsg = `Hola Spartan Games Arequipa, acabo de armar la siguiente cotización en su configurador online:\n\n${quoteItems}\n\n*TOTAL ESTIMADO:* S/. ${totalPrice.toFixed(2)}\n\nPor favor confirmar compatibilidad, armado gratuito y disponibilidad en Compuplaza Arequipa.`;
  const whatsappQuoteUrl = `https://wa.me/${storeInfo.whatsappMain}?text=${encodeURIComponent(whatsappQuoteMsg)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-5xl border rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${
          isDarkMode ? "bg-[#0B0E14] border-gray-800 text-white" : "bg-white border-slate-200 text-slate-900"
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
              <h2 className="text-base font-black uppercase tracking-wider text-slate-950 dark:text-white">
                Configurador de PC Gamer Spartan
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-gray-400">
                Paso {currentStepIndex + 1} de {pcBuilderSteps.length}: {currentStep.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1 font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                  : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
              }`}
              aria-label="Cerrar configurador"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Steps Progress Bar */}
        <div
          className={`px-6 py-3 border-b flex items-center gap-1.5 overflow-x-auto ${
            isDarkMode ? "border-gray-800 bg-[#0E121A]" : "border-slate-200 bg-slate-100/70"
          }`}
        >
          {pcBuilderSteps.map((step, idx) => {
            const isSelected = Boolean(selections[step.id]);
            const isCurrent = currentStepIndex === idx;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isCurrent
                    ? "bg-[#FFDE17] text-slate-950 shadow-sm font-black"
                    : isSelected
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40"
                    : isDarkMode
                    ? "text-gray-500 hover:text-gray-300"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{step.id}.</span>
                <span>{step.name.split(" ")[0]}</span>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Content: Picker + Summary Sidebar */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Picker Column */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black uppercase text-slate-950 dark:text-[#FFDE17]">
                  Selecciona: {currentStep.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">{currentStep.hint}</p>
              </div>

              {!currentStep.required && (
                <button
                  onClick={handleSkipStep}
                  className="text-xs text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:underline font-bold"
                >
                  Omitir este componente →
                </button>
              )}
            </div>

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
                    <div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-950 text-[#FFDE17]">
                        {item.brand}
                      </span>
                      <h4 className="font-bold text-sm mt-1 text-slate-950 dark:text-white">{item.name}</h4>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-black text-[#FF334B]">
                        S/. {item.price.toFixed(2)}
                      </div>
                      <button className="mt-1 px-3 py-1 rounded-lg bg-[#FFDE17] text-slate-950 text-[11px] font-black uppercase shadow-sm">
                        {isItemChosen ? "Seleccionado" : "Elegir"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky Summary Sidebar */}
          <div
            className={`w-full md:w-80 p-6 border-t md:border-t-0 md:border-l flex flex-col justify-between overflow-y-auto ${
              isDarkMode ? "border-gray-800 bg-[#0E121A]" : "border-slate-200 bg-slate-50"
            }`}
          >
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-4 pb-2 border-b border-slate-200 dark:border-gray-700/40">
                Tu Ensamble Spartan ({Object.keys(selections).length} piezas)
              </h3>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {Object.keys(selections).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    Aún no has seleccionado ningún componente.
                  </p>
                ) : (
                  Object.entries(selections).map(([stepId, item]) => {
                    const step = pcBuilderSteps.find((s) => s.id === Number(stepId));
                    return (
                      <div
                        key={stepId}
                        className={`p-2.5 rounded-xl border text-xs ${
                          isDarkMode ? "bg-black/30 border-gray-800" : "bg-white border-slate-200 shadow-sm"
                        }`}
                      >
                        <div className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase">
                          {step?.name}
                        </div>
                        <div className="font-bold truncate text-slate-900 dark:text-gray-200">{item.name}</div>
                        <div className="text-[11px] font-black text-amber-800 dark:text-[#FFDE17] mt-0.5">
                          S/. {item.price.toFixed(2)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-gray-700/40 mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-600 dark:text-gray-400">Total Estimado</span>
                <span className="text-2xl font-black text-[#FF334B]">
                  S/. {totalPrice.toFixed(2)}
                </span>
              </div>

              <a
                href={whatsappQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-black uppercase text-xs tracking-wider bg-[#25D366] text-slate-950 hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10"
              >
                <WhatsAppIcon className="w-4 h-4" colored={false} />
                <span>Pedir Cotización por WhatsApp</span>
              </a>

              <p className="text-[10px] text-center text-slate-500 dark:text-gray-400">
                Incluye ensamble profesional gratuito y pruebas térmicas en Compuplaza Tienda 204.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
