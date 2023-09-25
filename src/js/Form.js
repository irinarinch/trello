export default class Form {
  static open(e) {
    e.target.closest('.open-form-btn').classList.add('hidden');

    const container = e.target.closest('.column');

    container.querySelector('.form').classList.remove('hidden');
    container.querySelector('textarea').focus();
  }

  static close(e) {
    const container = e.target.closest('.column');
    const form = e.target.closest('.form');

    form.classList.add('hidden');
    form.reset();
    container.querySelector('.open-form-btn').classList.remove('hidden');
  }
}
