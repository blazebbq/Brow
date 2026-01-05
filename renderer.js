// Renderer process for Brow - ChatGPT Browser
console.log('[Brow Renderer] Initializing...');

const webview = document.getElementById('chatgpt-webview');
const loadingScreen = document.getElementById('loading-screen');

// Handle webview load events
webview.addEventListener('did-start-loading', () => {
    console.log('[Brow] ChatGPT loading...');
});

webview.addEventListener('did-finish-load', () => {
    console.log('[Brow] ChatGPT loaded successfully');
    
    // Hide loading screen after a short delay
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 500);
    
    // Inject optimization scripts into the ChatGPT page
    injectOptimizations();
});

webview.addEventListener('did-fail-load', (event) => {
    console.error('[Brow] Failed to load ChatGPT:', event);
    if (!event.isMainFrame) return; // Ignore iframe load failures
    
    // Show error message
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <h1>Connection Error</h1>
            <p>Failed to load ChatGPT. Please check your internet connection.</p>
            <button onclick="location.reload()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; border: none; border-radius: 5px; background: white; color: #667eea;">
                Retry
            </button>
        </div>
    `;
});

webview.addEventListener('console-message', (event) => {
    // Log console messages from the webview (useful for debugging)
    if (event.level === 2) { // Error level
        console.error('[ChatGPT Console]:', event.message);
    }
});

// Performance monitoring
webview.addEventListener('dom-ready', () => {
    console.log('[Brow] DOM ready, injecting performance optimizations...');
});

// Handle page title changes
webview.addEventListener('page-title-updated', (event) => {
    document.title = `Brow - ${event.title}`;
});

// Function to inject optimization scripts into ChatGPT
function injectOptimizations() {
    const optimizationScript = `
        (function() {
            console.log('[Brow Optimization] Applying performance enhancements...');
            
            // Virtual scrolling observer to manage off-screen elements
            let lastScrollTime = Date.now();
            const SCROLL_THROTTLE = 100; // ms
            
            // Optimize images - lazy loading
            function optimizeImages() {
                const images = document.querySelectorAll('img:not([loading])');
                images.forEach(img => {
                    img.loading = 'lazy';
                });
            }
            
            // Memory management - remove old messages from DOM when list gets too long
            function manageMessageMemory() {
                try {
                    // Try multiple selectors for robustness
                    const messages = document.querySelectorAll('[data-testid^="conversation-turn-"], .group, article');
                    if (messages.length > 50) {
                        // Keep first 5 and last 40 messages visible, hide middle ones
                        for (let i = 5; i < messages.length - 40; i++) {
                            if (messages[i] && !messages[i].hasAttribute('data-brow-hidden')) {
                                const rect = messages[i].getBoundingClientRect();
                                // Only hide if off-screen
                                if (rect.bottom < 0 || rect.top > window.innerHeight) {
                                    messages[i].style.display = 'none';
                                    messages[i].setAttribute('data-brow-hidden', 'true');
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.warn('[Brow] Error in manageMessageMemory:', e);
                }
            }
            
            // Restore hidden messages when scrolling near them
            function restoreMessages() {
                try {
                    const hiddenMessages = document.querySelectorAll('[data-brow-hidden="true"]');
                    hiddenMessages.forEach(msg => {
                        const rect = msg.getBoundingClientRect();
                        const bufferZone = 1000; // pixels
                        if (rect.top < window.innerHeight + bufferZone && rect.bottom > -bufferZone) {
                            msg.style.display = '';
                            msg.removeAttribute('data-brow-hidden');
                        }
                    });
                } catch (e) {
                    console.warn('[Brow] Error in restoreMessages:', e);
                }
            }
            
            // Throttled scroll handler
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                const now = Date.now();
                if (now - lastScrollTime > SCROLL_THROTTLE) {
                    lastScrollTime = now;
                    restoreMessages();
                }
                
                // Debounce memory management
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    manageMessageMemory();
                }, 500);
            }, { passive: true });
            
            // Run optimizations periodically
            setInterval(() => {
                optimizeImages();
                manageMessageMemory();
            }, 5000);
            
            // Initial optimization
            setTimeout(() => {
                optimizeImages();
            }, 1000);
            
            // Disable auto-scroll to bottom on new messages (reduces reflow)
            const cssText = '* { scroll-behavior: auto !important; }';
            const style = document.createElement('style');
            style.textContent = cssText;
            document.head.appendChild(style);
            
            console.log('[Brow Optimization] Enhancements applied successfully');
        })();
    `;
    
    webview.executeJavaScript(optimizationScript).catch(err => {
        console.error('[Brow] Failed to inject optimizations:', err);
    });
}

// Memory usage monitoring
if (window.performance && window.performance.memory) {
    setInterval(() => {
        const memory = window.performance.memory;
        const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(2);
        const totalMB = (memory.jsHeapSizeLimit / 1048576).toFixed(2);
        console.log(`[Brow Memory] Used: ${usedMB}MB / ${totalMB}MB`);
    }, 30000); // Log every 30 seconds
}

console.log('[Brow Renderer] Ready');
