/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".cmp-carousel__item");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".cmp-teaser__image img, .cmp-image__image");
      const heading = slide.querySelector(".cmp-teaser__title, h2, h1");
      const description = slide.querySelector(".cmp-teaser__description");
      const ctaLinks = slide.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a");
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      if (ctaLinks.length > 0) {
        ctaLinks.forEach((link) => contentCell.push(link));
      }
      const imageCell = img ? [img] : [];
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/teaser-featured.js
  function parse2(element, { document }) {
    const image = element.querySelector(".cmp-teaser__image img, .cmp-image__image");
    const pretitle = element.querySelector(".cmp-teaser__pretitle");
    const heading = element.querySelector(".cmp-teaser__title, h2");
    const description = element.querySelector(".cmp-teaser__description");
    const ctaLinks = Array.from(
      element.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a")
    );
    const contentCell = [];
    if (pretitle) contentCell.push(pretitle);
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
    const cells = [];
    if (image) {
      cells.push([image, contentCell]);
    } else {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "teaser-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/teaser-adventure.js
  function parse3(element, { document }) {
    const image = element.querySelector(".cmp-teaser__image .cmp-image__image, .cmp-teaser__image img");
    const heading = element.querySelector(".cmp-teaser__title, .cmp-teaser__content h2, .cmp-teaser__content h1");
    const description = element.querySelector(".cmp-teaser__description");
    const ctaLinks = Array.from(
      element.querySelectorAll(".cmp-teaser__action-container a.cmp-teaser__action-link, .cmp-teaser__action-container a")
    );
    const contentCell = [];
    if (heading) {
      contentCell.push(heading);
    }
    if (description) {
      contentCell.push(description);
    }
    ctaLinks.forEach((link) => {
      contentCell.push(link);
    });
    const cells = [];
    if (image) {
      cells.push([image, contentCell]);
    } else {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "teaser-adventure", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse4(element, { document }) {
    const items = element.querySelectorAll('.cmp-image-list__item, li[class*="image-list"]');
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".cmp-image__image, .cmp-image-list__item-image img, article img");
      const titleLink = item.querySelector('a.cmp-image-list__item-title-link, a[class*="title-link"]');
      const description = item.querySelector('.cmp-image-list__item-description, span[class*="description"]');
      const imageCell = [];
      if (img) {
        const imageLink = item.querySelector('a.cmp-image-list__item-image-link, a[class*="image-link"]');
        if (imageLink) {
          const linkEl = document.createElement("a");
          linkEl.href = imageLink.href;
          linkEl.appendChild(img.cloneNode(true));
          imageCell.push(linkEl);
        } else {
          imageCell.push(img);
        }
      }
      const contentCell = [];
      if (titleLink) {
        contentCell.push(titleLink);
      }
      if (description) {
        contentCell.push(description);
      }
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell.length > 0 ? imageCell : "", contentCell.length > 0 ? contentCell : ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "#toggleNav",
        "#mobileNav",
        "noscript",
        "link"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.experiencefragment",
        "footer.experiencefragment"
      ]);
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.parentElement.insertBefore(sectionMetadata, sectionEl.nextSibling);
        }
        if (section !== sections[0]) {
          const hr = document.createElement("hr");
          sectionEl.parentElement.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "teaser-featured": parse2,
    "teaser-adventure": parse3,
    "cards-article": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "WKND Adventures homepage with hero carousel, featured article teaser, recent articles grid, and next adventures section",
    urls: [
      "https://wknd.site/us/en.html"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".carousel.cmp-carousel--hero"]
      },
      {
        name: "teaser-featured",
        instances: [".teaser.cmp-teaser--featured"]
      },
      {
        name: "cards-article",
        instances: ["#container-9c4899b718 .image-list.list", "#container-4d3fed64ff .image-list.list"]
      },
      {
        name: "teaser-adventure",
        instances: [".teaser.cmp-teaser--hero.cmp-teaser--imagebottom"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Carousel",
        selector: ".carousel.cmp-carousel--hero",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2-content",
        name: "Featured Content",
        selector: "main.cmp-layout-container--fixed #container-9c4899b718",
        style: null,
        blocks: ["teaser-featured", "cards-article"],
        defaultContent: ["#title-c2d2b28d00", "#button-2e6d32893a", "#separator-bd766ae5bf", "#title-971080d74b"]
      },
      {
        id: "section-3-adventure-teaser",
        name: "Adventure Teaser",
        selector: ".teaser.cmp-teaser--hero.cmp-teaser--imagebottom",
        style: null,
        blocks: ["teaser-adventure"],
        defaultContent: []
      },
      {
        id: "section-4-adventures",
        name: "Adventures Grid",
        selector: "main.cmp-layout-container--fixed #container-4d3fed64ff",
        style: null,
        blocks: ["cards-article"],
        defaultContent: ["#title-ca6ac0fe65", "#button-b6562c963d", "#separator-e8e691c190"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
