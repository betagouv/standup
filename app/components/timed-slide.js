import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['container'],

  click() {
    this.get('goToNextSlide')();
  }
});
