// On-page explanatory copy for each calculator, keyed by registry id.
// Shown under the calculator by components/layout/CalculatorInfo.jsx.
export const LAST_REVIEWED = "2026-11-16";

export const CATEGORY_INTRO = {
  finance: "Compare savings growth, loan payments, investment returns, GST and everyday money math. Every result is an estimate built from the numbers you enter.",
  math: "Quick, reliable tools for percentages, fractions and number formatting, useful for homework, shopping and work.",
  time: "Work out exact ages, date differences and time zone conversions, including daylight saving effects.",
  cooking: "Convert kitchen measurements, with ingredient-specific density so cups of flour and cups of sugar come out right.",
  health: "Estimate BMI, BMR, TDEE, body fat, calorie targets, pregnancy dates and daily water needs. These are general estimates, not medical advice.",
  convert: "Convert lengths, weights and volumes between metric and imperial units using exact definitions.",
  tech: "Developer and designer helpers for aspect ratios and digital storage sizes.",
  misc: "Everyday tools for estimating materials, such as how much concrete, soil or mulch a project needs. More practical calculators are planned.",
};

// Financial and health results get a visible disclaimer.
export const CATEGORY_DISCLAIMER = {
  finance: "Results are estimates only and are not financial advice. Rates, fees and taxes change; check with a qualified adviser before making decisions.",
  health: "Results are estimates only and are not medical advice. Speak with a doctor or registered dietitian before changing diet, exercise or treatment.",
};

// Short "how it works" summary and two FAQs per calculator.
export const CALCULATOR_CONTENT = {
  "compound-interest": {
    summary: "Shows how an investment grows when interest is earned on both the original amount and past interest. The calculator uses A = P(1 + r/n)^(nt), and adds the annuity term when you include regular deposits.",
    faq: [
      { q: "How often is interest compounded?", a: "More frequent compounding, such as monthly instead of yearly, makes the balance grow slightly faster at the same annual rate, because interest starts earning interest sooner." },
      { q: "What is the effective annual rate (APY)?", a: "APY = (1 + r/n)^n − 1. It is the real yearly return after compounding, and it is usually higher than the stated rate." },
    ],
  },
  "savings-calculator": {
    summary: "Projects a savings balance from an initial deposit, regular contributions, an interest rate and a compounding frequency. The result is the balance before any taxes, bank fees or inflation.",
    faq: [
      { q: "Does the result include taxes or fees?", a: "No. The projection shows gross growth. Interest tax, account fees and inflation reduce what you actually keep." },
      { q: "Why does compounding frequency matter?", a: "Interest added more often starts earning interest sooner, so the same nominal rate produces a slightly larger balance." },
    ],
  },
  "simple-interest-calculator": {
    summary: "Calculates interest on the original principal only, using I = P × r × t, and the total amount A = P(1 + rt). Enter the time in years.",
    faq: [
      { q: "When is simple interest used?", a: "Some short-term loans and promissory notes use simple interest. Most savings accounts and investments compound." },
      { q: "How do I enter a period in months?", a: "Divide the number of months by 12. Six months is 0.5 years." },
    ],
  },
  "loan-calculator": {
    summary: "Estimates a fixed monthly payment with the standard amortization formula PMT = P × r ÷ (1 − (1 + r)^−n), and shows the total interest paid over the term.",
    faq: [
      { q: "Why is most of my early payment interest?", a: "Each payment covers the interest on the remaining balance first. Early payments are mostly interest, and the principal share grows over the term." },
      { q: "Does the payment include insurance or fees?", a: "No. Taxes, insurance, origination fees and mortgage insurance are not included unless you add them to the amount you borrow or to your budget." },
    ],
  },
  "apr-calculator": {
    summary: "Turns an interest rate plus upfront fees into an annual percentage rate (APR), so loans with different fee structures can be compared on one basis.",
    faq: [
      { q: "How is APR different from the interest rate?", a: "The interest rate is the cost of borrowing alone. APR spreads certain fees over the loan term, so it is usually higher." },
      { q: "Is APR the same as APY?", a: "No. APR is an annual rate without compounding. APY includes the effect of compounding." },
    ],
  },
  "sip-calculator": {
    summary: "Estimates the value of a Systematic Investment Plan, where a fixed amount is invested every month at an assumed annual return. It uses M = P × [((1 + i)^n − 1) ÷ i] × (1 + i), with i as the monthly rate.",
    faq: [
      { q: "Are SIP returns guaranteed?", a: "No. Market returns vary. The calculator uses the return rate you enter, which is only an assumption." },
      { q: "Why does the time horizon matter so much?", a: "Money invested for longer has more time to compound, so a longer horizon usually matters more than the size of each monthly investment." },
    ],
  },
  "lumpsum-calculator": {
    summary: "Projects the growth of a one-time investment with A = P × (1 + r)^t, the value after t years at an annual return of r.",
    faq: [
      { q: "How is a lump sum different from a SIP?", a: "A lump sum is invested once at the start. A SIP spreads investments over time, which reduces the risk of investing everything at one price level." },
      { q: "Does the result account for inflation?", a: "No. Use the inflation calculator to see what the future amount is worth in today's money." },
    ],
  },
  "gst-calculator": {
    summary: "Adds or removes India's Goods and Services Tax (GST) across the 0.25%, 3%, 5%, 12%, 18% and 28% slabs. Adding GST: GST = price × rate. Removing it from a total: original price = total ÷ (1 + rate).",
    faq: [
      { q: "What are the GST slabs?", a: "India's GST has six rates: 0.25%, 3%, 5%, 12%, 18% and 28%. The slab that applies depends on the product or service." },
      { q: "How do I remove GST from a total?", a: "Divide the total by (1 + GST rate). For example, ₹11,800 including 18% GST has a pre-tax price of ₹10,000." },
    ],
  },
  "tip-calculator": {
    summary: "Works out a tip as a percentage of the bill and splits the total between people. Tip = bill × tip% ÷ 100.",
    faq: [
      { q: "What is a typical tip?", a: "Customs differ by country. In the United States, sit-down restaurant service is commonly tipped around 15 to 20 percent." },
      { q: "How is the bill split between people?", a: "The total, including the tip, is divided by the number of people paying." },
    ],
  },
  "discount-calculator": {
    summary: "Shows the sale price after a percentage discount, the amount saved, and tax when you enter a tax rate. Discounted price = price − price × discount ÷ 100.",
    faq: [
      { q: "Is tax applied before or after the discount?", a: "The breakdown applies the tax rate to the original price. Local rules differ, so check how tax is charged where you shop." },
      { q: "How do I work out a discount percentage?", a: "Divide the amount saved by the original price, then multiply by 100." },
    ],
  },
  "inflation-calculator": {
    summary: "Shows how inflation changes purchasing power. Future value FV = PV × (1 + r)^t, and present value PV = FV ÷ (1 + r)^t, where r is the inflation rate and t the number of years.",
    faq: [
      { q: "What inflation rate should I use?", a: "Use a long-term average or the current official rate for your country. Historical rates vary a lot by country and period." },
      { q: "What does the result mean?", a: "It shows what an amount today will be worth in future money, or what a future amount is worth in today's money." },
    ],
  },
  "percentage-calculator": {
    summary: "Solves common percentage questions: what P% of X is, what percentage X is of Y, and how a value increases or decreases by P%. The core formula is (P ÷ 100) × X.",
    faq: [
      { q: "How do I find what percent one number is of another?", a: "Divide the part by the whole and multiply by 100. For example, 25 is 20% of 125 (25 ÷ 125 × 100)." },
      { q: "How do I calculate an increase?", a: "Multiply the original value by (1 + P ÷ 100). An 80 increased by 25% is 100." },
    ],
  },
  "percentage-change-calculator": {
    summary: "Finds the percentage change between an old and a new value: (new − old) ÷ old × 100. A positive result is an increase and a negative result is a decrease.",
    faq: [
      { q: "Why doesn't a 50% fall followed by a 50% rise return to the start?", a: "Each percentage applies to a different base. 100 falls 50% to 50, then rises 50% to 75, not back to 100." },
      { q: "What if the starting value is zero?", a: "The percentage change is undefined when the old value is zero, because the calculation divides by zero." },
    ],
  },
  "fraction-to-decimal-calculator": {
    summary: "Converts a fraction into a decimal and a percentage by dividing the numerator by the denominator, and shows whether the decimal ends or repeats.",
    faq: [
      { q: "How do I know if a decimal repeats?", a: "A fraction in lowest terms gives a terminating decimal only when its denominator has no prime factors other than 2 and 5. So 1/8 = 0.125 terminates, while 1/3 = 0.333… repeats." },
      { q: "How do I convert a mixed number?", a: "Convert the fraction part to a decimal and add the whole number. For example, 2 1/4 = 2 + 0.25 = 2.25." },
    ],
  },
  "numbers-to-words-converter": {
    summary: "Converts a number into English words, for example 1,234 becomes “one thousand two hundred thirty-four”. Useful for cheques, invoices and formal documents.",
    faq: [
      { q: "How are large numbers named?", a: "Words use the standard English names: thousand, million, billion and so on." },
      { q: "Should I check the output before using it on a cheque?", a: "Yes. Check your bank's wording rules for cheques and legal documents before relying on the output." },
    ],
  },
  "age-calculator": {
    summary: "Calculates exact age in years, months and days from a birth date, and shows how many days remain until the next birthday.",
    faq: [
      { q: "Are leap years included?", a: "Yes. Age is counted from the actual calendar dates, so leap days are included in the total day count." },
      { q: "What is the age in days?", a: "It is the number of days from the birth date to today, which is useful for milestones and some official forms." },
    ],
  },
  "date-calculator": {
    summary: "Finds the number of days between two dates, or adds and subtracts days, weeks, months and years from a starting date.",
    faq: [
      { q: "Does the day count include the end date?", a: "The difference counts the days between the two dates. Add 1 if you need an inclusive count that includes both the start and end dates." },
      { q: "Why can adding months give an unexpected date?", a: "A date such as 31 January may not exist in a shorter month, so the result depends on the calendar. Check month-end results before relying on them." },
    ],
  },
  "time-zone-calculator": {
    summary: "Converts a time from one time zone to another and shows the offset for the date you choose, including daylight saving time changes.",
    faq: [
      { q: "Why does the gap between two zones change during the year?", a: "Many regions start and end daylight saving time on different dates, so the difference can change for part of the year." },
      { q: "Does the result depend on the date?", a: "Yes. Daylight saving rules differ by region, so the offset is calculated for the date you enter." },
    ],
  },
  "cooking-converter": {
    summary: "Converts kitchen measures between cups, tablespoons, teaspoons, millilitres and grams. Choose an ingredient to apply its density, because volume and weight do not match across ingredients.",
    faq: [
      { q: "Why does the ingredient matter?", a: "Cups measure volume and grams measure weight. Flour, sugar and butter have different densities, so one cup of each weighs a different amount." },
      { q: "Is a cup always 240 ml?", a: "No. A US customary cup is 236.6 ml, and a metric cup is 250 ml in some countries. Use the cup standard your recipe was written for." },
    ],
  },
  "bmi-bmr": {
    summary: "Shows your Body Mass Index (BMI) and an estimate of your basal metabolic rate (BMR) in one place. BMI = weight (kg) ÷ height (m)². BMR uses the Mifflin–St Jeor equation.",
    faq: [
      { q: "What do the BMI ranges mean?", a: "For adults, WHO categories are: under 18.5 underweight, 18.5 to 24.9 healthy range, 25 to 29.9 overweight, and 30 or more obese. BMI does not measure body fat directly." },
      { q: "What is BMR?", a: "BMR is the number of calories your body uses at rest to keep vital functions running. Activity adds to it, which is why total daily energy use is higher." },
    ],
  },
  "bmi-calculator": {
    summary: "Calculates Body Mass Index from weight and height in metric or imperial units, and shows the weight range that falls within the healthy BMI band (18.5 to 24.9) for your height.",
    faq: [
      { q: "Is BMI accurate for athletes?", a: "Not always. BMI can overstate body fat in people with high muscle mass. Treat it as a screening measure, not a diagnosis." },
      { q: "How is imperial BMI calculated?", a: "BMI = 703 × weight (lb) ÷ height (in)²." },
    ],
  },
  "bmr-calculator": {
    summary: "Estimates basal metabolic rate with the Mifflin–St Jeor equation (recommended) or the Harris–Benedict equations, and shows calorie targets for common goals.",
    faq: [
      { q: "Which equation should I use?", a: "Mifflin–St Jeor is the recommended default because it is generally the most accurate of the commonly used equations. Estimates still vary between individuals." },
      { q: "Is it safe to eat only my BMR?", a: "Eating far below your BMR for long periods is not advised. Speak with a clinician or dietitian before a large calorie deficit." },
    ],
  },
  "body-fat-calculator": {
    summary: "Estimates body fat percentage from height, neck, waist and, for women, hip measurements, using the US Navy circumference method.",
    faq: [
      { q: "What is the Navy body fat formula?", a: "The US Navy method estimates body fat from circumference measurements instead of skinfold calipers or water displacement. It is a practical estimate, not a lab measurement." },
      { q: "How accurate are circumference estimates?", a: "They are useful for tracking trends over time when you measure the same way each time. Individual readings can differ from DEXA or hydrostatic tests by several percentage points." },
    ],
  },
  "pregnancy-calculator": {
    summary: "Estimates a due date from the first day of your last menstrual period using Naegele's Rule (add 280 days), and can work from a conception date instead.",
    faq: [
      { q: "How accurate is the due date?", a: "It is an estimate. Only a small share of babies arrive on the exact due date, and most arrive within a few weeks either side of it." },
      { q: "What if my cycle is not 28 days?", a: "Naegele's Rule assumes a 28-day cycle. Longer or shorter cycles shift the estimate, so an ultrasound is the more reliable way to date a pregnancy." },
    ],
  },
  "calorie-deficit-calculator": {
    summary: "Estimates a daily calorie target for weight loss or gain, based on your total daily energy expenditure (TDEE) and a chosen deficit or surplus. It uses the common rule of thumb of about 3,500 kcal per pound of fat, or 7,700 kcal per kilogram.",
    faq: [
      { q: "Is the 3,500 kcal rule exact?", a: "It is a simplification. Metabolism adapts as weight changes, so actual weight loss often slows over time. Use the target as a starting point and adjust based on several weeks of data." },
      { q: "How fast is a safe rate of loss?", a: "Many health organisations suggest around 0.5 to 1 kg (1 to 2 lb) per week for most adults. Ask a clinician before a faster plan." },
    ],
  },
  "tdee-calculator": {
    summary: "Estimates total daily energy expenditure (TDEE) by multiplying BMR by an activity factor: 1.2 sedentary, 1.375 lightly active, 1.55 moderately active, 1.725 very active and 1.9 extra active.",
    faq: [
      { q: "Are activity factors exact?", a: "No. They are typical multipliers. Use the result as a starting point and adjust based on your weight trend over a few weeks." },
      { q: "Which activity level should I pick?", a: "Choose the level that matches your typical week, not your best week. If unsure, pick the lower level and adjust from there." },
    ],
  },
  "water-intake-calculator": {
    summary: "Estimates a daily water target from your body weight, activity level, climate and exercise time. It is a guide, not a fixed requirement.",
    faq: [
      { q: "Does food count toward water intake?", a: "Yes. Fruit, vegetables, soup and other foods contribute, so total fluid needs can be met partly from food." },
      { q: "Do I need more water when I exercise?", a: "Yes. Sweat losses increase fluid needs, so drink before, during and after activity. Adjust the exercise time input to see the effect." },
    ],
  },
  "length-weight": {
    summary: "Converts length and weight units side by side, such as metres to feet and kilograms to pounds, using exact international definitions.",
    faq: [
      { q: "How many kilograms is a pound?", a: "One international pound is defined as exactly 0.45359237 kg." },
      { q: "How many centimetres is an inch?", a: "One inch is defined as exactly 2.54 cm." },
    ],
  },
  "weight-converter": {
    summary: "Converts weight between kilograms, pounds, ounces, stones and grams.",
    faq: [
      { q: "How many grams are in an ounce?", a: "One avoirdupois ounce is 28.3495 grams." },
      { q: "What is a stone?", a: "A stone is 14 pounds, about 6.35 kg. It is still commonly used for body weight in the UK and Ireland." },
    ],
  },
  "length-converter": {
    summary: "Converts length between metric and imperial units, including metres, feet, inches, centimetres, kilometres and miles.",
    faq: [
      { q: "How many feet are in a metre?", a: "About 3.28084 feet. One metre is exactly 100 ÷ 2.54 ÷ 12 feet." },
      { q: "How many kilometres is a mile?", a: "One international mile is defined as exactly 1.609344 km." },
    ],
  },
  "cubic-yards-calculator": {
    summary: "Calculates the volume in cubic yards for concrete, soil, mulch or gravel from length, width and depth. The formula is length × width × depth in feet, divided by 27.",
    faq: [
      { q: "How do I convert cubic feet to cubic yards?", a: "Divide the cubic feet by 27, because one cubic yard is 27 cubic feet." },
      { q: "Should I order extra material?", a: "Many people add 5 to 10 percent for compaction, spillage and uneven ground, so the job does not run short." },
    ],
  },
  "aspect-ratio-calculator": {
    summary: "Calculates an aspect ratio, and the new width or height that keeps the proportions of an image or screen the same.",
    faq: [
      { q: "What does 16:9 mean?", a: "It is the standard widescreen ratio used by most HD and 4K video. 1920 × 1080 is 16:9." },
      { q: "How do I resize without distorting an image?", a: "Keep the ratio by setting new height = new width × (original height ÷ original width)." },
    ],
  },
  "byte-converter": {
    summary: "Converts digital storage sizes between bytes, KB, MB, GB and TB, in decimal units (1 KB = 1,000 bytes) or binary units (1 KiB = 1,024 bytes).",
    faq: [
      { q: "What is the difference between KB and KiB?", a: "KB is 1,000 bytes in decimal units. KiB is 1,024 bytes in binary units. Drive makers usually advertise decimal capacity, while many operating systems report binary sizes." },
      { q: "Why does my drive show less space than advertised?", a: "The capacity is the same, but it is counted in decimal units on the box and in binary units by the operating system, so the reported number looks smaller." },
    ],
  },
};
