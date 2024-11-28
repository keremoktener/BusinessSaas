/**
 * Returns a promise that resolves after a specified delay.
 *
 * This function can be used to introduce a delay in asynchronous operations,
 * allowing for controlled timing in code execution.
 *
 * @param {number} ms - The number of milliseconds to wait before resolving the promise.
 * @returns {Promise<void>} - A promise that resolves after the specified delay.
 */
export const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));