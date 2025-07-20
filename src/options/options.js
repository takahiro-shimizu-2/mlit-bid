// options.js - Options page logic

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('optionsForm');
  const resetBtn = document.getElementById('resetBtn');
  const messageDiv = document.getElementById('message');
  const versionSpan = document.getElementById('version');
  
  // Default settings
  const defaultSettings = {
    autoClipboard: true,
    showNotifications: true,
    debugMode: false
  };
  
  // Load current settings
  loadSettings();
  
  // Display version from manifest
  const manifest = chrome.runtime.getManifest();
  versionSpan.textContent = manifest.version;
  
  // Form submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSettings();
  });
  
  // Reset button handler
  resetBtn.addEventListener('click', async () => {
    if (confirm('設定を初期状態に戻しますか？')) {
      await resetSettings();
    }
  });
  
  // Load settings from storage
  async function loadSettings() {
    chrome.storage.sync.get(defaultSettings, (items) => {
      document.getElementById('autoClipboard').checked = items.autoClipboard;
      document.getElementById('showNotifications').checked = items.showNotifications;
      document.getElementById('debugMode').checked = items.debugMode;
    });
  }
  
  // Save settings to storage
  async function saveSettings() {
    const settings = {
      autoClipboard: document.getElementById('autoClipboard').checked,
      showNotifications: document.getElementById('showNotifications').checked,
      debugMode: document.getElementById('debugMode').checked
    };
    
    chrome.storage.sync.set(settings, () => {
      showMessage('success', '設定を保存しました');
      
      // Log if debug mode is enabled
      if (settings.debugMode) {
        console.log('Settings saved:', settings);
      }
    });
  }
  
  // Reset to default settings
  async function resetSettings() {
    chrome.storage.sync.set(defaultSettings, () => {
      loadSettings();
      showMessage('success', '設定を初期状態に戻しました');
    });
  }
  
  // Show message
  function showMessage(type, text) {
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    
    // Hide message after 3 seconds
    setTimeout(() => {
      messageDiv.classList.add('hidden');
    }, 3000);
  }
  
  // Add change listeners for immediate feedback
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      // Enable save button feedback
      form.querySelector('button[type="submit"]').textContent = '保存*';
    });
  });
});