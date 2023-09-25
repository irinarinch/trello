export default class ListOfCards {
  constructor() {
    this.arrays = JSON.parse(window.localStorage.getItem('list')) || {};
  }

  add(card) {
    if (!this.arrays[card.container]) {
      this.arrays[card.container] = [];
    }
    const currentCard = card;

    currentCard.index = this.arrays[currentCard.container].push(card) - 1;

    window.localStorage.setItem('list', JSON.stringify(this.arrays));
  }

  remove(card) {
    const [removed] = this.arrays[card.container].splice(card.index, 1);

    if (card.container.length > 0) {
      this.assaignNewIndexes(card.container);
    }

    window.localStorage.setItem('list', JSON.stringify(this.arrays));
    return removed;
  }

  sort(card, newDataset) {
    if (card.container === newDataset.container) {
      this.remove(card);
      this.arrays[card.container].splice(newDataset.index, 0, card);
      this.assaignNewIndexes(card.container);
    } else {
      const removedCard = this.remove(card);
      const editedCard = this.edit(removedCard, newDataset);

      if (!this.arrays[newDataset.container]) {
        this.add(editedCard);
      } else {
        this.arrays[newDataset.container].splice(editedCard.index, 0, editedCard);
        this.assaignNewIndexes(newDataset.container);
      }
    }

    window.localStorage.setItem('list', JSON.stringify(this.arrays));
  }

  assaignNewIndexes(currentContainer) {
    this.arrays[currentContainer].forEach((card) => {
      const currentCard = card;
      currentCard.index = this.getIndex(currentCard);
    });
  }

  getIndex(card) {
    return this.arrays[card.container].findIndex((item) => item === card);
  }

  getCard(container, index) {
    return this.arrays[container][index];
  }

  edit(card, newDataset) {
    this.editedCard = card;
    this.editedCard.container = newDataset.container;
    this.editedCard.index = Number(newDataset.index);

    return this.editedCard;
  }
}
