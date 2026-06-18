import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CalculatorRegistryProvider } from "./context/CalculatorRegistryContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import CategoryHub from "./pages/CategoryHub";
import ComingSoon from "./pages/ComingSoon";

// Finance
import CompoundInterest     from "./pages/finance/CompoundInterest";
import SimpleInterest       from "./pages/finance/SimpleInterest";
import SavingsCalculator    from "./pages/finance/SavingsCalculator";
import LoanCalculator       from "./pages/finance/LoanCalculator";
import AprCalculator        from "./pages/finance/AprCalculator";
import InflationCalculator  from "./pages/finance/InflationCalculator";
import SipCalculator        from "./pages/finance/SipCalculator";
import LumpsumCalculator    from "./pages/finance/LumpsumCalculator";
import GstCalculator        from "./pages/finance/GstCalculator";

// Math
import PercentageCalculator from "./pages/math/PercentageCalculator";
import PercentageChange     from "./pages/math/PercentageChange";
import FractionToDecimal    from "./pages/math/FractionToDecimal";

// Misc
import CubicYards           from "./pages/misc/CubicYards";
import AgeCalculator        from "./pages/misc/AgeCalculator";

// Health
import BmiBmr               from "./pages/health/BmiBmr";
import BmiCalculator        from "./pages/health/BmiCalculator";
import BmrCalculator        from "./pages/health/BmrCalculator";
import BodyFat              from "./pages/health/BodyFat";
import PregnancyCalculator  from "./pages/health/PregnancyCalculator";
import CalorieDeficit       from "./pages/health/CalorieDeficit";

// Cooking
import CookingConverter     from "./pages/cooking/CookingConverter";

// Convert
import LengthWeight         from "./pages/convert/LengthWeight";
import WeightConverter      from "./pages/convert/WeightConverter";
import LengthConverter      from "./pages/convert/LengthConverter";

export default function App() {
  return (
    <ThemeProvider>
      <CalculatorRegistryProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            {/* Category hub pages */}
            <Route path=":category" element={<CategoryHub />} />

            {/* ── Finance ── */}
            <Route path="finance/compound-interest"           element={<CompoundInterest />} />
            <Route path="finance/simple-interest-calculator"  element={<SimpleInterest />} />
            <Route path="finance/savings-calculator"          element={<SavingsCalculator />} />
            <Route path="finance/loan-calculator"             element={<LoanCalculator />} />
            <Route path="finance/apr-calculator"              element={<AprCalculator />} />
            <Route path="finance/inflation-calculator"        element={<InflationCalculator />} />
            <Route path="finance/sip-calculator"              element={<SipCalculator />} />
            <Route path="finance/lumpsum-calculator"          element={<LumpsumCalculator />} />
            <Route path="finance/gst-calculator"              element={<GstCalculator />} />

            {/* ── Math ── */}
            <Route path="math/percentage-calculator"          element={<PercentageCalculator />} />
            <Route path="math/percentage-change-calculator"  element={<PercentageChange />} />
            <Route path="math/fraction-to-decimal-calculator" element={<FractionToDecimal />} />

            {/* ── Misc ── */}
            <Route path="misc/cubic-yards-calculator"         element={<CubicYards />} />
            <Route path="misc/age-calculator"                element={<AgeCalculator />} />

            {/* ── Cooking ── */}
            <Route path="cooking/cooking-converter"           element={<CookingConverter />} />

            {/* ── Health ── */}
            <Route path="health/bmi-bmr"                     element={<BmiBmr />} />
            <Route path="health/bmi-calculator"              element={<BmiCalculator />} />
            <Route path="health/bmr-calculator"              element={<BmrCalculator />} />
            <Route path="health/body-fat-calculator"         element={<BodyFat />} />
            <Route path="health/pregnancy-calculator"        element={<PregnancyCalculator />} />
            <Route path="health/calorie-deficit-calculator"  element={<CalorieDeficit />} />

            {/* ── Convert ── */}
            <Route path="convert/length-weight"              element={<LengthWeight />} />
            <Route path="convert/weight-converter"           element={<WeightConverter />} />
            <Route path="convert/length-converter"           element={<LengthConverter />} />

            {/* Catch-all */}
            <Route path="*" element={<ComingSoon />} />
          </Route>
        </Routes>
      </CalculatorRegistryProvider>
    </ThemeProvider>
  );
}
