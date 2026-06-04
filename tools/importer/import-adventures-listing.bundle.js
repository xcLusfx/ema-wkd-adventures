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

  // tools/importer/import-adventures-listing.js
  var import_adventures_listing_exports = {};
  __export(import_adventures_listing_exports, {
    default: () => import_adventures_listing_default
  });

  // tools/importer/parsers/teaser-adventure.js
  function parse(element, { document }) {
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

  // tools/importer/parsers/tabs-adventure.js
  function parse2(element, { document }) {
    const cmpTabs = element.querySelector(".cmp-tabs");
    const container = cmpTabs || element;
    const tabItems = Array.from(container.querySelectorAll("ol.cmp-tabs__tablist > li.cmp-tabs__tab"));
    const tabPanels = Array.from(container.querySelectorAll(":scope > .cmp-tabs__tabpanel"));
    const cells = [];
    tabItems.forEach((tabItem, index) => {
      const tabLabel = tabItem.textContent.trim();
      const panel = tabPanels[index];
      const contentContainer = document.createElement("div");
      if (panel) {
        const adventureItems = Array.from(panel.querySelectorAll("li.cmp-image-list__item"));
        adventureItems.forEach((item) => {
          const article = item.querySelector("article");
          if (!article) return;
          const img = article.querySelector("img.cmp-image__image");
          const imageLink = article.querySelector("a.cmp-image-list__item-image-link");
          const titleLink = article.querySelector("a.cmp-image-list__item-title-link");
          const titleText = article.querySelector(".cmp-image-list__item-title");
          const description = article.querySelector(".cmp-image-list__item-description");
          const itemDiv = document.createElement("div");
          if (img && imageLink) {
            const imgLink = document.createElement("a");
            imgLink.href = imageLink.href;
            const imgClone = img.cloneNode(true);
            imgLink.appendChild(imgClone);
            itemDiv.appendChild(imgLink);
          } else if (img) {
            itemDiv.appendChild(img.cloneNode(true));
          }
          if (titleLink && titleText) {
            const p = document.createElement("p");
            const link = document.createElement("a");
            link.href = titleLink.href;
            link.textContent = titleText.textContent.trim();
            p.appendChild(link);
            itemDiv.appendChild(p);
          }
          if (description) {
            const descP = document.createElement("p");
            descP.textContent = description.textContent.trim();
            itemDiv.appendChild(descP);
          }
          contentContainer.appendChild(itemDiv);
        });
      }
      cells.push([tabLabel, contentContainer]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-adventure", cells });
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

  // tools/importer/import-adventures-listing.js
  var parsers = {
    "teaser-adventure": parse,
    "tabs-adventure": parse2
  };
  var PAGE_TEMPLATE = {
    name: "adventures-listing",
    description: "Adventures listing page with hero teaser and filterable tabbed adventure cards",
    urls: ["https://wknd.site/us/en/adventures.html"],
    blocks: [
      {
        name: "teaser-adventure",
        instances: [".teaser.cmp-teaser--hero"]
      },
      {
        name: "tabs-adventure",
        instances: [".tabs.panelcontainer"]
      }
    ],
    sections: [
      {
        id: "section-1-title",
        name: "Page Title",
        selector: "main.cmp-layout-container--fixed:first-of-type",
        style: null,
        blocks: [],
        defaultContent: ["h1"]
      },
      {
        id: "section-2-hero",
        name: "Hero Teaser",
        selector: ".teaser.cmp-teaser--hero",
        style: null,
        blocks: ["teaser-adventure"],
        defaultContent: []
      },
      {
        id: "section-3-adventures",
        name: "Adventures Grid",
        selector: "main.cmp-layout-container--fixed:last-of-type",
        style: null,
        blocks: ["tabs-adventure"],
        defaultContent: ["h2.cmp-title__text"]
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
  var import_adventures_listing_default = {
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
  return __toCommonJS(import_adventures_listing_exports);
})();
