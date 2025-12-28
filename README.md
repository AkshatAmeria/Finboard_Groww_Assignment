# FinBoard - Real-time Finance Dashboard

A modern, customizable finance dashboard that allows you to connect to any financial API and create widgets to monitor stocks, crypto, and market trends in real-time.

## Features

**Custom API Integration** - Connect to any financial API endpoint , 
**Multiple Display Modes** - Card, Table, and Chart views ,
**Auto-refresh** - Configurable refresh intervals for real-time data , 
**Field Mapping** - Select and map specific fields from API responses ,
**Drag & Drop** - Rearrange widgets with intuitive drag-and-drop ,
**Persistent Storage** - Widget configurations saved with Zustand ,
**Edit Widgets** - Modify widget settings anytime ,
**Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

- **React** with TypeScript
- **Zustand** for state management
- **React DnD** for drag-and-drop functionality
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **Vite** for fast development
- **Lucide React** for icons

## Project Structure

```
finboard/
├── src/
│   ├── components/
│   │   ├── AddWidgetModal.tsx    # Widget creation/editing modal
│   │   ├── JsonExplorer.tsx      # API response field explorer
│   │   ├── Navbar.tsx            # Top navigation bar
│   │   └── WidgetCard.tsx        # Individual widget component
│   ├── services/
│   │   └── api.ts                # API fetching service
│   ├── utils/
│   │   └── helpers.ts            # Utility functions
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # Application entry point
│   ├── store.ts                  # Zustand store
│   ├── types.ts                  # TypeScript interfaces
│   └── index.css                 # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Getting Started

### Requirements

- Node.js and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The built files will be in the `dist/` directory.

## Usage Guide

### Creating a Widget

1. Click the "Add Widget" button in the navbar or on the placeholder card
2. Enter a widget name (e.g., "Bitcoin Tracker")
3. Paste your API URL (must return JSON)
4. Click "Test" to fetch and explore the API response
5. Select fields from the JSON explorer that you want to display
6. Choose a display mode (Card, Table, or Chart)
7. Set the refresh interval
8. Click "Add Widget"

### Example APIs to Try

**Cryptocurrency (Coinbase)**
```
https://api.coinbase.com/v2/exchange-rates?currency=BTC
```

**Stock Market (Alpha Vantage - requires API key)**
```
https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=YOUR_KEY
```

**Exchange Rates**
```
https://api.exchangerate-api.com/v4/latest/USD
```

### Editing a Widget

1. Click the settings icon (⚙️) on any widget
2. Modify any configuration (name, API URL, fields, display mode, refresh interval)
3. Click "Update Widget" to save changes

### Rearranging Widgets

1. Click and hold the grip icon (⋮⋮) on any widget
2. Drag to your desired position
3. Release to drop

### Removing a Widget

Click the trash icon (🗑️) on any widget to remove it

## Display Modes

### Card Mode
Best for displaying 1-5 key metrics in a clean, focused layout. The first field is highlighted with a larger font.

### Table Mode
Perfect for displaying arrays of data or multiple related fields in rows. Shows up to 10 rows.

### Chart Mode
Ideal for tracking changes over time. Shows a line chart of the first selected field with historical data points.

## State Management with Zustand

The application uses Zustand for centralized state management with persistence:

- **Widget configurations** are automatically saved to localStorage
- **Data is restored** when you reload the page
- **Drag-and-drop order** is persisted

## API Response Format

Your API should return JSON in any format. The JsonExplorer will flatten nested objects and allow you to select specific fields.

Example supported structures:
```json
// Simple object
{
  "price": 50000,
  "volume": 1000000
}

// Nested object
{
  "data": {
    "rates": {
      "USD": 1.0,
      "EUR": 0.85
    }
  }
}

// Array response
{
  "items": [
    { "symbol": "BTC", "price": 50000 },
    { "symbol": "ETH", "price": 3000 }
  ]
}
```
---
