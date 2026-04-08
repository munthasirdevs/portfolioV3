/**
 * Application Configuration
 * Centralized configuration for the frontend application
 */

export const config = {
  // Application
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Developer Portfolio",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:6001",

  // Feature Flags
  features: {
    ssr: process.env.NEXT_PUBLIC_ENABLE_SSR === "true",
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
    aiChat: process.env.NEXT_PUBLIC_AI_CHAT_ENABLED === "true",
    liveMetrics: process.env.NEXT_PUBLIC_LIVE_METRICS_ENABLED === "true",
    codePlayground: process.env.NEXT_PUBLIC_CODE_PLAYGROUND_ENABLED === "true",
    urlShortener: process.env.NEXT_PUBLIC_URL_SHORTENER_ENABLED === "true",
  },

  // Analytics
  analytics: {
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",
    plausibleScriptUrl: process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL || "",
  },

  // Pagination
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 50,
  },

  // API
  api: {
    timeout: 30000,
    retries: 3,
    version: "v1",
  },
} as const;

// Type for the config object
export type Config = typeof config;
