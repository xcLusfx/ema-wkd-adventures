/* eslint-disable */
/* global WebImporter */

import teaserAdventureParser from './parsers/teaser-adventure.js';
import tabsAdventureParser from './parsers/tabs-adventure.js';

import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
  'teaser-adventure': teaserAdventureParser,
  'tabs-adventure': tabsAdventureParser,
};

const PAGE_TEMPLATE = {
  name: 'adventures-listing',
  description: 'Adventures listing page with hero teaser and filterable tabbed adventure cards',
  urls: ['https://wknd.site/us/en/adventures.html'],
  blocks: [
    {
      name: 'teaser-adventure',
      instances: ['.teaser.cmp-teaser--hero']
    },
    {
      name: 'tabs-adventure',
      instances: ['.tabs.panelcontainer']
    }
  ],
  sections: [
    {
      id: 'section-1-title',
      name: 'Page Title',
      selector: 'main.cmp-layout-container--fixed:first-of-type',
      style: null,
      blocks: [],
      defaultContent: ['h1']
    },
    {
      id: 'section-2-hero',
      name: 'Hero Teaser',
      selector: '.teaser.cmp-teaser--hero',
      style: null,
      blocks: ['teaser-adventure'],
      defaultContent: []
    },
    {
      id: 'section-3-adventures',
      name: 'Adventures Grid',
      selector: 'main.cmp-layout-container--fixed:last-of-type',
      style: null,
      blocks: ['tabs-adventure'],
      defaultContent: ['h2.cmp-title__text']
    }
  ]
};

const transformers = [
  wkndCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [wkndSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
