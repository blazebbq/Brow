// Web Worker Pool for offloading heavy operations
// Prevents UI freezing by moving CPU-intensive tasks to background threads

class WorkerPool {
    constructor(workerScript, poolSize = null) {
        // Determine optimal pool size based on hardware
        const defaultSize = navigator.hardwareConcurrency 
            ? Math.max(2, Math.min(6, navigator.hardwareConcurrency - 2))
            : 4;
        
        this.poolSize = poolSize || defaultSize;
        this.workerScript = workerScript;
        this.taskId = 0;
        this.busyWorkers = new Map();
        this.freeWorkers = [];
        this.pendingTasks = [];
        
        console.log(`[Brow Worker Pool] Initializing with ${this.poolSize} workers`);
        
        // Initialize worker pool
        this.initializePool();
    }
    
    initializePool() {
        for (let i = 0; i < this.poolSize; i++) {
            try {
                const worker = new Worker(this.workerScript);
                this.freeWorkers.push(worker);
                
                worker.addEventListener('message', (e) => this.handleWorkerMessage(e, worker));
                worker.addEventListener('error', (e) => this.handleWorkerError(e, worker));
            } catch (err) {
                console.error('[Brow Worker Pool] Failed to create worker:', err);
            }
        }
        
        console.log(`[Brow Worker Pool] ${this.freeWorkers.length} workers ready`);
    }
    
    handleWorkerMessage(event, worker) {
        const { taskId, result, error } = event.data;
        
        if (this.busyWorkers.has(taskId)) {
            const { resolve, reject } = this.busyWorkers.get(taskId);
            this.busyWorkers.delete(taskId);
            
            if (error) {
                reject(new Error(error));
            } else {
                resolve(result);
            }
            
            // Return worker to free pool
            this.freeWorkers.push(worker);
            
            // Process next pending task if any
            this.processNextTask();
        }
    }
    
    handleWorkerError(error, worker) {
        console.error('[Brow Worker Pool] Worker error:', error);
        
        // Find and reject all tasks assigned to this worker
        for (const [taskId, { reject }] of this.busyWorkers) {
            reject(new Error('Worker failed'));
        }
        
        // Remove failed worker and create a new one
        const index = this.freeWorkers.indexOf(worker);
        if (index > -1) {
            this.freeWorkers.splice(index, 1);
        }
        
        try {
            const newWorker = new Worker(this.workerScript);
            newWorker.addEventListener('message', (e) => this.handleWorkerMessage(e, newWorker));
            newWorker.addEventListener('error', (e) => this.handleWorkerError(e, newWorker));
            this.freeWorkers.push(newWorker);
        } catch (err) {
            console.error('[Brow Worker Pool] Failed to replace worker:', err);
        }
    }
    
    execute(taskType, data) {
        return new Promise((resolve, reject) => {
            const taskId = this.taskId++;
            const task = { taskId, taskType, data, resolve, reject };
            
            if (this.freeWorkers.length > 0) {
                this.executeTask(task);
            } else {
                this.pendingTasks.push(task);
            }
        });
    }
    
    executeTask(task) {
        const worker = this.freeWorkers.pop();
        this.busyWorkers.set(task.taskId, { resolve: task.resolve, reject: task.reject });
        
        worker.postMessage({
            taskId: task.taskId,
            taskType: task.taskType,
            data: task.data
        });
    }
    
    processNextTask() {
        if (this.pendingTasks.length > 0 && this.freeWorkers.length > 0) {
            const task = this.pendingTasks.shift();
            this.executeTask(task);
        }
    }
    
    terminate() {
        console.log('[Brow Worker Pool] Terminating all workers');
        
        for (const worker of this.freeWorkers) {
            worker.terminate();
        }
        
        this.freeWorkers = [];
        this.busyWorkers.clear();
        this.pendingTasks = [];
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkerPool;
}
