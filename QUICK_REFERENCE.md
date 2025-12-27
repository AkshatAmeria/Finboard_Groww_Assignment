# FinBoard - Quick Reference

## 🎯 Key Features at a Glance

### ✅ What's Implemented

1. **Zustand State Management**
   - Location: `src/store.ts`
   - Persistent storage via localStorage
   - Centralized widget state

2. **Drag & Drop Widgets**
   - Grab handle: 6-dot icon (⋮⋮)
   - Reorder by dragging
   - Position saved automatically

3. **Edit Widgets**
   - Click settings icon (⚙️)
   - Modify any configuration
   - Changes save immediately

4. **Three Display Modes**
   - 📊 Card: Key metrics display
   - 📋 Table: Tabular data
   - 📈 Chart: Time-series visualization

5. **Auto-refresh**
   - Configurable intervals (minimum 5s)
   - Manual refresh button
   - Independent per widget

## 🔑 Component Overview

### `App.tsx`
- Main application wrapper
- DnD Provider setup
- Modal state management

### `store.ts`
- Zustand store definition
- Actions: add, remove, update, refresh, reorder
- LocalStorage persistence

### `WidgetCard.tsx`
- Individual widget rendering
- Drag & Drop hooks
- Auto-refresh logic
- Three display modes

### `AddWidgetModal.tsx`
- Add/Edit modal (same component)
- API testing
- Field selection
- Form validation

### `JsonExplorer.tsx`
- Flattens API responses
- Field search functionality
- Visual field selection

## 🎮 User Actions

| Action | How To |
|--------|--------|
| Add Widget | Click "Add Widget" button |
| Edit Widget | Click ⚙️ settings icon |
| Delete Widget | Click 🗑️ trash icon |
| Refresh Widget | Click 🔄 refresh icon |
| Reorder Widgets | Drag using ⋮⋮ grip handle |
| Test API | Click "Test" in modal |
| Select Fields | Click fields in explorer |

## 💾 Data Persistence

**What's Saved:**
- Widget configurations
- Display modes
- Field selections
- Refresh intervals
- Widget order

**What's NOT Saved:**
- Live data (refreshed on load)
- API responses
- Chart history

## 🔧 Quick Customization

### Change Minimum Refresh Time
File: `src/components/AddWidgetModal.tsx`
```tsx
<input type="number" min="5" /> // Change 5 to desired minimum
```

### Modify Chart Data Points
File: `src/components/WidgetCard.tsx`
```tsx
setHistory(prev => [...prev.slice(-19), ...]) // -19 = 20 points
```

### Adjust Grid Layout
File: `src/App.tsx`
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
// Modify breakpoints: md: = tablet, lg: = desktop
```

## 🐛 Common Issues & Fixes

### Issue: Widgets won't drag
**Fix:** Ensure DndProvider wraps App component

### Issue: Edits not saving
**Fix:** Check browser console for Zustand errors

### Issue: CORS errors
**Fix:** Use CORS-enabled APIs or proxy

### Issue: Data not updating
**Fix:** Verify API URL and check network tab

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "zustand": "^4.4.7",
  "react-dnd": "^16.0.1",
  "react-dnd-html5-backend": "^16.0.1",
  "recharts": "^2.10.3",
  "lucide-react": "^0.263.1"
}
```

## 🎨 Color Scheme

- Primary: Emerald (`emerald-500`, `emerald-600`)
- Background: Slate (`slate-900`, `slate-950`)
- Text: White, Slate variants
- Accent: Emerald with opacity

## 📱 Responsive Breakpoints

- Mobile: Default (< 768px)
- Tablet: `md:` (≥ 768px)
- Desktop: `lg:` (≥ 1024px)

## 🚀 Performance Tips

1. Set reasonable refresh intervals (≥30s recommended)
2. Limit number of widgets to 6-12
3. Use Table mode for arrays instead of multiple Card widgets
4. Chart mode keeps only last 20 data points

## 🔄 State Flow

```
User Action
    ↓
Zustand Action
    ↓
Store Update
    ↓
LocalStorage Save
    ↓
Component Re-render
```

## 📊 Display Mode Guidelines

### Use Card Mode When:
- Displaying 1-5 key metrics
- Need large, readable numbers
- Focus on current values

### Use Table Mode When:
- Showing array data
- Comparing multiple items
- Need column-based layout

### Use Chart Mode When:
- Tracking changes over time
- Need visual trend analysis
- Monitoring single metric

## 🎯 Best Practices

1. **API URLs**: Always use HTTPS
2. **Intervals**: Respect rate limits
3. **Fields**: Select 2-5 fields per widget
4. **Naming**: Use descriptive widget names
5. **Testing**: Always test API before saving

---

**Need more details? Check README.md or SETUP_GUIDE.md**
