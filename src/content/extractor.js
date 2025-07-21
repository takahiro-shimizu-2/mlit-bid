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
  const pdfLinks = document.querySelectorAll('a[href*=".pdf"]');
  if (pdfLinks.length > 0) {
    const href = pdfLinks[0].getAttribute('href');
    // Convert relative URL to absolute URL
    return href.startsWith('http') ? href : new URL(href, window.location.origin).href;
  }
  return '';
}