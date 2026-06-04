/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND section breaks.
 * Inserts <hr> section dividers and Section Metadata blocks based on template sections.
 * Runs in afterTransform only (after block parsing completes).
 * Selectors validated against migration-work/cleaned.html:
 *   - .carousel.cmp-carousel--hero (line 165: carousel panelcontainer)
 *   - #container-9c4899b718 (line 254: featured content container)
 *   - .teaser.cmp-teaser--hero.cmp-teaser--imagebottom (line 364: adventure teaser)
 *   - #container-4d3fed64ff (line 384: adventures grid container)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid offset issues when inserting elements
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Insert Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.parentElement.insertBefore(sectionMetadata, sectionEl.nextSibling);
      }

      // Insert <hr> before section element (except for the first section)
      if (section !== sections[0]) {
        const hr = document.createElement('hr');
        sectionEl.parentElement.insertBefore(hr, sectionEl);
      }
    }
  }
}
