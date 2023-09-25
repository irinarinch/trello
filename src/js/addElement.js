export default function addElement(card, containers) {
  const item = document.createElement('div');
  const content = document.createElement('div');

  item.dataset.container = card.container;
  item.dataset.index = card.index;

  content.textContent = card.content;

  item.appendChild(content);

  item.classList.add('card');

  containers.forEach((container) => {
    if (container.dataset.container === item.dataset.container) {
      container.appendChild(item);
    }
  });
}
