/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-hero
 * Base block: carousel
 * Source: https://wknd.site/us/en.html
 * Selector: .carousel.cmp-carousel--hero
 * Generated: 2026-06-04
 *
 * Extracts a hero carousel with multiple slides. Each slide contains
 * a background image, heading, description text, and CTA link.
 * Output: one row per slide with [image, content] columns.
 */
export default function parse(element, { document }) {
  // Find all carousel slide items
  const slides = element.querySelectorAll('.cmp-carousel__item');
  const cells = [];

  slides.forEach((slide) => {
    // Extract image from teaser image area
    const img = slide.querySelector('.cmp-teaser__image img, .cmp-image__image');

    // Extract heading (h2 with class cmp-teaser__title)
    const heading = slide.querySelector('.cmp-teaser__title, h2, h1');

    // Extract description text
    const description = slide.querySelector('.cmp-teaser__description');

    // Extract CTA link(s)
    const ctaLinks = slide.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a');

    // Build content cell: heading + description + CTA links
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLinks.length > 0) {
      ctaLinks.forEach((link) => contentCell.push(link));
    }

    // Row structure: [image cell, content cell] per slide
    const imageCell = img ? [img] : [];
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
