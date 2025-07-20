// constants.js - Application constants

export const CONSTANTS = {
  // URL patterns
  URL_PATTERNS: {
    BASE_URL: 'https://www.i-ppi.jp',
    DETAIL_PAGE: 'List_Detail.aspx'
  },
  
  // DOM selectors
  SELECTORS: {
    HACHUKIKAN: 'lblHachukikan',
    KOJI_NAME: 'lblKojiNm',
    KOJI_PLACE: 'lblKojiPlaceFrom',
    KOJI_TYPE: 'lblKojiType',
    SEKKEISHO_NO: 'lblSekkeisyoNo',
    KOKOKU_DATE: 'lblKokokuDate',
    KIGEN_DATE: 'lblkigenDate',
    KASATU_DATE: 'lblKasatuDate'
  },
  
  // Default settings
  DEFAULT_SETTINGS: {
    autoClipboard: true,
    showNotifications: true,
    debugMode: false
  },
  
  // Messages
  MESSAGES: {
    EXTRACT_SUCCESS: 'データを抽出してクリップボードにコピーしました。',
    EXTRACT_ERROR: 'データの抽出に失敗しました。',
    CLIPBOARD_ERROR: 'クリップボードへのコピーに失敗しました。',
    INVALID_PAGE: 'この拡張機能は入札情報サービスの案件詳細ページでのみ使用できます。',
    ELEMENT_NOT_FOUND: '必要な要素が見つかりませんでした。'
  },
  
  // Performance
  PERFORMANCE: {
    MAX_EXTRACTION_TIME: 3000, // 3 seconds
    RETRY_DELAY: 500,
    MAX_RETRIES: 3
  }
};