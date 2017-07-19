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
    if(event.key !== 'ArrowRight') { return; }
    this.get('next')();
  }
});
