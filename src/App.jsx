import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firebaseConfigMissing } from "./utils/firebase";
import { ThemeProvider } from "./context/ThemeContext";
import { CalculatorRegistryProvider } from "./context/CalculatorRegistryContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CategoryHub from "./pages/CategoryHub";
import ComingSoon from "./pages/ComingSoon";
import SignInPage from "./components/auth/SignInPage";

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
import TipCalculator        from "./pages/finance/TipCalculator";
import DiscountCalculator   from "./pages/finance/DiscountCalculator";

// Math
import PercentageCalculator from "./pages/math/PercentageCalculator";
import PercentageChange     from "./pages/math/PercentageChange";
import FractionToDecimal    from "./pages/math/FractionToDecimal";
import NumbersToWords       from "./pages/math/NumbersToWords";

// Time
import AgeCalculator        from "./pages/misc/AgeCalculator";
import DateCalculator       from "./pages/misc/DateCalculator";
import TimeZoneCalculator   from "./pages/time/TimeZoneCalculator";

// Misc
import CubicYards           from "./pages/misc/CubicYards";

// Health
import BmiBmr               from "./pages/health/BmiBmr";
import BmiCalculator        from "./pages/health/BmiCalculator";
import BmrCalculator        from "./pages/health/BmrCalculator";
import BodyFat              from "./pages/health/BodyFat";
import PregnancyCalculator  from "./pages/health/PregnancyCalculator";
import CalorieDeficit       from "./pages/health/CalorieDeficit";
import TdeeCalculator       from "./pages/health/TdeeCalculator";
import WaterIntake          from "./pages/health/WaterIntake";

// Cooking
import CookingConverter     from "./pages/cooking/CookingConverter";

// Tech
import AspectRatio          from "./pages/tech/AspectRatio";
import ByteConverter        from "./pages/tech/ByteConverter";

// Convert
import LengthWeight         from "./pages/convert/LengthWeight";
import WeightConverter      from "./pages/convert/WeightConverter";
import LengthConverter      from "./pages/convert/LengthConverter";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (firebaseConfigMissing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Setup Required</h2>
          <p className="text-gray-700 mb-4">Firebase configuration is missing.</p>
          <ol className="text-left text-sm text-gray-600 mb-6 space-y-2">
            <li>1. Go to <a href="https://console.firebase.google.com/u/0/project/converthub-e659b/settings/general" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Firebase Console</a></li>
            <li>2. Copy the Web App config</li>
            <li>3. Create <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file</li>
            <li>4. Add: <code className="bg-gray-100 px-2 py-1 rounded">VITE_FIREBASE_API_KEY=...</code> etc</li>
            <li>5. Restart dev server</li>
          </ol>
          <p className="text-xs text-gray-500">See <code className="bg-gray-100 px-2">.env.example</code> for template</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return <SignInPage onSignIn={setUser} />;

  return (
    <ThemeProvider>
      <CalculatorRegistryProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={user ? <Dashboard user={user} onSignOut={handleSignOut} /> : <Home />} />

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
            <Route path="finance/tip-calculator"              element={<TipCalculator />} />
            <Route path="finance/discount-calculator"         element={<DiscountCalculator />} />

            {/* ── Math ── */}
            <Route path="math/percentage-calculator"          element={<PercentageCalculator />} />
            <Route path="math/percentage-change-calculator"  element={<PercentageChange />} />
            <Route path="math/fraction-to-decimal-calculator" element={<FractionToDecimal />} />
            <Route path="math/numbers-to-words-converter"     element={<NumbersToWords />} />

            {/* ── Time ── */}
            <Route path="time/age-calculator"                element={<AgeCalculator />} />
            <Route path="time/date-calculator"               element={<DateCalculator />} />
            <Route path="time/time-zone-calculator"          element={<TimeZoneCalculator />} />

            {/* ── Misc ── */}
            <Route path="misc/cubic-yards-calculator"         element={<CubicYards />} />

            {/* ── Cooking ── */}
            <Route path="cooking/cooking-converter"           element={<CookingConverter />} />

            {/* ── Health ── */}
            <Route path="health/bmi-bmr"                     element={<BmiBmr />} />
            <Route path="health/bmi-calculator"              element={<BmiCalculator />} />
            <Route path="health/bmr-calculator"              element={<BmrCalculator />} />
            <Route path="health/body-fat-calculator"         element={<BodyFat />} />
            <Route path="health/pregnancy-calculator"        element={<PregnancyCalculator />} />
            <Route path="health/calorie-deficit-calculator"  element={<CalorieDeficit />} />
            <Route path="health/tdee-calculator"             element={<TdeeCalculator />} />
            <Route path="health/water-intake-calculator"     element={<WaterIntake />} />

            {/* ── Tech ── */}
            <Route path="tech/aspect-ratio-calculator"       element={<AspectRatio />} />
            <Route path="tech/byte-converter"                element={<ByteConverter />} />

            {/* ── Convert ── */}
            <Route path="convert/length-weight"              element={<LengthWeight />} />
            <Route path="convert/weight-converter"           element={<WeightConverter />} />
            <Route path="convert/length-converter"           element={<LengthConverter />} />

            {/* Catch-all */}
            <Route path="*" element={<ComingSoon />} />
          </Route>
        </Routes>
        <Analytics />
      </CalculatorRegistryProvider>
    </ThemeProvider>
  );
}
