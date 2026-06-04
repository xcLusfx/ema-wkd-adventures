/* eslint-disable */
/* global WebImporter */

import carouselHeroParser from './parsers/carousel-hero.js';
import teaserFeaturedParser from './parsers/teaser-featured.js';
import teaserAdventureParser from './parsers/teaser-adventure.js';
import cardsArticleParser from './parsers/cards-article.js';

import wkndCleanupTransformer from './transformers/wknd-cleanup.js';
import wkndSectionsTransformer from './transformers/wknd-sections.js';

const parsers = {
  'carousel-hero': carouselHeroParser,
  'teaser-featured': teaserFeaturedParser,
  'teaser-adventure': teaserAdventureParser,
  'cards-article': cardsArticleParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'WKND Adventures homepage with hero carousel, featured article teaser, recent articles grid, and next adventures section',
  urls: [
    'https://wknd.site/us/en.html'
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.carousel.cmp-carousel--hero']
    },
    {
      name: 'teaser-featured',
      instances: ['.teaser.cmp-teaser--featured']
    },
    {
      name: 'cards-article',
      instances: ['#container-9c4899b718 .image-list.list', '#container-4d3fed64ff .image-list.list']
    },
    {
      name: 'teaser-adventure',
      instances: ['.teaser.cmp-teaser--hero.cmp-teaser--imagebottom']
    }
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Carousel',
      selector: '.carousel.cmp-carousel--hero',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: []
    },
    {
      id: 'section-2-content',
      name: 'Featured Content',
      selector: 'main.cmp-layout-container--fixed #container-9c4899b718',
      style: null,
      blocks: ['teaser-featured', 'cards-article'],
      defaultContent: ['#title-c2d2b28d00', '#button-2e6d32893a', '#separator-bd766ae5bf', '#title-971080d74b']
    },
    {
      id: 'section-3-adventure-teaser',
      name: 'Adventure Teaser',
      selector: '.teaser.cmp-teaser--hero.cmp-teaser--imagebottom',
      style: null,
      blocks: ['teaser-adventure'],
      defaultContent: []
    },
    {
      id: 'section-4-adventures',
      name: 'Adventures Grid',
      selector: 'main.cmp-layout-container--fixed #container-4d3fed64ff',
      style: null,
      blocks: ['cards-article'],
      defaultContent: ['#title-ca6ac0fe65', '#button-b6562c963d', '#separator-e8e691c190']
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
