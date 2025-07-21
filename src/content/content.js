// content.js - Content script for detail page extraction only

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractData') {
    handleExtraction(sendResponse);
    return true; // Indicate async response
  }
  
  if (request.action === 'ping') {
    sendResponse({ success: true, message: 'Content script loaded' });
    return false;
  }
});

// Handle extraction
async function handleExtraction(sendResponse) {
  try {
    // Check if this is a detail page
    const requiredElements = ['lblHachukikan', 'lblKojiNm', 'lblKojiPlaceFrom'];
    const hasRequiredElements = requiredElements.some(id => document.getElementById(id));
    
    if (!hasRequiredElements) {
      throw new Error('入札案件の詳細ページでのみ使用できます。');
    }
    
    // Extract data
    const rawData = window.extractData();
    const formattedData = window.formatter.formatData(rawData);
    
    sendResponse({ 
      success: true, 
      data: formattedData,
      rawData: rawData
    });
  } catch (error) {
    console.error('Data extraction error:', error);
    sendResponse({ success: false, error: error.message });
  }
}