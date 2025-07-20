// background.js - Background service worker for Chrome extension

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'copyToClipboard') {
    copyToClipboard(request.data)
      .then(() => {
        // Show notification if enabled
        chrome.storage.sync.get(['showNotifications'], (items) => {
          if (items.showNotifications !== false) {
            showNotification('成功', 'データをクリップボードにコピーしました');
          }
        });
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

// Show notification
function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: '/assets/icons/icon48.png',
    title: title,
    message: message,
    priority: 1
  });
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      autoClipboard: true,
      showNotifications: true,
      debugMode: false
    });
    
    // Open welcome page or options
    chrome.runtime.openOptionsPage();
  }
});

// Handle extension icon click (when popup is not set)
chrome.action.onClicked.addListener(async (tab) => {
  // This won't fire if popup is set in manifest, but keeping for completeness
  if (tab.url && tab.url.includes('www.i-ppi.jp') && tab.url.includes('List_Detail.aspx')) {
    chrome.tabs.sendMessage(tab.id, { action: 'extractData' });
  }
});