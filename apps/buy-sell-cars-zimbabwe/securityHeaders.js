/**
 * Security headers for the application.
 * This file contains security headers that are used to protect the application from various attacks
 * and vulnerabilities.
 */
module.exports = [
  {
    key: "Permissions-Policy", // none on root
    value: "microphone=(), camera=()", // Disable sensitive features that we know we're unlikely to use
  },
  {
    key: "Referrer-Policy",
    value: "same-origin", // Don't share the referrer URL to other domains
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff", // Instruct browsers not to override our stated MIME types
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN", // Don't allow other browsers to put us in a frame
  },
];
