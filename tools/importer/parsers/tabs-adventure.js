/* eslint-disable */
/* global WebImporter */

/**
 * Parser: tabs-adventure
 * Base block: tabs
 * Source: https://wknd.site/us/en/adventures.html
 * Selector: .tabs.panelcontainer
 * Generated: 2026-06-04
 *
 * Extracts a tabbed navigation with category tabs (All, Climbing, Cycling, etc.).
 * Each tab panel contains a grid of adventure items with image, title link, and description.
 * Produces a Tabs block table where each row has [tab label, tab content].
 */
export default function parse(element, { document }) {
  // Find the inner cmp-tabs container
  const cmpTabs = element.querySelector('.cmp-tabs');
  const container = cmpTabs || element;

  // Extract tab labels from the ordered list
  const tabItems = Array.from(container.querySelectorAll('ol.cmp-tabs__tablist > li.cmp-tabs__tab'));

  // Extract tab panels
  const tabPanels = Array.from(container.querySelectorAll(':scope > .cmp-tabs__tabpanel'));

  const cells = [];

  // Build one row per tab: [tab label, tab content]
  tabItems.forEach((tabItem, index) => {
    const tabLabel = tabItem.textContent.trim();
    const panel = tabPanels[index];

    // Build content for this tab panel
    const contentContainer = document.createElement('div');

    if (panel) {
      // Extract adventure items from image list
      const adventureItems = Array.from(panel.querySelectorAll('li.cmp-image-list__item'));

      adventureItems.forEach((item) => {
        const article = item.querySelector('article');
        if (!article) return;

        // Extract image
        const img = article.querySelector('img.cmp-image__image');
        const imageLink = article.querySelector('a.cmp-image-list__item-image-link');

        // Extract title link
        const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
        const titleText = article.querySelector('.cmp-image-list__item-title');

        // Extract description
        const description = article.querySelector('.cmp-image-list__item-description');

        // Build adventure item content
        const itemDiv = document.createElement('div');

        // Add image wrapped in link
        if (img && imageLink) {
          const imgLink = document.createElement('a');
          imgLink.href = imageLink.href;
          const imgClone = img.cloneNode(true);
          imgLink.appendChild(imgClone);
          itemDiv.appendChild(imgLink);
        } else if (img) {
          itemDiv.appendChild(img.cloneNode(true));
        }

        // Add title as a linked heading
        if (titleLink && titleText) {
          const p = document.createElement('p');
          const link = document.createElement('a');
          link.href = titleLink.href;
          link.textContent = titleText.textContent.trim();
          p.appendChild(link);
          itemDiv.appendChild(p);
        }

        // Add description
        if (description) {
          const descP = document.createElement('p');
          descP.textContent = description.textContent.trim();
          itemDiv.appendChild(descP);
        }

        contentContainer.appendChild(itemDiv);
      });
    }

    cells.push([tabLabel, contentContainer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-adventure', cells });
  element.replaceWith(block);
}
