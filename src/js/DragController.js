export default class DragController {
  constructor() {
    this.dragging = false;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  getItemDomRect(e) {
    const rect = this.movingItem.getBoundingClientRect();

    return {
      shiftY: e.clientY - rect.top,
      shiftX: e.clientX - rect.left,
      width: rect.width,
      height: rect.height,
    };
  }

  onMouseDown(e) {
    e.preventDefault();
    if (e.target.closest('.card')) {
      this.movingItem = e.target.closest('.card');
      this.remover = this.movingItem.querySelector('img');

      this.rect = this.getItemDomRect(e);

      document.documentElement.addEventListener('mousemove', this.onMouseMove);
      document.documentElement.addEventListener('mouseup', this.onMouseUp);
    }
  }

  onMouseMove(e) {
    if (!this.dragging) {
      this.dragging = true;
      this.addPlaceholder(this.movingItem);

      this.movingItem.classList.add('dragged');
    }

    this.moveItem(e);
    this.movingItem.classList.add('hidden');
    this.elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    this.movingItem.classList.remove('hidden');

    if (!this.elemBelow) return;

    this.movePlaceholder(e);
  }

  moveItem(e) {
    this.movingItem.style.top = `${e.clientY - this.rect.shiftY}px`;
    this.movingItem.style.left = `${e.clientX - this.rect.shiftX}px`;
    this.movingItem.style.width = `${this.rect.width}px`;

    this.movingItem.appendChild(this.remover);
  }

  onMouseUp() {
    document.documentElement.removeEventListener('mousemove', this.onMouseMove);

    if (!this.dragging) return;

    this.movingItem.classList.remove('dragged');

    this.dragging = false;

    this.newDataset = {
      container: this.placeholder.dataset.container,
      index: this.placeholder.dataset.index,
    };

    this.placeholder.parentElement.removeChild(this.placeholder);
  }

  addPlaceholder(item) {
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');

    item.parentNode.insertBefore(placeholder, item);

    this.placeholder = placeholder;
    this.placeholder.style.height = `${this.rect.height}px`;

    this.placeholder.dataset.container = item.dataset.container;
    this.placeholder.dataset.index = item.dataset.index;
  }

  fillEmptyContainer() {
    const column = this.elemBelow.closest('.column');
    if (!column) return;

    const container = column.querySelector('.card-container');
    const item = document.createElement('div');
    item.classList.add('card', 'empty');

    if (container.children.length < 1) {
      container.append(item);
      item.dataset.container = container.dataset.container;
      item.dataset.index = 0;
    }
  }

  getCenterCoordinates(element) {
    const rect = element.getBoundingClientRect();
    this.center = {
      top: rect.top + rect.height / 2,
      left: rect.left + rect.width / 2,
    };
    return this.center;
  }

  movePlaceholder(e) {
    this.fillEmptyContainer();

    this.droppableBelow = this.elemBelow.closest('.card');
    if (!this.droppableBelow) return;

    const center = this.getCenterCoordinates(this.droppableBelow);

    if (e.clientY < center.top || this.droppableBelow.classList.contains('empty')) {
      this.droppableBelow.parentNode.insertBefore(this.placeholder, this.droppableBelow);
      this.placeholder.dataset.index = this.droppableBelow.dataset.index;
    } else {
      this.droppableBelow.parentNode.insertBefore(
        this.placeholder,
        this.droppableBelow.nextElementSibling,
      );
      this.placeholder.dataset.index = this.droppableBelow.dataset.index + 1;
    }

    this.placeholder.dataset.container = this.droppableBelow.dataset.container;

    if (document.querySelector('.empty')) {
      document.querySelector('.empty').style.position = 'absolute';
    }
  }
}
