// extractor.js - Detail page data extraction logic

// Main extraction function for detail pages
window.extractData = function() {
  // Required elements for detail page
  const requiredElements = ['lblHachukikan', 'lblKojiNm', 'lblKojiPlaceFrom'];
  const hasRequiredElements = requiredElements.some(id => document.getElementById(id));
  
  if (!hasRequiredElements) {
    throw new Error('入札案件の詳細ページでのみ使用できます。');
  }
  
  // Extract all data fields
  const data = {
    hachukikan: extractTextById('lblHachukikan'),
    kojiName: extractTextById('lblKojiNm'),
    kojiPlace: extractTextById('lblKojiPlaceFrom'),
    kojiType: extractTextById('lblKojiType'),
    sekkeishoNo: extractTextById('lblSekkeisyoNo'),
    kokokuDate: extractTextById('lblKokokuDate'),
    kigenDate: extractTextById('lblkigenDate'),
    kasatuDate: extractTextById('lblkasatuDate'),
    pdfUrl: extractPdfUrl()
  };
  
  return data;
};

// Extract text content by element ID
function extractTextById(id) {
  const element = document.getElementById(id);
  return element ? element.textContent.trim() : '';
}

// Extract PDF URL from the page
function extractPdfUrl() {
  // Look for links in the document table (dgrKokoku)
  const kokokuTable = document.getElementById('dgrKokoku');
  if (kokokuTable) {
    // Find the row containing "入札公告" text
    const rows = kokokuTable.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) { // Skip header row
      const cells = rows[i].getElementsByTagName('td');
      if (cells.length > 0 && cells[0].textContent.trim().includes('入札')) {
        // Get the link from the second cell (公開状況)
        const link = cells[1] ? cells[1].querySelector('a') : null;
        if (link && link.hasAttribute('href')) {
          const href = link.getAttribute('href');
          return href.startsWith('http') ? href : new URL(href, window.location.origin).href;
        }
      }
    }
  }
  
  return '';
}