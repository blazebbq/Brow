# Development Guide

## Project Structure

```
Brow/
├── main.js              # Main Electron process
├── preload.js           # Preload script for security bridge
├── renderer.js          # Renderer process logic
├── optimization.js      # Advanced optimization module
├── index.html           # Main HTML file
├── styles.css           # Application styles
├── package.json         # Project configuration
├── README.md            # User documentation
├── FEATURES.md          # Feature checklist
└── LICENSE              # MIT License
```

## Key Components

### main.js
Main Electron process that:
- Configures hardware acceleration
- Sets memory optimization flags
- Creates the browser window
- Manages window lifecycle
- Handles session optimizations
- **Important**: Enables webviewTag support (requires sandbox: false)

### preload.js
Security bridge that:
- Exposes safe APIs to renderer
- Maintains context isolation
- Provides system information

### renderer.js
Renderer process that:
- Manages the webview
- Injects optimization scripts into ChatGPT
- Handles loading states
- Monitors performance
- Implements virtual scrolling

### optimization.js
Additional optimizations:
- Memory monitoring
- Garbage collection hints
- Animation frame optimization
- Performance observers
- Resource preconnection

### index.html
Main interface:
- Loading screen
- Webview container
- Links all scripts and styles

### styles.css
Visual design:
- Loading screen animation
- Layout optimization
- GPU acceleration hints
- Smooth animations

## Performance Features

### Virtual Scrolling
Located in `renderer.js`:
```javascript
function manageMessageMemory() {
    const messages = document.querySelectorAll('[data-testid^="conversation-turn-"]');
    if (messages.length > 50) {
        // Keep first 5 and last 40 messages visible
        // Hide middle messages when off-screen
    }
}
```

### Memory Management
Located in `optimization.js`:
```javascript
// Monitors memory every minute
// Clears caches when usage > 80%
```

### Hardware Acceleration
Located in `main.js`:
```javascript
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
```

## Development Workflow

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **View Console Logs**
   - Look for `[Brow]` prefixed messages
   - Check for optimization confirmations
   - Monitor memory usage logs

3. **Test Features**
   - Start a long conversation in ChatGPT
   - Scroll through many messages
   - Monitor performance in DevTools

4. **Build**
   ```bash
   npm run build
   ```

## Debugging

### Enable DevTools
Add to `main.js` in `createWindow()`:
```javascript
mainWindow.webContents.openDevTools();
```

### Monitor Memory
Check console for:
```
[Brow Memory] Used: 123.45MB / 4096.00MB
```

### Check Optimizations
Look for:
```
[Brow Optimization] Applying performance enhancements...
[Brow Optimization] Enhancements applied successfully
```

## Testing Long Conversations

1. Open ChatGPT in Brow
2. Have a conversation with 50+ messages
3. Scroll rapidly up and down
4. Check console for optimization activity
5. Verify smooth scrolling
6. Monitor memory usage

## Performance Metrics

Expected performance:
- **Startup**: < 3 seconds
- **Memory**: 200-500MB for normal conversations
- **Scroll FPS**: 60fps even with 100+ messages
- **CPU**: < 5% when idle, < 20% when scrolling

## Adding New Features

1. Keep it minimal and focused on ChatGPT
2. Test performance impact
3. Document in FEATURES.md
4. Update README if user-facing

## Best Practices

1. **Always test with long conversations** (100+ messages)
2. **Monitor memory usage** throughout development
3. **Use throttling/debouncing** for frequent operations
4. **Prefer passive event listeners** for scroll events
5. **Log with [Brow] prefix** for easy filtering
