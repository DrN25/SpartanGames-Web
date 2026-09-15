import React from "react";
import { ChevronRight, Home } from "./Icons";

export default function Breadcrumbs({ items, isDarkMode, onNavigate }) {
  return (
    <nav aria-label="Ruta de navegación" className="py-3 px-4 rounded-lg flex items-center flex-wrap gap-2 text-xs font-medium transition-colors">
      <button
        onClick={() => onNavigate("home")}
        className={`flex items-center gap-1 transition-colors hover:text-[#FFDE17] ${
          isDarkMode ? "text-gray-400 hover:text-[#FFDE17]" : "text-gray-500 hover:text-[#B45309]"
        }`}
        title="Volver a Inicio"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Inicio</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isDarkMode ? "text-gray-600" : "text-gray-300"}`} />
            {isLast ? (
              <span
                className={`truncate max-w-[200px] sm:max-w-md font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-900"
                }`}
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => {
                  if (item.action) item.action();
                }}
                className={`transition-colors hover:underline ${
                  isDarkMode ? "text-gray-400 hover:text-[#FFDE17]" : "text-gray-600 hover:text-amber-600"
                }`}
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}