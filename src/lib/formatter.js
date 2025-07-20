// formatter.js - Data formatting utilities

// Format extracted data into tab-delimited format for spreadsheet
function formatData(extractedData) {
  const { mainOrg, subOrg } = parseOrganization(extractedData.hachukikan);
  
  // Format according to specification:
  // A列: 空欄
  // B列: 工事名称
  // C列: 設計書番号
  // D列: 発注機関の内、～省or内閣府or～県orいずれもない場合は発注機関の全文言
  // E列: 発注機関の内、D列以外を除いた全文言。D列に全て記載してしまった場合は空欄
  // F列: 公告日時
  // G列: 空欄
  // H列: 期限日時
  // I列: 開札日時
  // J列: 公開状態の公開中に設定されているPDFURL
  // K列: 空欄
  // L列: 工事種別／工事の業種
  
  const columns = [
    '',                              // A列: 空欄
    extractedData.kojiName,          // B列: 工事名称
    extractedData.sekkeishoNo,       // C列: 設計書番号
    mainOrg,                         // D列: 主要機関
    subOrg,                          // E列: 副機関
    formatDateTime(extractedData.kokokuDate),  // F列: 公告日時
    '',                              // G列: 空欄
    formatDateTime(extractedData.kigenDate),   // H列: 期限日時
    formatDateTime(extractedData.kasatuDate),  // I列: 開札日時
    extractedData.pdfUrl,            // J列: PDF URL
    '',                              // K列: 空欄
    extractedData.kojiType           // L列: 工事種別
  ];
  
  // Join with tabs for spreadsheet paste
  return columns.join('\t');
}

// Parse organization name into main and sub parts
function parseOrganization(orgName) {
  if (!orgName) {
    return { mainOrg: '', subOrg: '' };
  }
  
  // Patterns to match for main organization
  const mainOrgPatterns = [
    /内閣府/,
    /.*省/,      // Matches any ministry (〜省)
    /.*県/,      // Matches any prefecture (〜県)
  ];
  
  // Try to find main organization pattern
  for (const pattern of mainOrgPatterns) {
    const match = orgName.match(pattern);
    if (match) {
      const mainOrg = match[0];
      // Get the rest as sub organization
      const subOrg = orgName.replace(mainOrg, '').trim();
      
      // Clean up any remaining separators
      const cleanedSubOrg = subOrg
        .replace(/^[　\s]+/, '')  // Remove leading spaces
        .replace(/[　\s]+$/, '')  // Remove trailing spaces
        .replace(/^[・／]/, '')   // Remove leading separators
        .trim();
      
      return { mainOrg, subOrg: cleanedSubOrg };
    }
  }
  
  // If no pattern matches, put everything in main org
  return { mainOrg: orgName, subOrg: '' };
}

// Format date time string
function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return '';
  
  // Remove extra spaces and normalize
  return dateTimeStr.trim().replace(/\s+/g, ' ');
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { formatData, parseOrganization, formatDateTime };
}