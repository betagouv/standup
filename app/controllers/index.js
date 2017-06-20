import Ember from 'ember';

export default Ember.Controller.extend({
  hifi: Ember.inject.service(),
  state: 'home',
  startupIndex: 0,
  timer: null,
  secondsLeft: null,
  minutesLeft: null,

  actions: {
    start: function() {
      this.setTimer();
      this.set('state', 'startups')
    },

    nextStartup: function() {
      clearInterval(this.get('timer'));

      if (this.get('startupIndex') < (this.get('startups.length') - 1)) {
        this.setTimer();
        this.set('startupIndex', this.get('startupIndex') + 1);
      } else {
        this.set('startupIndex', 0);
        this.set('state', 'home');
      }
    }
  },

  setTimer: function() {
    var endtime = this.endtime(65),
        timer = setInterval(function() { this.tick(endtime); }.bind(this), 1000);

    this.set('timer', timer);
    this.tick(endtime);
  },

  tick: function(endtime) {
    var remainingTime = this.getRemainingTime(endtime);
    this.set('secondsLeft', remainingTime.seconds);
    this.set('minutesLeft', remainingTime.minutes);

    if (remainingTime.total <= 0) {
      this.get('hifi').play('assets/sounds/gong.mp3');
      this.send('nextStartup');
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

  endtime: function(seconds) {
    var time = new Date();
    time.setSeconds(time.getSeconds() + seconds)

    return time;
  },

  getRemainingTime: function(endtime) {
    var time = Date.parse(endtime) - Date.parse(new Date()),
        seconds = Math.floor((time / 1000) % 60),
        minutes = Math.floor((time / 1000 / 60) % 60);

    return {
      'total': time,
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
  formattedSecondsLeft: Ember.computed('secondsLeft', function() {
    return ("00" + String(this.get('secondsLeft'))).slice(-2);
  }),
  formattedMinutesLeft: Ember.computed('minutesLeft', function() {
    return ("00" + String(this.get('minutesLeft'))).slice(-2);
  })
});
