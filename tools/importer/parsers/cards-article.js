/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-article
 * Base block: cards
 * Source: https://wknd.site/us/en.html
 * Selectors: #container-9c4899b718 .image-list.list, #container-4d3fed64ff .image-list.list
 * Generated: 2026-06-04
 *
 * Extracts article card items from a ul.cmp-image-list structure.
 * Each item has: image (linked), title (linked), and description text.
 * Output: Cards table with one row per item — [image | title-link + description]
 */
export default function parse(element, { document }) {
  // Find all list items in the image list
  const items = element.querySelectorAll('.cmp-image-list__item, li[class*="image-list"]');

  const cells = [];

  items.forEach((item) => {
    // Extract image - look for the img inside the image link
    const img = item.querySelector('.cmp-image__image, .cmp-image-list__item-image img, article img');

    // Extract title link - the anchor wrapping the title text
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link, a[class*="title-link"]');

    // Extract description text
    const description = item.querySelector('.cmp-image-list__item-description, span[class*="description"]');

    // Build image cell (column 1)
    const imageCell = [];
    if (img) {
      // Wrap image in link if image link exists
      const imageLink = item.querySelector('a.cmp-image-list__item-image-link, a[class*="image-link"]');
      if (imageLink) {
        const linkEl = document.createElement('a');
        linkEl.href = imageLink.href;
        linkEl.appendChild(img.cloneNode(true));
        imageCell.push(linkEl);
      } else {
        imageCell.push(img);
      }
    }

    // Build content cell (column 2) - title link + description
    const contentCell = [];
    if (titleLink) {
      contentCell.push(titleLink);
    }
    if (description) {
      contentCell.push(description);
    }

    // Only add row if we have meaningful content
    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell.length > 0 ? imageCell : '', contentCell.length > 0 ? contentCell : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
