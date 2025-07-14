// Test JavaScript code for CodeContext Pro Execution Engine
console.log('🚀 Hello from CodeContext Pro Phase 2!');

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(`🧮 Fibonacci(10) = ${result}`);

// Test some basic operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(`📊 Doubled numbers: ${doubled.join(', ')}`);

// Test async operation
setTimeout(() => {
    console.log('⏰ Async operation completed!');
}, 100);

console.log('✅ Test execution completed successfully!');
