# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test.playwright.js >> shows setup screen when Firebase config missing
- Location: test.playwright.js:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h2:has-text("Setup Required")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('h2:has-text("Setup Required")') with timeout 5000ms
  - waiting for locator('h2:has-text("Setup Required")')

```

```yaml
- banner:
  - link "ConvertHub Home":
    - /url: /
    - img
    - text: ConvertHub
  - img
  - searchbox "Search calculators"
  - button "Switch to dark mode":
    - img
- complementary:
  - text: Categories
  - button "Collapse sidebar":
    - img
  - button "Sign In":
    - img
    - text: Sign In
  - text: Categories
  - navigation:
    - link "Finance 11":
      - /url: /finance
      - img
      - text: Finance 11
      - img
    - link "Math 4":
      - /url: /math
      - img
      - text: Math 4
      - img
    - link "Time 3":
      - /url: /time
      - img
      - text: Time 3
      - img
    - link "Health 7":
      - /url: /health
      - img
      - text: Health 7
      - img
    - link "Cooking 1":
      - /url: /cooking
      - img
      - text: Cooking 1
      - img
    - link "Unit Conversions 4":
      - /url: /convert
      - img
      - text: Unit Conversions 4
      - img
    - link "Tech 2":
      - /url: /tech
      - img
      - text: Tech 2
      - img
    - link "Everyday Tools 0":
      - /url: /misc
      - img
      - text: Everyday Tools 0
      - img
- main:
  - heading "Universal Calculator Suite" [level=1]
  - paragraph: Free, fast, and accurate calculators for finance, health, cooking, math, and unit conversions — all in one place.
  - img
  - link "Finance":
    - /url: /finance
  - paragraph: Financial calculators for investments, loans, savings, and compound growth.
  - list:
    - listitem:
      - link "Compound Interest Calculator":
        - /url: /finance/compound-interest
    - listitem:
      - link "Savings Calculator":
        - /url: /finance/savings-calculator
    - listitem:
      - link "Simple Interest Calculator":
        - /url: /finance/simple-interest-calculator
    - listitem:
      - link "Loan Calculator":
        - /url: /finance/loan-calculator
    - listitem:
      - link "APR Calculator":
        - /url: /finance/apr-calculator
    - listitem:
      - link "SIP Calculator":
        - /url: /finance/sip-calculator
    - listitem:
      - link "Lumpsum Calculator":
        - /url: /finance/lumpsum-calculator
    - listitem:
      - link "GST Calculator":
        - /url: /finance/gst-calculator
    - listitem:
      - link "Tip / Split Bill Calculator":
        - /url: /finance/tip-calculator
    - listitem:
      - link "Discount & Sales Tax Calculator":
        - /url: /finance/discount-calculator
    - listitem:
      - link "Inflation Calculator":
        - /url: /finance/inflation-calculator
  - img
  - link "Math":
    - /url: /math
  - paragraph: Core mathematical utilities including percentages, ratios, and number operations.
  - list:
    - listitem:
      - link "Percentage Calculator":
        - /url: /math/percentage-calculator
    - listitem:
      - link "Percentage Change Calculator":
        - /url: /math/percentage-change-calculator
    - listitem:
      - link "Fraction to Decimal Calculator":
        - /url: /math/fraction-to-decimal-calculator
    - listitem:
      - link "Numbers to Words Converter":
        - /url: /math/numbers-to-words-converter
  - img
  - link "Time":
    - /url: /time
  - paragraph: Date and time calculators for age, dates, and time calculations.
  - list:
    - listitem:
      - link "Age Calculator":
        - /url: /time/age-calculator
    - listitem:
      - link "Date / Time Calculator":
        - /url: /time/date-calculator
    - listitem:
      - link "Time Zone Calculator":
        - /url: /time/time-zone-calculator
  - img
  - link "Cooking":
    - /url: /cooking
  - paragraph: Kitchen measurement conversion tools with ingredient-specific density adjustments.
  - list:
    - listitem:
      - link "Cooking Converter":
        - /url: /cooking/cooking-converter
  - img
  - link "Health":
    - /url: /health
  - paragraph: Health metrics calculators including BMI, BMR, TDEE, and fitness tracking.
  - list:
    - listitem:
      - link "BMI & BMR Calculator":
        - /url: /health/bmi-bmr
    - listitem:
      - link "BMI Calculator":
        - /url: /health/bmi-calculator
    - listitem:
      - link "BMR Calculator":
        - /url: /health/bmr-calculator
    - listitem:
      - link "Body Fat Calculator":
        - /url: /health/body-fat-calculator
    - listitem:
      - link "Pregnancy Calculator":
        - /url: /health/pregnancy-calculator
    - listitem:
      - link "Calorie Deficit Calculator":
        - /url: /health/calorie-deficit-calculator
    - listitem:
      - link "Calorie / TDEE Calculator":
        - /url: /health/tdee-calculator
    - listitem:
      - link "Water Intake Calculator":
        - /url: /health/water-intake-calculator
  - img
  - link "Unit Conversions":
    - /url: /convert
  - paragraph: Convert between units of length, weight, temperature, volume, and more.
  - list:
    - listitem:
      - link "Cubic Yards Calculator":
        - /url: /misc/cubic-yards-calculator
    - listitem:
      - link "Length & Weight Converter":
        - /url: /convert/length-weight
    - listitem:
      - link "Weight & Mass Converter":
        - /url: /convert/weight-converter
    - listitem:
      - link "Length & Distance Converter":
        - /url: /convert/length-converter
  - img
  - link "Everyday Tools":
    - /url: /misc
  - paragraph: Practical everyday calculators for construction, materials, and general use.
  - list
  - img
  - link "Tech":
    - /url: /tech
  - paragraph: Developer and designer tools for aspect ratios, data conversions, and more.
  - list:
    - listitem:
      - link "Aspect Ratio Calculator":
        - /url: /tech/aspect-ratio-calculator
    - listitem:
      - link "Byte / Data Converter":
        - /url: /tech/byte-converter
- contentinfo:
  - img
  - text: ConvertHub
  - paragraph: Free online calculators for finance, health, cooking, math, and unit conversions. Fast, accurate, and privacy-friendly.
  - heading "Categories" [level=4]
  - list:
    - listitem:
      - link "finance":
        - /url: /finance
    - listitem:
      - link "math":
        - /url: /math
    - listitem:
      - link "cooking":
        - /url: /cooking
    - listitem:
      - link "health":
        - /url: /health
    - listitem:
      - link "convert":
        - /url: /convert
  - heading "Legal" [level=4]
  - list:
    - listitem:
      - link "Privacy Policy":
        - /url: "#"
    - listitem:
      - link "Terms of Use":
        - /url: "#"
    - listitem:
      - link "Disclaimer":
        - /url: "#"
  - text: © 2026 ConvertHub. All rights reserved. Results are for informational purposes only.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('shows setup screen when Firebase config missing', async ({ page }) => {
  4  |   await page.goto('http://localhost:5173/');
  5  | 
  6  |   // Wait for the setup screen to appear
> 7  |   await expect(page.locator('h2:has-text("Setup Required")')).toBeVisible({ timeout: 5000 });
     |                                                               ^ Error: expect(locator).toBeVisible() failed
  8  | 
  9  |   // Verify setup instructions are visible
  10 |   await expect(page.locator('text=Firebase configuration is missing')).toBeVisible();
  11 |   await expect(page.locator('text=Firebase Console')).toBeVisible();
  12 | 
  13 |   console.log('✓ Setup screen displayed correctly');
  14 | });
  15 | 
  16 | test('Dashboard loads quickly after login', async ({ page, context }) => {
  17 |   const navigationStartTime = Date.now();
  18 | 
  19 |   // Navigate to the app
  20 |   await page.goto('http://localhost:5173/');
  21 | 
  22 |   // Wait for app to fully load
  23 |   await page.waitForLoadState('networkidle');
  24 |   const appLoadTime = Date.now() - navigationStartTime;
  25 |   console.log(`✓ App load time: ${appLoadTime}ms`);
  26 | 
  27 |   // Dashboard should be visible if user is logged in
  28 |   // Check for dashboard content (header with user greeting)
  29 |   const dashboardVisible = await Promise.race([
  30 |     page.waitForSelector('h1', { timeout: 5000 }).then(() => true).catch(() => false),
  31 |   ]);
  32 | 
  33 |   const totalLoadTime = Date.now() - navigationStartTime;
  34 |   console.log(`✓ Dashboard visible: ${dashboardVisible}, Total load: ${totalLoadTime}ms`);
  35 | });
  36 | 
  37 | test('Dashboard Firestore reads performance', async ({ page }) => {
  38 |   // This test measures the actual performance of Firestore calls
  39 |   // by instrumenting the page
  40 | 
  41 |   await page.addInitScript(() => {
  42 |     window.firebaseMetrics = {
  43 |       docReads: [],
  44 |       collectionReads: []
  45 |     };
  46 |   });
  47 | 
  48 |   await page.goto('http://localhost:5173/');
  49 | 
  50 |   // Wait for network idle to ensure all reads are done
  51 |   await page.waitForLoadState('networkidle');
  52 | 
  53 |   // Try to measure how long Firestore operations took
  54 |   const readTime = await page.evaluate(() => {
  55 |     const startMark = performance.getEntriesByName('navigationStart')[0];
  56 |     const lastResource = performance.getEntriesByType('resource').pop();
  57 |     if (lastResource && startMark) {
  58 |       return lastResource.responseEnd - startMark.startTime;
  59 |     }
  60 |     return 0;
  61 |   });
  62 | 
  63 |   console.log(`Page interactive time from start: ${readTime}ms`);
  64 | 
  65 |   // Measure time to First Contentful Paint
  66 |   const paintEntries = await page.evaluate(() => {
  67 |     return performance.getEntriesByType('paint');
  68 |   });
  69 | 
  70 |   console.log('Paint entries:', JSON.stringify(paintEntries, null, 2));
  71 | });
  72 | 
```