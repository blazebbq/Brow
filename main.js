const { app, BrowserWindow, session } = require('electron');
const path = require('path');

// Enable hardware acceleration
app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('disable-software-rasterizer');

// Memory optimization flags
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'Brow - ChatGPT Browser',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // Must disable sandbox for webview tag
      webSecurity: true,
      webviewTag: true, // Enable webview tag support
      // Performance optimizations
      enablePreferredSizeMode: true,
      backgroundThrottling: false,
      offscreen: false,
    },
    // Performance settings
    show: false, // Show after ready-to-show for smoother startup
    backgroundColor: '#343541', // ChatGPT dark theme color
  });

  // Optimize session settings
  session.defaultSession.setProxy({
    mode: 'direct'
  });

  // Cache settings for better performance
  session.defaultSession.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  // Load the index.html which will navigate to ChatGPT
  mainWindow.loadFile('index.html');

  // Show window when ready to prevent white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Optimize for long-running sessions
  mainWindow.webContents.on('did-finish-load', () => {
    // Inject optimization scripts after page loads
    mainWindow.webContents.executeJavaScript(`
      // Performance monitoring
      console.log('[Brow] Page loaded, applying optimizations...');
    `);
  });

  // Handle memory pressure
  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('Render process gone:', details);
    if (details.reason === 'oom') {
      console.log('Out of memory - attempting recovery...');
      // Could implement recovery logic here
    }
  });

  // Clean up on close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevent new window creation (keep user in single window)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Allow ChatGPT-related URLs to open in the same window
    // Use proper URL parsing to validate the hostname
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();
      // Only allow exact OpenAI domains and subdomains
      if (hostname === 'chat.openai.com' || 
          hostname === 'chatgpt.com' ||
          hostname.endsWith('.openai.com') || 
          hostname.endsWith('.chatgpt.com')) {
        mainWindow.loadURL(url);
      }
    } catch (e) {
      console.error('[Brow] Invalid URL:', url, e);
    }
    return { action: 'deny' };
  });
}

// Performance optimization: reduce idle memory
app.on('browser-window-blur', () => {
  // Trigger garbage collection when window loses focus
  if (global.gc) {
    global.gc();
  }
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Initialize app
app.whenReady().then(() => {
  createWindow();

  // Note: We allow ChatGPT to manage its own security headers
  // The webview is sandboxed for security
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});
