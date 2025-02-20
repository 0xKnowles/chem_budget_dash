# Spray Application Dashboard

A modern, responsive dashboard for tracking chemical applications and budget management in agricultural or industrial settings. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 📊 Real-time budget tracking and analysis
- 📈 Visual data representation with charts and graphs
- 📱 Fully responsive design
- 📅 Monthly data organization
- 🔄 Dynamic data updates
- 📊 Chemical usage tracking
- 💰 Budget monitoring with visual alerts

## Excel Template Guide

### Download Template
We strongly recommend using our template file to ensure proper data formatting. You can locate it in the projects public folder: [Spray_Budget_Template.xlsx]

### Sheet Organization

1. **Monthly Sheets**
   - Create a separate sheet for each month
   - Name sheets exactly as months (e.g., "January", "February")
   - Don't use abbreviations or year numbers in sheet names

2. **Required Headers (Row 1)**
    - A: Spray Chem 1 | B: Spray Chem 2 | C: Spray Chem 3 | D: Fog Chem 1 | E: Fog Chem 2 | F: Fog Chem 3 | G: Date | H: Bays | I: Price | J: Monthly Budget | K: Month

### Data Entry Guide

#### Correct Format Example:
![Dashboard Preview](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20250219-210736-4lWkBXNGQm6AYy8l1CC2ZPuwCjeJ4Y.png)


#### Formatting Rules

1. **Chemical Names**
   - Enter exact chemical names as they appear in your records
   - Leave cells empty for unused chemicals
   - ✅ Correct: `Purespray`
   - ❌ Incorrect: `Pure spray`, `PURESPRAY`, `purespray`

2. **Dates**
   - Use Week-Day format (W-D)
   - Week range: 1-52
   - Day range: 1-7
   - ✅ Correct: `5-7`, `12-3`, `45-6`
   - ❌ Incorrect: `5/7`, `Week 5 Day 7`, `5-8`

3. **Bays**
   - Enter only numbers
   - Must be whole numbers
   - ✅ Correct: `11`, `6`, `14`
   - ❌ Incorrect: `11.5`, `6 bays`, `~12`

4. **Price**
   - Enter numbers only
   - Can include decimals
   - Do not include currency symbols
   - ✅ Correct: `446.00`, `23.65`, `1990.76`
   - ❌ Incorrect: `$446.00`, `446.00$`, `446,00`

5. **Monthly Budget**
   - Enter numbers only
   - Must be consistent within each month
   - Do not include currency symbols
   - ✅ Correct: `13875.00`
   - ❌ Incorrect: `$13,875.00`, `13.8K`

6. **Month**
   - Use three-letter abbreviation
   - Must match sheet name
   - ✅ Correct: `Feb`, `Mar`, `Apr`
   - ❌ Incorrect: `February`, `Feb.`, `02`

## Installation and Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/0xKnowles/spray-application-dashboard.git
cd spray-application-dashboard
