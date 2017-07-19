import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['container'],

  init() {
    this._super(...arguments);
    document.addEventListener('keyup', (event) => { this.keyUp(event); });
  },

  click() {
    this.get('next')();
  },

  keyUp(event) {
    switch (event.key) {
      case 'ArrowRight':
        this.get('next')();
        break;
      case 'ArrowLeft':
        this.get('previous')();
        break;
      default:
        break;
    }
  }
});
