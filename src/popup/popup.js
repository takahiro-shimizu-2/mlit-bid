// popup.js - Popup window logic

document.addEventListener('DOMContentLoaded', () => {
  const extractBtn = document.getElementById('extractBtn');
  const statusText = document.getElementById('statusText');
  const resultDiv = document.getElementById('result');
  const resultMessage = resultDiv.querySelector('.result-message');
  const settingsBtn = document.getElementById('settingsBtn');
  const helpBtn = document.getElementById('helpBtn');
  
  // Check if on correct page
  checkCurrentTab();
  
  // Extract button click handler
  extractBtn.addEventListener('click', async () => {
    try {
      // Update UI to processing state
      setProcessingState();
      
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Check if on correct page
      if (!isValidPage(tab.url)) {
        throw new Error('この拡張機能は入札情報サービスの案件詳細ページでのみ使用できます。');
      }
      
      // Send message to content script
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractData' });
      
      if (response.success) {
        // Send formatted data to background script for clipboard copy
        const bgResponse = await chrome.runtime.sendMessage({
          action: 'copyToClipboard',
          data: response.data
        });
        
        if (bgResponse.success) {
          setSuccessState('データを抽出してクリップボードにコピーしました。');
        } else {
          throw new Error('クリップボードへのコピーに失敗しました。');
        }
      } else {
        throw new Error(response.error || 'データの抽出に失敗しました。');
      }
      
    } catch (error) {
      console.error('Error:', error);
      setErrorState(error.message);
    }
  });
  
  // Settings button handler
  settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  
  // Help button handler
  helpBtn.addEventListener('click', () => {
    showHelp();
  });
  
  // Check if current tab is valid
  async function checkCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!isValidPage(tab.url)) {
        extractBtn.disabled = true;
        statusText.textContent = '非対応ページ';
        statusText.className = 'status-text error';
        showResult('error', '入札情報サービスの案件詳細ページで使用してください。');
      }
    } catch (error) {
      console.error('Tab check error:', error);
    }
  }
  
  // Check if URL is valid
  function isValidPage(url) {
    if (!url) return false;
    return url.includes('www.i-ppi.jp') && url.includes('List_Detail.aspx');
  }
  
  // Set UI to processing state
  function setProcessingState() {
    extractBtn.disabled = true;
    extractBtn.classList.add('loading');
    statusText.textContent = '処理中...';
    statusText.className = 'status-text processing';
    resultDiv.classList.add('hidden');
  }
  
  // Set UI to success state
  function setSuccessState(message) {
    extractBtn.disabled = false;
    extractBtn.classList.remove('loading');
    statusText.textContent = '完了';
    statusText.className = 'status-text success';
    showResult('success', message);
  }
  
  // Set UI to error state
  function setErrorState(message) {
    extractBtn.disabled = false;
    extractBtn.classList.remove('loading');
    statusText.textContent = 'エラー';
    statusText.className = 'status-text error';
    showResult('error', message);
  }
  
  // Show result message
  function showResult(type, message) {
    resultDiv.className = `result ${type}`;
    resultMessage.textContent = message;
  }
  
  // Show help information
  function showHelp() {
    const helpMessage = `使い方:
1. 入札情報サービスの案件詳細ページを開く
2. 「データを抽出」ボタンをクリック
3. 抽出されたデータがクリップボードにコピーされます
4. スプレッドシートに貼り付けてください

対応ページ:
https://www.i-ppi.jp/IPPI/SearchServices/Web/Koji/Kokoku/List_Detail.aspx`;
    
    alert(helpMessage);
  }
});