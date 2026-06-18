import React, { createContext, useContext, useState } from "react";
import { calculatorRegistry } from "../data/calculatorRegistry";

const CalculatorRegistryContext = createContext(null);

export function CalculatorRegistryProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = searchQuery.trim()
    ? calculatorRegistry.filter(
        (calc) =>
          calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          calc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          calc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <CalculatorRegistryContext.Provider
      value={{ registry: calculatorRegistry, searchQuery, setSearchQuery, filteredResults }}
    >
      {children}
    </CalculatorRegistryContext.Provider>
  );
}

export function useCalculatorRegistry() {
  return useContext(CalculatorRegistryContext);
}
