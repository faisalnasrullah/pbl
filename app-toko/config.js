/**
 * FRONTEND CONFIGURATION
 * Centralized settings for JS.
 */

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const CONFIG = {
    // API Base URL
    // Jika local: '../api-toko/'
    // Jika hosting: bisa sama jika di htdocs root yang sama
    API_BASE_URL: isLocalhost ? '../api-toko/' : '../api-toko/',
    
    // App Metadata
    APP_NAME: 'TokoBestari',
    VERSION: '1.0.8'
};

// Freeze object to prevent changes
Object.freeze(CONFIG);
