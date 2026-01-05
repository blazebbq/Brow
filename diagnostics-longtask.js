// Long Task Performance Observer
// Monitors tasks that block the main thread for more than 50ms

(function() {
    'use strict';
    
    console.log('[Brow Diagnostics] Long Task Observer initializing...');
    
    if ('PerformanceObserver' in window) {
        try {
            const longTaskObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const duration = Math.round(entry.duration);
                    if (duration > 50) {
                        console.warn(`[LONG TASK] ${duration}ms - blocked main thread`, {
                            name: entry.name,
                            startTime: Math.round(entry.startTime),
                            duration: duration,
                            attribution: entry.attribution
                        });
                    }
                }
            });
            
            // Try to observe longtask - may not be supported in all contexts
            try {
                longTaskObserver.observe({ entryTypes: ['longtask'] });
                console.log('[Brow Diagnostics] Long Task Observer active');
            } catch (e) {
                console.log('[Brow Diagnostics] Long Task API not available, using fallback');
                
                // Fallback: monitor long running operations via performance marks
                const originalSetTimeout = window.setTimeout;
                window.setTimeout = function(fn, delay) {
                    return originalSetTimeout(function() {
                        const start = performance.now();
                        fn();
                        const duration = performance.now() - start;
                        if (duration > 50) {
                            console.warn(`[LONG TASK] ${Math.round(duration)}ms in setTimeout callback`);
                        }
                    }, delay);
                };
            }
        } catch (err) {
            console.error('[Brow Diagnostics] Error setting up Long Task Observer:', err);
        }
    } else {
        console.warn('[Brow Diagnostics] PerformanceObserver not available');
    }
})();
