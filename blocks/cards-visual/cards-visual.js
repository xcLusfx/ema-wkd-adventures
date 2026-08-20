import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-visual-card';
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-visual-image';
      } else {
        div.className = 'cards-visual-body';
      }
    });

    // The last paragraph in the body acts as the timestamp/duration pill.
    const body = li.querySelector('.cards-visual-body');
    if (body) {
      const paragraphs = body.querySelectorAll('p');
      const last = paragraphs[paragraphs.length - 1];
      if (last && /^\d{1,2}:\d{2}$/.test(last.textContent.trim())) {
        last.classList.add('cards-visual-timestamp');
      }
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
    );
  });

  block.replaceChildren(ul);
}
