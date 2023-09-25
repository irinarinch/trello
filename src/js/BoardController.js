import swal from 'sweetalert';
import Card from './Card';
import Form from './Form';
import addElement from './addElement';
import closer from '../images/close.png';

export default class BoardController {
  constructor(list, dnd) {
    this.list = list;
    this.dnd = dnd;

    this.containers = document.querySelectorAll('.card-container');
  }

  init() {
    this.containers.forEach((container) => {
      const column = container.parentElement;
      const currentContainer = container;

      currentContainer.dataset.container = column.querySelector('.title').textContent;
    });

    this.render();

    document.addEventListener('submit', (e) => {
      if (e.target.closest('form')) {
        this.onsubmit(e);
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('.open-form')) {
        Form.open(e);
      }

      if (e.target.closest('.cancel-btn')) {
        Form.close(e);
      }

      if (e.target.closest('.remover')) {
        this.removeElement(e);
      }
    });

    document.addEventListener('mouseover', (e) => {
      if (!e.target.closest('.card')) return;

      const element = e.target.closest('.card');
      const image = document.createElement('img');
      image.src = closer;
      image.classList.add('remover');

      if (!element.querySelector('.remover')) {
        element.appendChild(image);
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (!e.target.closest('.card')) {
        const remover = e.target.querySelector('.remover');

        if (remover) {
          remover.parentElement.removeChild(remover);
        }
      }
    });

    document.documentElement.addEventListener('mousedown', this.dnd.onMouseDown);

    document.addEventListener('mouseup', (e) => {
      if (e.target.closest('.placeholder')) {
        const { movingItem } = this.dnd;
        const movingCard = this.getCard(movingItem);

        this.list.sort(movingCard, this.dnd.newDataset);

        this.render();
      }
    });
  }

  render() {
    this.clean();
    Object.keys(this.list.arrays).forEach((array) => {
      this.list.arrays[array].forEach((card) => {
        addElement(card, this.containers);
      });
    });
  }

  onsubmit(e) {
    e.preventDefault();

    const content = e.target.querySelector('textarea').value;
    const parent = e.target.parentElement;
    const container = parent.querySelector('.card-container');

    this.createCard(content, container.dataset.container);

    this.render();

    Form.close(e);
  }

  createCard(content, container) {
    if (content.trim().length > 0) {
      const newCard = new Card(content, container);
      this.list.add(newCard);
    } else {
      swal('Внимание', 'Карточка не может быть пустой', 'error');
    }
  }

  removeElement(e) {
    const card = this.getCard(e.target.parentElement);
    this.list.remove(card);
    this.render();
  }

  getCard(element) {
    const data = {
      container: element.dataset.container,
      index: element.dataset.index,
    };

    return this.list.getCard(data.container, data.index);
  }

  clean() {
    this.containers.forEach((item) => {
      item.replaceChildren();
    });
  }
}
