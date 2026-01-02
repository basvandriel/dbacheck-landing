import ReactGA from "react-ga4";

// Only enable analytics in true production (not test environments)
// Set VITE_ENABLE_ANALYTICS=true during build for production
const isAnalyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === "true";

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
    console.log("✅ GA4 initialized");
  }
};

// Wrapper functions that only track when analytics is enabled
export const trackPageView = (path: string) => {
  if (isAnalyticsEnabled) {
    ReactGA.send({ hitType: "pageview", page: path });
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
    console.log(
      `📊 Event: ${category} - ${action}`,
      label ? { label, value } : {}
    );
  }
};

// Export for compatibility with existing code
export { ReactGA };
