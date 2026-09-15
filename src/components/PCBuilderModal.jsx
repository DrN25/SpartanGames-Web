import React, { useState } from 'react';
import { X, Check, Monitor, Cpu, HardDrive, Tv, Box, Zap, Wind, Gamepad2, Headphones, ArrowRight, RotateCcw } from 'lucide-react';
import { PC_BUILDER_STEPS, STORE_INFO } from '../data/storeData';

// Mock sample hardware catalog for builder demo
const HARDWARE_CATALOG = {
  1: [ // CPU
    { id: 'cpu-1', name: 'Intel Core i5-14400F 10-Core 4.7GHz', price: 820.00, brand: 'Intel' },
    { id: 'cpu-2', name: 'AMD Ryzen 5 7600 6-Core 5.1GHz', price: 950.00, brand: 'AMD' },
    { id: 'cpu-3', name: 'AMD Ryzen 7 7800X3D Gaming King 5.0GHz', price: 1890.00, brand: 'AMD' }
  ],
  2: [ // Motherboard
    { id: 'mb-1', name: 'MSI B650 Gaming Plus WiFi AM5', price: 790.00, brand: 'MSI' },
    { id: 'mb-2', name: 'ASUS TUF Gaming B760-PLUS WiFi DDR5', price: 850.00, brand: 'ASUS' }
  ],
  3: [ // RAM
    { id: 'ram-1', name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz', price: 540.00, brand: 'Corsair' },
    { id: 'ram-2', name: 'Kingston Fury Beast 16GB DDR5 5600MHz', price: 290.00, brand: 'Kingston' }
  ],
  4: [ // GPU
    { id: 'gpu-1', name: 'ASUS Dual GeForce RTX 4060 8GB OC Edition', price: 1590.00, brand: 'ASUS' },
    { id: 'gpu-2', name: 'MSI GeForce RTX 4070 SUPER 12GB Ventus', price: 3290.00, brand: 'MSI' }
  ],
  5: [ // Storage
    { id: 'ssd-1', name: 'Kingston KC3000 1TB M.2 PCIe 4.0 NVMe (7000MB/s)', price: 390.00, brand: 'Kingston' },
    { id: 'ssd-2', name: 'Lexar NM790 2TB M.2 PCIe 4.0 (7400MB/s)', price: 620.00, brand: 'Lexar' }
  ]
};

export default function PCBuilderModal({ isOpen, onClose }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState({});

  if (!isOpen) return null;

  const currentStep = PC_BUILDER_STEPS[currentStepIndex];
  const stepItems = HARDWARE_CATALOG[currentStep.id] || [
    { id: `demo-${currentStep.id}-1`, name: `${currentStep.name} Spartan High-Performance`, price: 350.00, brand: 'Spartan' },
    { id: `demo-${currentStep.id}-2`, name: `${currentStep.name} Pro Edition`, price: 520.00, brand: 'Gaming' }
  ];

  const total = Object.values(selections).reduce((acc, item) => acc + (item?.price || 0), 0);

  const handleSelect = (item) => {
    setSelections(prev => ({
      ...prev,
      [currentStep.id]: item
    }));
  };

  const handleSkip = () => {
    setSelections(prev => {
      const copy = { ...prev };
      delete copy[currentStep.id];
      return copy;
    });
    if (currentStepIndex < PC_BUILDER_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < PC_BUILDER_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setSelections({});
    setCurrentStepIndex(0);
  };

  const selectedCount = Object.keys(selections).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#0e0e16] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#08080c]">
          <div className="flex items-center gap-3">
            <Monitor className="w-6 h-6 text-spartan-gold" />
            <div>
              <h2 className="text-base sm:text-lg font-black font-display tracking-wide text-white">
                ARMA TU PC GAMER <span className="text-spartan-gold font-normal text-xs sm:text-sm">| Configurador Paso a Paso</span>
              </h2>
              <p className="text-[11px] text-slate-400">Selecciona los componentes. Los pasos con (*) son obligatorios.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-spartan-gold transition-colors"
              title="Reiniciar selección"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stepper Bubbles Bar */}
        <div className="px-6 py-3 bg-[#0a0a0f] border-b border-white/5 overflow-x-auto flex items-center gap-2">
          {PC_BUILDER_STEPS.map((step, idx) => {
            const isSelected = !!selections[step.id];
            const isCurrent = idx === currentStepIndex;

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex flex-col items-center py-1.5 px-3 rounded-lg border text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                  isCurrent 
                    ? 'bg-spartan-gold text-black border-spartan-gold' 
                    : isSelected 
                      ? 'bg-spartan-card text-emerald-400 border-emerald-500/30' 
                      : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/20'
                }`}
              >
                <span>{step.name.split(' ')[0]} {step.required ? '*' : ''}</span>
                <span className="text-[9px] font-mono opacity-80">
                  {isSelected ? '✓ Elegido' : isCurrent ? 'Paso actual' : 'Pendiente'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Main Content: Component Picker + Sidebar Summary */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Main Area: Component Selection for Current Step */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#0c0c14]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-spartan-gold font-bold uppercase tracking-wider">
                  Paso {currentStepIndex + 1} de {PC_BUILDER_STEPS.length}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {currentStep.name} {currentStep.required && <span className="text-spartan-red text-sm">* Obligatorio</span>}
                </h3>
                <p className="text-xs text-slate-400">{currentStep.desc}</p>
              </div>
              {!currentStep.required && (
                <button
                  onClick={handleSkip}
                  className="text-xs text-amber-400 hover:text-amber-300 border border-amber-400/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Omitir este componente &rsaquo;
                </button>
              )}
            </div>

            {/* Hardware Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stepItems.map((item) => {
                const isItemChosen = selections[currentStep.id]?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isItemChosen
                        ? 'bg-spartan-gold/10 border-spartan-gold shadow-lg shadow-spartan-gold/10'
                        : 'bg-spartan-card hover:bg-spartan-cardHover border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="text-spartan-gold uppercase font-bold">{item.brand}</span>
                        {isItemChosen && <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Seleccionado</span>}
                      </div>
                      <h4 className="text-xs font-bold text-white leading-snug">{item.name}</h4>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-sm font-black text-spartan-red">S/. {item.price.toFixed(2)}</span>
                      <button className={`text-xs px-3 py-1 rounded-md font-bold ${
                        isItemChosen ? 'bg-spartan-gold text-black' : 'bg-white/10 text-white'
                      }`}>
                        {isItemChosen ? 'Cambiar' : 'Elegir'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10">
              <button
                onClick={handleBack}
                disabled={currentStepIndex === 0}
                className="px-4 py-2 rounded-lg border border-white/15 text-xs text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                &lsaquo; Paso Anterior
              </button>

              <button
                onClick={handleNext}
                disabled={currentStepIndex === PC_BUILDER_STEPS.length - 1}
                className="px-5 py-2 rounded-lg bg-spartan-gold text-black text-xs font-black hover:bg-spartan-goldHover disabled:opacity-30 cursor-pointer flex items-center gap-1.5"
              >
                Siguiente Paso &rsaquo;
              </button>
            </div>
          </div>

          {/* Right Sidebar Summary */}
          <div className="w-full md:w-80 bg-[#09090f] border-t md:border-t-0 md:border-l border-white/10 p-5 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase mb-3 flex items-center justify-between">
                <span>Tu Ensamble</span>
                <span className="text-spartan-gold font-mono">{selectedCount} items</span>
              </h4>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 text-xs">
                {Object.keys(selections).length === 0 ? (
                  <p className="text-slate-500 text-[11px] italic">Aún no has seleccionado componentes.</p>
                ) : (
                  Object.entries(selections).map(([stepId, sel]) => (
                    <div key={stepId} className="flex justify-between items-start gap-2 py-1.5 border-b border-white/5 text-[11px]">
                      <span className="text-slate-400 truncate flex-1">{sel.name}</span>
                      <span className="font-mono font-bold text-white shrink-0">S/. {sel.price.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400">Total Ensamblado:</span>
                <span className="text-lg font-black text-spartan-gold font-mono">
                  S/. {total.toFixed(2)}
                </span>
              </div>

              <a
                href={`https://api.whatsapp.com/send?phone=51${STORE_INFO.phones[0]}&text=${encodeURIComponent(
                  `Hola Spartan Games, armé esta cotización de PC en su web por S/. ${total.toFixed(2)}:\n` +
                  Object.values(selections).map(s => `• ${s.name} (S/. ${s.price.toFixed(2)})`).join('\n') +
                  `\n¿Me confirman stock y tiempo de armado en tienda?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-spartan-green hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all text-center"
              >
                COTIZAR POR WHATSAPP
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
