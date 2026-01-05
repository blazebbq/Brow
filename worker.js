// Web Worker script for offloading heavy operations
// Handles JSON parsing, array operations, and other CPU-intensive tasks

self.addEventListener('message', (event) => {
    const { taskId, taskType, data } = event.data;
    
    try {
        let result;
        
        switch (taskType) {
            case 'parseJSON':
                result = JSON.parse(data.jsonString);
                break;
                
            case 'stringifyJSON':
                result = JSON.stringify(data.object, null, data.indent);
                break;
                
            case 'sortArray':
                result = data.array.sort((a, b) => {
                    if (data.compareFn) {
                        return eval(`(${data.compareFn})`)(a, b);
                    }
                    return a > b ? 1 : a < b ? -1 : 0;
                });
                break;
                
            case 'filterArray':
                result = data.array.filter((item, index) => {
                    if (data.predicate) {
                        return eval(`(${data.predicate})`)(item, index);
                    }
                    return true;
                });
                break;
                
            case 'mapArray':
                result = data.array.map((item, index) => {
                    if (data.transform) {
                        return eval(`(${data.transform})`)(item, index);
                    }
                    return item;
                });
                break;
                
            case 'processText':
                // Text processing operations (e.g., markdown rendering, syntax highlighting)
                result = processTextContent(data);
                break;
                
            case 'compressData':
                // Simulate data compression
                result = compressString(data.content);
                break;
                
            case 'decompressData':
                // Simulate data decompression
                result = decompressString(data.content);
                break;
                
            default:
                throw new Error(`Unknown task type: ${taskType}`);
        }
        
        self.postMessage({ taskId, result });
        
    } catch (error) {
        self.postMessage({ 
            taskId, 
            error: error.message || 'Unknown error in worker'
        });
    }
});

// Helper function for text processing
function processTextContent(data) {
    const { content, operation } = data;
    
    switch (operation) {
        case 'wordCount':
            return content.split(/\s+/).filter(w => w.length > 0).length;
            
        case 'lineCount':
            return content.split('\n').length;
            
        case 'extractUrls':
            const urlPattern = /https?:\/\/[^\s]+/g;
            return content.match(urlPattern) || [];
            
        case 'truncate':
            const maxLength = data.maxLength || 100;
            return content.length > maxLength 
                ? content.substring(0, maxLength) + '...' 
                : content;
                
        default:
            return content;
    }
}

// Simple string compression simulation (for demonstration)
function compressString(str) {
    // In a real implementation, you'd use a compression library
    // This is a simple run-length encoding for demonstration
    let compressed = '';
    let count = 1;
    
    for (let i = 0; i < str.length; i++) {
        if (str[i] === str[i + 1]) {
            count++;
        } else {
            compressed += str[i] + (count > 1 ? count : '');
            count = 1;
        }
    }
    
    return compressed;
}

function decompressString(str) {
    // Reverse of the simple compression
    let decompressed = '';
    let i = 0;
    
    while (i < str.length) {
        const char = str[i];
        let count = '';
        
        i++;
        while (i < str.length && /\d/.test(str[i])) {
            count += str[i];
            i++;
        }
        
        const repeatCount = count ? parseInt(count) : 1;
        decompressed += char.repeat(repeatCount);
    }
    
    return decompressed;
}

console.log('[Brow Worker] Worker ready');
