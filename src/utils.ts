import ReactGA from "react-ga4";

// Only enable analytics in true production (not test environments)
// Set VITE_ENABLE_ANALYTICS=true during build for production
// const isAnalyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === "true";
const isAnalyticsEnabled = true;

export const initializeAnalytics = () => {
  if (isAnalyticsEnabled) {
    ReactGA.initialize("G-7FFS6QJMSL", {
      gaOptions: {
        debug_mode: true,
      },
      gtagOptions: {
        debug_mode: true,
        // Allow localhost for testing
        send_page_view: true,
      },
    });
    console.log("✅ Google Analytics initialized (with localhost support)");
  } else {
    console.log("🔧 Google Analytics disabled (development/test environment)");
  }
};

// Wrapper functions that only track when analytics is enabled
export const trackPageView = (path: string) => {
  if (isAnalyticsEnabled) {
    ReactGA.send({ hitType: "pageview", page: path });
    console.log(`📊 [Page View] ${path}`);
  } else {
    console.log(`📊 [Page View Skipped] ${path} - Analytics not ready`);
  }
};

export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  if (isAnalyticsEnabled) {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  } else {
    // Log in development for debugging
    console.log("📊 [Analytics Event]", { category, action, label, value });
  }
};

export const debugAnalytics = () => {
  if (isAnalyticsEnabled) {
    console.log("🔍 GA4 Debug Info:");
    console.log("- Measurement ID: G-7FFS6QJMSL");
    console.log("- Debug mode: Enabled");
    console.log("- Check GA4 Real-time dashboard for live data");
  } else {
    console.log("❌ GA4 not initialized yet");
  }
};

// Export for compatibility with existing code
export { ReactGA };
