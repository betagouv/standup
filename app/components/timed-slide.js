import Component from '@ember/component';

export default Component.extend({
  classNames: ['container'],

  click() {
    this.get('onClick')();
  }
});
