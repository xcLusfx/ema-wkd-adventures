/* eslint-disable */
/* global WebImporter */

/**
 * Parser for teaser-adventure
 * Base block: hero
 * Source: https://wknd.site/us/en.html
 * Selector: .teaser.cmp-teaser--hero.cmp-teaser--imagebottom
 * Generated: 2026-06-04
 *
 * Extracts a large adventure teaser with heading, description, CTA button,
 * and full-width image. Maps to Hero block table with image + content cells.
 */
export default function parse(element, { document }) {
  // Extract image from .cmp-teaser__image container
  const image = element.querySelector('.cmp-teaser__image .cmp-image__image, .cmp-teaser__image img');

  // Extract heading from .cmp-teaser__content
  const heading = element.querySelector('.cmp-teaser__title, .cmp-teaser__content h2, .cmp-teaser__content h1');

  // Extract description text
  const description = element.querySelector('.cmp-teaser__description');

  // Extract CTA link(s) from action container
  const ctaLinks = Array.from(
    element.querySelectorAll('.cmp-teaser__action-container a.cmp-teaser__action-link, .cmp-teaser__action-container a')
  );

  // Build content cell: heading + description + CTA links
  // Matches library example: image in col 1, content (heading, description, CTA) in col 2
  const contentCell = [];

  if (heading) {
    contentCell.push(heading);
  }

  if (description) {
    contentCell.push(description);
  }

  // Add CTA links as individual elements
  ctaLinks.forEach((link) => {
    contentCell.push(link);
  });

  // Build cells array matching Hero block library structure:
  // Row 1: [image, content(heading + description + CTA)]
  const cells = [];

  if (image) {
    cells.push([image, contentCell]);
  } else {
    // Fallback: content only if no image found
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'teaser-adventure', cells });
  element.replaceWith(block);
}
