// utils.js - Utility functions

// Debug logging
export function debugLog(message, data = null) {
  chrome.storage.sync.get(['debugMode'], (items) => {
    if (items.debugMode) {
      console.log(`[MLIT Bid Extension] ${message}`, data || '');
    }
  });
}

// Error handling wrapper
export function handleError(error, context = '') {
  const errorMessage = error.message || error.toString();
  debugLog(`Error in ${context}: ${errorMessage}`);
  return {
    success: false,
    error: errorMessage
  };
}

// Retry function with exponential backoff
export async function retryOperation(operation, maxRetries = 3, delay = 500) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await sleep(delay * Math.pow(2, i));
      }
    }
  }
  
  throw lastError;
}

// Sleep utility
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Validate URL
export function isValidBidPage(url) {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'www.i-ppi.jp' && 
           urlObj.pathname.includes('List_Detail.aspx');
  } catch {
    return false;
  }
}

// Format date for display
export function formatDate(dateString) {
  if (!dateString) return '';
  
  // Remove extra spaces and normalize
  return dateString.trim().replace(/\s+/g, ' ');
}

// Sanitize text for clipboard
export function sanitizeText(text) {
  if (!text) return '';
  
  return text
    .trim()
    .replace(/[\r\n]+/g, ' ')  // Replace line breaks with space
    .replace(/\t+/g, ' ')      // Replace tabs with space
    .replace(/\s+/g, ' ');     // Normalize multiple spaces
}

// Get storage with defaults
export async function getStorageWithDefaults(keys) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, (items) => {
      // Apply defaults if not set
      const defaults = {
        autoClipboard: true,
        showNotifications: true,
        debugMode: false
      };
      
      const result = { ...defaults, ...items };
      resolve(result);
    });
  });
}

// Performance measurement
export function measurePerformance(operation, label) {
  const startTime = performance.now();
  
  return {
    start: () => {
      debugLog(`${label} started`);
    },
    end: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      debugLog(`${label} completed in ${duration.toFixed(2)}ms`);
      return duration;
    }
  };
}