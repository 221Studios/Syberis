/**
 * Replaces Next's polyfill-module with an empty module.
 * That file assigns Baseline methods (Array.prototype.at, Object.hasOwn, …)
 * inside the modern bundle. The nomodule polyfill is a different file and
 * stays in place for older browsers.
 */
module.exports = function baselinePolyfillLoader() {
  return "/* Baseline browsers already provide these methods. */\n";
};
