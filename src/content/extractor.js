// extractor.js - Data extraction logic

// Main extraction function
window.extractData = function() {
  const data = {
    hachukikan: extractTextById('lblHachukikan'),
    kojiName: extractTextById('lblKojiNm'),
    kojiPlace: extractTextById('lblKojiPlaceFrom'),
    kojiType: extractTextById('lblKojiType'),
    sekkeishoNo: extractTextById('lblSekkeisyoNo'),
    kokokuDate: extractTextById('lblKokokuDate'),
    kigenDate: extractTextById('lblkigenDate'),
    kasatuDate: extractTextById('lblKasatuDate'),
    pdfUrl: extractPDFUrl()
  };
  
  return data;
};

// Extract text content by element ID
function extractTextById(elementId) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element not found: ${elementId}`);
    return '';
  }
  return element.textContent.trim();
}

// Extract PDF URL from public documents
function extractPDFUrl() {
  try {
    // Find all rows in the document table
    const rows = document.querySelectorAll('table tr');
    
    for (const row of rows) {
      const cells = row.querySelectorAll('td');
      
      // Look for rows with "公開中" status
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent.includes('公開中')) {
          // Check for PDF links in the same row
          const links = row.querySelectorAll('a');
          for (const link of links) {
            const href = link.getAttribute('href');
            if (href && (href.toLowerCase().includes('.pdf') || 
                        link.textContent.includes('PDF') ||
                        link.textContent.includes('ダウンロード'))) {
              // Convert relative URL to absolute
              return new URL(href, window.location.origin).href;
            }
          }
        }
      }
    }
    
    // Alternative search method - look for any PDF links with 公開中 nearby
    const allLinks = document.querySelectorAll('a[href*=".pdf"], a[href*=".PDF"]');
    for (const link of allLinks) {
      const parentText = link.closest('tr')?.textContent || '';
      if (parentText.includes('公開中')) {
        return new URL(link.getAttribute('href'), window.location.origin).href;
      }
    }
    
  } catch (error) {
    console.error('Error extracting PDF URL:', error);
  }
  
  return '';
}