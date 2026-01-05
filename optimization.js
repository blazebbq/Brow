// Additional optimization module for Brow
// This file contains advanced optimization techniques

(function() {
    'use strict';
    
    console.log('[Brow Optimization Module] Loading...');
    
    // Garbage collection hints
    if (window.performance && window.performance.memory) {
        setInterval(() => {
            const memory = performance.memory;
            const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
            
            // If memory usage is above 80%, suggest cleanup
            if (usagePercent > 80) {
                console.warn('[Brow] High memory usage detected:', usagePercent.toFixed(2) + '%');
                // Clear any cached data
                if ('caches' in window) {
                    caches.keys().then(names => {
                        names.forEach(name => {
                            if (name.includes('old') || name.includes('cache')) {
                                caches.delete(name);
                            }
                        });
                    });
                }
            }
        }, 60000); // Check every minute
    }
    
    // Optimize animation frame scheduling
    let animationFrameId;
    let isTabVisible = !document.hidden;
    
    document.addEventListener('visibilitychange', () => {
        isTabVisible = !document.hidden;
        if (isTabVisible) {
            console.log('[Brow] Tab visible - resuming optimizations');
        } else {
            console.log('[Brow] Tab hidden - pausing non-critical operations');
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        }
    });
    
    // Detect and optimize for long conversations
    const webview = document.getElementById('chatgpt-webview');
    if (webview) {
        webview.addEventListener('dom-ready', () => {
            // Additional webview-specific optimizations
            webview.setZoomFactor(1.0);
            
            // Enable efficient scrolling
            webview.executeJavaScript(`
                document.documentElement.style.scrollBehavior = 'auto';
            `).catch(() => {});
        });
    }
    
    // Resource hint injection
    const preconnectLinks = [
        'https://chat.openai.com',
        'https://cdn.openai.com',
        'https://api.openai.com'
    ];
    
    preconnectLinks.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        document.head.appendChild(link);
    });
    
    // Performance observer for monitoring
    if ('PerformanceObserver' in window) {
        try {
            const perfObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 100) {
                        console.log('[Brow Perf]', entry.name, entry.duration.toFixed(2) + 'ms');
                    }
                }
            });
            
            perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
        } catch (e) {
            // PerformanceObserver not supported or failed
        }
    }
    
    // Throttle function for performance
    window.browThrottle = function(func, delay) {
        let timeoutId;
        let lastRan;
        return function(...args) {
            const context = this;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function() {
                    if ((Date.now() - lastRan) >= delay) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, delay - (Date.now() - lastRan));
            }
        };
    };
    
    console.log('[Brow Optimization Module] Loaded successfully');
})();
