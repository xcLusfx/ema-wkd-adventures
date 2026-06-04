/* eslint-disable */
/* global WebImporter */

/**
 * Parser: teaser-featured
 * Base block: hero
 * Source: https://wknd.site/us/en.html
 * Selector: .teaser.cmp-teaser--featured
 * Generated: 2026-06-04
 *
 * Extracts a featured article teaser with pretitle, heading, description,
 * CTA link, and image. Produces a Hero block table with image in first cell
 * and text content in second cell.
 */
export default function parse(element, { document }) {
  // Extract image from the teaser image container
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image__image');

  // Extract pretitle label (e.g. "Featured Article")
  const pretitle = element.querySelector('.cmp-teaser__pretitle');

  // Extract heading (h2 title)
  const heading = element.querySelector('.cmp-teaser__title, h2');

  // Extract description text
  const description = element.querySelector('.cmp-teaser__description');

  // Extract CTA link(s)
  const ctaLinks = Array.from(
    element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a')
  );

  // Build content cell: pretitle, heading, description, CTA(s)
  const contentCell = [];
  if (pretitle) contentCell.push(pretitle);
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLinks.length > 0) contentCell.push(...ctaLinks);

  // Build cells array matching library example:
  // Row 1: [image] | [pretitle, heading, description, CTA]
  const cells = [];
  if (image) {
    cells.push([image, contentCell]);
  } else {
    // Fallback: single cell with content only if no image found
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'teaser-featured', cells });
  element.replaceWith(block);
}
