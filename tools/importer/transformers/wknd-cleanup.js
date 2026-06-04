/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup.
 * Removes non-authorable content from the WKND Adventures site.
 * Selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove elements that could interfere with block parsing
    // iframe: Adobe Audience Manager tracking iframe (id="destination_publishing_iframe_wkndsite_0")
    // #toggleNav: Mobile hamburger toggle button
    // #mobileNav: Mobile navigation overlay (class="cmp-navigation--mobile")
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      '#toggleNav',
      '#mobileNav',
      'noscript',
      'link',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome
    // header.experiencefragment: AEM Experience Fragment header with logo, nav, search, language switcher
    // footer.experiencefragment: AEM Experience Fragment footer with logo, nav, social links, copyright
    WebImporter.DOMUtils.remove(element, [
      'header.experiencefragment',
      'footer.experiencefragment',
    ]);
  }
}
