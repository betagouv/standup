import Ember from 'ember';

export default Ember.Controller.extend({
  state: 'home',

  actions: {
    start: function() {
      this.set('state', 'startups')
    }
  }
});
