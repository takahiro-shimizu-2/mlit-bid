// content.js - Main content script for the extension

// Import formatter functions inline since content scripts have limited module support
const formatter = {
  formatData: function(extractedData) {
    const { mainOrg, subOrg } = this.parseOrganization(extractedData.hachukikan);
    
    const columns = [
      '',                              // A列: 空欄
      extractedData.kojiName,          // B列: 工事名称
      extractedData.sekkeishoNo,       // C列: 設計書番号
      mainOrg,                         // D列: 主要機関
      subOrg,                          // E列: 副機関
      this.formatDateTime(extractedData.kokokuDate),  // F列: 公告日時
      '',                              // G列: 空欄
      this.formatDateTime(extractedData.kigenDate),   // H列: 期限日時
      this.formatDateTime(extractedData.kasatuDate),  // I列: 開札日時
      extractedData.pdfUrl,            // J列: PDF URL
      '',                              // K列: 空欄
      extractedData.kojiType           // L列: 工事種別
    ];
    
    return columns.join('\t');
  },
  
  parseOrganization: function(orgName) {
    if (!orgName) {
      return { mainOrg: '', subOrg: '' };
    }
    
    const mainOrgPatterns = [
      /内閣府/,
      /.*省/,
      /.*県/,
    ];
    
    for (const pattern of mainOrgPatterns) {
      const match = orgName.match(pattern);
      if (match) {
        const mainOrg = match[0];
        const subOrg = orgName.replace(mainOrg, '').trim()
          .replace(/^[　\s]+/, '')
          .replace(/[　\s]+$/, '')
          .replace(/^[・／]/, '')
          .trim();
        
        return { mainOrg, subOrg };
      }
    }
    
    return { mainOrg: orgName, subOrg: '' };
  },
  
  formatDateTime: function(dateTimeStr) {
    if (!dateTimeStr) return '';
    return dateTimeStr.trim().replace(/\s+/g, ' ');
  }
};

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractData') {
    try {
      // Extract raw data
      const rawData = window.extractData();
      // Format data for spreadsheet
      const formattedData = formatter.formatData(rawData);
      
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
  // Return true to indicate async response
  return true;
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

function initialize() {
  // Check if we're on the correct page
  const url = window.location.href;
  const isDetailPage = url.includes('List_Detail.aspx');
  
  if (isDetailPage) {
    console.log('MLIT Bid Extension: Ready for data extraction');
  }
}