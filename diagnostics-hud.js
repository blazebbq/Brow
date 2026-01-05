// Performance HUD - Shows FPS and Memory Usage
// Displays real-time performance metrics in the bottom-right corner

(function() {
    'use strict';
    
    console.log('[Brow Diagnostics] Performance HUD initializing...');
    
    let frameCount = 0;
    let lastTime = performance.now();
    
    // Create HUD element
    const hudElement = document.createElement('div');
    hudElement.id = 'brow-performance-hud';
    Object.assign(hudElement.style, {
        position: 'fixed',
        right: '8px',
        bottom: '8px',
        background: 'rgba(0, 0, 0, 0.85)',
        color: '#0f0',
        padding: '8px 12px',
        font: '12px/1.4 "Consolas", "Monaco", monospace',
        zIndex: '999999',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        minWidth: '150px',
        userSelect: 'none',
        pointerEvents: 'none'
    });
    
    // Wait for body to be available
    function initHUD() {
        if (document.body) {
            document.body.appendChild(hudElement);
            requestAnimationFrame(updateHUD);
            console.log('[Brow Diagnostics] Performance HUD active');
        } else {
            setTimeout(initHUD, 100);
        }
    }
    
    function updateHUD() {
        frameCount++;
        const now = performance.now();
        
        // Update every 500ms
        if (now - lastTime >= 500) {
            const fps = Math.round((frameCount * 1000) / (now - lastTime));
            
            let memoryInfo = 'N/A';
            if (performance.memory) {
                const usedMB = Math.round(performance.memory.usedJSHeapSize / 1048576);
                const totalMB = Math.round(performance.memory.jsHeapSizeLimit / 1048576);
                const usagePercent = Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100);
                memoryInfo = `${usedMB}MB / ${totalMB}MB (${usagePercent}%)`;
            }
            
            // Color code based on performance
            let fpsColor = '#0f0'; // green
            if (fps < 30) fpsColor = '#f00'; // red
            else if (fps < 50) fpsColor = '#ff0'; // yellow
            
            hudElement.innerHTML = `
                <div style="color: ${fpsColor}; font-weight: bold;">${fps} FPS</div>
                <div style="color: #0ff; font-size: 11px; margin-top: 4px;">Mem: ${memoryInfo}</div>
            `;
            
            lastTime = now;
            frameCount = 0;
        }
        
        requestAnimationFrame(updateHUD);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHUD);
    } else {
        initHUD();
    }
})();
