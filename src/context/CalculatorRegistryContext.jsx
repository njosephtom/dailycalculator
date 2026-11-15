import React, { createContext, useContext, useState } from "react";
import { calculatorRegistry } from "../data/calculatorRegistry";
import { canSeeCategory } from "../utils/pdfAccess";

const CalculatorRegistryContext = createContext(null);

export function CalculatorRegistryProvider({ children, user }) {
  const [searchQuery, setSearchQuery] = useState("");
  const visibleRegistry = calculatorRegistry.filter((c) => canSeeCategory(c.category, user));

  const filteredResults = searchQuery.trim()
    ? visibleRegistry.filter(
        (calc) =>
          calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          calc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          calc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <CalculatorRegistryContext.Provider
      value={{ registry: visibleRegistry, searchQuery, setSearchQuery, filteredResults }}
    >
      {children}
    </CalculatorRegistryContext.Provider>
  );
}

export function useCalculatorRegistry() {
  return useContext(CalculatorRegistryContext);
}
