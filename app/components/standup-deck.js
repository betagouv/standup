import Ember from 'ember';

export default Ember.Component.extend({
  hifi: Ember.inject.service(),
  state: 'home',
  startupIndex: 0,
  timer: null,
  elapsedSeconds: null,
  elapsedMinutes: null,

  actions: {
    start: function() {
      this.setTimerForState('startups');
      this.set('state', 'startups')
    },

    nextStartup: function() {
      clearInterval(this.get('timer'));

      if (this.get('startupIndex') < (this.get('startups.length') - 1)) {
        this.setTimerForState('startups');
        this.set('startupIndex', this.get('startupIndex') + 1);
      } else {
        this.set('startupIndex', 0);
        this.setTimerForState('meta');
        this.set('state', 'meta');
      }
    },

    goHome: function () {
      clearInterval(this.get('timer'));
      this.set('state', 'home');
    }
  },

  setTimerForState: function(state) {
    var seconds = state === 'startups' ? 65 : 315,
        startTime = Date.parse(new Date()),
        endTime = this.endTime(seconds),
        timer = setInterval(function() { this.tick(state, startTime, endTime); }.bind(this), 1000);

    this.set('timer', timer);
    this.tick(state, startTime, endTime);
  },

  tick: function(state, startTime, endTime) {
    var elapsedTime = this.getElapsedTime(startTime);
    this.set('elapsedSeconds', elapsedTime.seconds);
    this.set('elapsedMinutes', elapsedTime.minutes);

    if (Date.parse(new Date()) >= endTime) {
      this.get('hifi').play('assets/sounds/gong.mp3');
      if (state === 'startups') {
        this.send('nextStartup');
      } else {
        this.send('goHome');
      }
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

  endTime: function(seconds) {
    var time = new Date();
    time.setSeconds(time.getSeconds() + seconds)

    return Date.parse(time);
  },

  getElapsedTime: function(startTime) {
    var time = Date.parse(new Date()) - startTime,
        seconds = Math.floor((time / 1000) % 60),
        minutes = Math.floor((time / 1000 / 60) % 60);

    return {
      'minutes': minutes,
      'seconds': seconds
    };
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
  }),
  formattedElapsedSeconds: Ember.computed('elapsedSeconds', function() {
    return ("00" + String(this.get('elapsedSeconds'))).slice(-2);
  }),
  formattedElapsedMinutes: Ember.computed('elapsedMinutes', function() {
    return ("00" + String(this.get('elapsedMinutes'))).slice(-2);
  }),
  isEndingSoon: Ember.computed('elapsedMinutes', 'elapsedSeconds', function () {
    if (this.get('state') === 'startups') {
      return (this.get('elapsedMinutes') * 60 + this.get('elapsedSeconds')) > 50;
    } else {
      return (this.get('elapsedMinutes') * 60 + this.get('elapsedSeconds')) > 255;
    }
  })
});
