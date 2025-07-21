// popup.js - Simplified popup window logic for detail page extraction only

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const extractBtn = document.getElementById('extractBtn');
  const statusDiv = document.getElementById('status');
  const statusText = document.getElementById('statusText');
  const resultDiv = document.getElementById('result');
  const resultMessage = resultDiv.querySelector('.result-message');
  
  // Extract button click handler
  extractBtn.addEventListener('click', async () => {
    try {
      // Disable button and show processing state
      extractBtn.disabled = true;
      extractBtn.classList.add('loading');
      statusText.textContent = '入札情報を抽出中...';
      statusText.className = 'status-text processing';
      statusDiv.classList.remove('hidden');
      resultDiv.classList.add('hidden');
      
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Check if content script is loaded
      let isLoaded = false;
      try {
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
        isLoaded = response && response.success;
      } catch (error) {
        // Script not loaded
      }
      
      // Inject scripts if not loaded
      if (!isLoaded) {
        const scripts = [
          'content/formatter.js',
          'content/extractor.js',
          'content/content.js'
        ];
        
        for (const script of scripts) {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: [script]
          });
        }
        
        // Wait for scripts to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Send extraction request
      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: 'extractData'
      });
      
      if (response && response.success) {
        // Copy to clipboard
        const clipboardResponse = await chrome.runtime.sendMessage({
          action: 'copyToClipboard',
          data: response.data
        });
        
        if (!clipboardResponse || !clipboardResponse.success) {
          throw new Error('クリップボードへのコピーに失敗しました。');
        }
        
        // Show success
        statusText.textContent = '完了';
        statusText.className = 'status-text success';
        resultDiv.className = 'result success';
        resultMessage.textContent = '入札情報を抽出してクリップボードにコピーしました。';
      } else {
        throw new Error(response?.error || '入札情報の抽出に失敗しました。');
      }
    } catch (error) {
      // Show error
      console.error('Extraction error:', error);
      statusText.textContent = 'エラー';
      statusText.className = 'status-text error';
      resultDiv.className = 'result error';
      resultMessage.textContent = error.message;
    } finally {
      // Re-enable button
      extractBtn.disabled = false;
      extractBtn.classList.remove('loading');
    }
  });
});