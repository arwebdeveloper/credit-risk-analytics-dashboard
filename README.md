# Credit Risk Analytics Dashboard

A comprehensive dashboard for credit risk analytics, providing visual insights into customer financial health, risk scores, and workflow management for risk officers.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Frontend Setup
1. Clone the repository
   \`\`\`
   git clone https://github.com/arwebdeveloper/credit-risk-analytics-dashboard.git
   cd credit-risk-analytics-dashboard
   \`\`\`

2. Install dependencies
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env` file in the root directory with the following content:
   \`\`\`
   VITE_API_URL = "http://localhost:8080/api"
   \`\`\`

4. Start the development server
   \`\`\`
   npm run dev
   \`\`\`

## Tech Stack

- React with TypeScript
- Vite for build tooling
- React Router for navigation
- Axios for API requests
- Ant Design for UI components
- Recharts for data visualization

## Risk Scoring Explanation

The risk assessment algorithm calculates a risk score (0-100) for each customer based on three key factors:

1. **Credit Score (40%)**: 
   - 750+ → 40 points
   - 700-749 → 35 points
   - 650-699 → 25 points
   - 600-649 → 15 points
   - Below 600 → 5 points

2. **Loan Repayment History (30%)**:
   - Percentage of successful payments × 30

3. **Outstanding Loans to Income Ratio (30%)**:
   - Ratio ≤ 0.2 → 30 points
   - Ratio ≤ 0.4 → 25 points
   - Ratio ≤ 0.6 → 15 points
   - Ratio ≤ 0.8 → 10 points
   - Ratio > 0.8 → 0 points

The final risk score is calculated as: 100 - (Credit Score Component + Repayment Component + Ratio Component)

Risk levels are categorized as:
- Low Risk: 0-29
- Medium Risk: 30-59
- High Risk: 60-100

## AI Tool Usage

This project was developed with the assistance of the following AI tools:

1. **Codium**: Used for code completion and suggestions, particularly for:
   - TypeScript type definitions
   - Ant Design component implementation

2. **ChatGPT**: Used for:
   - Risk scoring algorithm design
   - API endpoint structure
   - Code optimization suggestions


## Bonus Features Implemented
- Dark mode toggle
- Responsive mobile view
- Advanced filters/search in tables
- Alert system for high-risk customers

