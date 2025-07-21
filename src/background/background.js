// background.js - Background service worker for Chrome extension

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'copyToClipboard') {
    copyToClipboard(request.data)
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error('Clipboard error:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    // Return true to indicate async response
    return true;
  }
});

// Copy text to clipboard using Chrome API
async function copyToClipboard(text) {
  try {
    // Use chrome.tabs API to inject clipboard write into active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (textToCopy) => {
        // Create textarea element for clipboard operation
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        
        // Select and copy
        textarea.select();
        const success = document.execCommand('copy');
        
        // Clean up
        document.body.removeChild(textarea);
        
        return success;
      },
      args: [text]
    });
  } catch (error) {
    console.error('Clipboard operation failed:', error);
    throw error;
  }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Extension installed successfully
  }
});