import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Optimize an authored background image (first picture), if present.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(
      img.src,
      img.alt,
      true,
      [{ width: '2000' }],
    );
    img.closest('picture').replaceWith(optimized);
  });

  // Collect the authored content (headings, text, CTA) — everything that is
  // not the background picture — and place it inside a circular ring/seal.
  const content = document.createElement('div');
  content.className = 'hero-epoch-content';

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) {
        // leave the background picture as a direct child of the block
        block.append(cell.querySelector('picture'));
        return;
      }
      while (cell.firstElementChild) content.append(cell.firstElementChild);
    });
    row.remove();
  });

  const ring = document.createElement('div');
  ring.className = 'hero-epoch-ring';
  ring.append(content);
  block.append(ring);
}
