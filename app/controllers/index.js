import Ember from 'ember';

export default Ember.Controller.extend({
  state: 'home',
  startupIndex: 0,

  actions: {
    start: function() {
      this.set('state', 'startups')
    },

    nextStartup: function() {
      this.set('startupIndex', this.get('startupIndex') + 1);
    }
  },

  shuffle: function(collection) {
    var currentIndex = collection.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = collection[currentIndex];
      collection[currentIndex] = collection[randomIndex];
      collection[randomIndex] = temporaryValue;
    }

    return collection;
  },

  activeStartups: Ember.computed('model', function() {
    return this.get('model').rejectBy('status', 'death')
  }),
  incubateurStartups: Ember.computed('activeStartups', function() {
    return this.get('activeStartups').rejectBy('status', 'success')
  }),
  friendsStartups: Ember.computed.filterBy('activeStartups', 'status', 'success'),
  shuffledIncubateurStartups: Ember.computed('incubateurStartups', function() {
    return this.shuffle(this.get('incubateurStartups'));
  }),
  startups: Ember.computed.union('shuffledIncubateurStartups', 'friendsStartups'),
  currentStartup: Ember.computed('startups', 'startupIndex', function() {
    return this.get('startups')[this.get('startupIndex')];
  })
});
