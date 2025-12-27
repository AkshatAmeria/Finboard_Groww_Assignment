# FinBoard - Setup & Implementation Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm, yarn, or pnpm package manager

### Installation Steps

1. **Navigate to the project directory:**
```bash
cd finboard-app
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or  
pnpm install
```

3. **Start the development server:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser:**
Navigate to `http://localhost:5173`

## 📁 Project Structure

```
finboard-app/
├── src/
│   ├── components/
│   │   ├── AddWidgetModal.tsx    # Modal for adding/editing widgets
│   │   ├── JsonExplorer.tsx      # JSON field selector
│   │   ├── Navbar.tsx            # Top navigation
│   │   └── WidgetCard.tsx        # Widget display component
│   ├── services/
│   │   └── api.ts                # API fetching logic
│   ├── utils/
│   │   └── helpers.ts            # Utility functions
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   ├── store.ts                  # Zustand state management
│   ├── types.ts                  # TypeScript types
│   └── index.css                 # Global styles
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript config
├── tailwind.config.js             # Tailwind CSS config
└── README.md                      # Documentation
```

## 🎯 Key Features Implemented

### 1. **Zustand State Management**
- Centralized state store in `src/store.ts`
- Persistent storage using localStorage
- Actions for add, remove, update, refresh, and reorder widgets

### 2. **Drag & Drop Functionality**
- Implemented using `react-dnd` and `react-dnd-html5-backend`
- Widgets can be dragged and reordered
- Smooth animations and visual feedback
- Position is preserved across sessions

### 3. **Edit Widget Capability**
- Click the settings icon (⚙️) on any widget
- Modal opens with current configuration pre-filled
- Modify any aspect (name, URL, fields, display mode, interval)
- Updates are saved immediately to store

### 4. **Real-time Data Fetching**
- Auto-refresh based on configurable intervals
- Manual refresh button on each widget
- Error handling with user-friendly messages
- Loading states and indicators

### 5. **Multiple Display Modes**
- **Card Mode**: Clean display for key metrics
- **Table Mode**: Row-based data presentation
- **Chart Mode**: Line charts with historical data

## 🔧 Technical Implementation Details

### State Management (Zustand)

The store (`src/store.ts`) provides:

```typescript
// Key actions available
addWidget(config)         // Add new widget
removeWidget(id)          // Remove widget
updateWidget(id, config)  // Update existing widget
refreshWidget(id, data)   // Update widget data
reorderWidgets(widgets)   // Change widget order
setAddModalOpen(boolean)  // Control add modal
setEditModalOpen(boolean, widget?) // Control edit modal
```

### Drag & Drop Implementation

In `WidgetCard.tsx`:
- Uses `useDrag` hook for draggable behavior
- Uses `useDrop` hook for drop target
- `moveWidget` function handles reordering
- Visual feedback with opacity changes

```typescript
const [{ isDragging }, drag] = useDrag({
  type: 'widget',
  item: () => ({ id: widget.id, index }),
  collect: (monitor) => ({ isDragging: monitor.isDragging() })
});
```

### Edit Functionality

When settings icon is clicked:
1. `onEdit(widget)` is called from `WidgetCard`
2. Store updates `editingWidget` state
3. `AddWidgetModal` receives `editingWidget` prop
4. Modal pre-fills form with existing values
5. On save, `updateWidget` action is called

## 📊 Example API Usage

### Bitcoin Price Tracker
```
URL: https://api.coinbase.com/v2/exchange-rates?currency=BTC
Fields: data.rates.USD, data.rates.EUR
Display: Chart
Interval: 30 seconds
```

### Stock Quote
```
URL: https://api.example.com/stock/AAPL
Fields: symbol, price, change, volume
Display: Card
Interval: 60 seconds
```

## 🎨 Customization Guide

### Modifying Refresh Interval Limits

In `AddWidgetModal.tsx`:
```tsx
<input type="number" min="5" ... />
// Change min value to adjust minimum refresh interval
```

### Changing Chart History Size

In `WidgetCard.tsx`:
```tsx
setHistory(prev => [...prev.slice(-19), ...])
// -19 keeps last 20 points (current + 19 previous)
// Change -19 to -29 for 30 points, etc.
```

### Styling Customization

Modify `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      // Add custom colors
    }
  }
}
```

## 🐛 Troubleshooting

### CORS Issues
If APIs return CORS errors:
- Use CORS-enabled APIs
- Consider using a CORS proxy
- Set up your own backend proxy

### Widgets Not Persisting
- Check browser localStorage is enabled
- Clear localStorage: `localStorage.clear()` in console
- Check for errors in browser console

### Drag & Drop Not Working
- Ensure `DndProvider` wraps the app in `App.tsx`
- Check `react-dnd` and `react-dnd-html5-backend` are installed
- Verify grip icon has proper cursor styles

### Data Not Updating
- Verify API URL returns valid JSON
- Check refresh interval is greater than 0
- Look for network errors in browser DevTools

## 📦 Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Output will be in `dist/` directory. Deploy to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🔐 Security Considerations

1. **API Keys**: Never commit API keys to the repository
2. **CORS**: Be aware of CORS restrictions
3. **Rate Limiting**: Respect API rate limits with appropriate intervals
4. **Input Validation**: URLs are validated before fetching

## 🚀 Deployment Checklist

- [ ] Update API URLs to production endpoints
- [ ] Set appropriate refresh intervals
- [ ] Test all widgets in production environment
- [ ] Configure CORS if needed
- [ ] Set up monitoring/error tracking
- [ ] Optimize bundle size if needed

## 📚 Additional Resources

- [React DnD Documentation](https://react-dnd.github.io/react-dnd/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Recharts Documentation](https://recharts.org/)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - See LICENSE file for details

---

**Happy Dashboard Building! 📊✨**
