import { init } from '@sentry/react';

const dsn = import.meta.env.VITE_SENTRY_DSN;

if (dsn) {
  init({
    dsn,
    environment: import.meta.env.MODE,
    sendDefaultPii: false,
    // Bugsink accepts error events, but does not process session reports.
    integrations: (defaults) => defaults.filter(
      (integration) => integration.name !== 'BrowserSession',
    ),
  });
}
