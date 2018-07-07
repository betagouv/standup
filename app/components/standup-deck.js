import Ember from 'ember';
import { EKMixin, keyUp } from 'ember-keyboard';

const WHITELIST = [
  'api-entreprise',
  'api-geo',
  'ban',
  'data.gouv.fr',
  'geo.data.gouv.fr',
  'openfisca',
  'alpha'
];

export default Ember.Component.extend(EKMixin, {
  // Slide (60) + buffer (5)
  STARTUP_SLIDE_DURATION: 65,
  // Duration (65) - 15
  STARTUP_SLIDE_ENDS_SOON_AT: 50,
  // Slide (300) + buffer (15)
  META_SLIDE_TOTAL_DURATION: 315,
  // Duration (315) - 60
  META_SLIDE_ENDS_SOON_AT: 255,

  hifi: Ember.inject.service(),
  socket: Ember.inject.service('websocket'),
  state: 'home',
  startupIndex: 0,
  timer: null,
  elapsedSeconds: null,
  elapsedMinutes: null,

  actions: {
    nextSlide: function() {
      clearInterval(this.get('timer'));

      switch(this.get('state')) {
        case 'home':
          this.setTimerForState('startups');
          this.set('state', 'startups');
          break;
        case 'startups':
          if (this.get('startupIndex') < (this.get('startups.length') - 1)) {
            this.setTimerForState('startups');
            this.set('startupIndex', this.get('startupIndex') + 1);
          } else {
            this.set('startupIndex', 0);
            this.setTimerForState('meta');
            this.set('state', 'meta');
          }
          break;
        case 'meta':
          clearInterval(this.get('timer'));
          this.set('state', 'home');
          break;
      }
    },

    previousSlide: function() {
      clearInterval(this.get('timer'));

      switch(this.get('state')) {
        case 'startups':
          if (this.get('startupIndex') === 0) {
            this.set('state', 'home');
          } else {
            this.setTimerForState('startups');
            this.set('startupIndex', this.get('startupIndex') - 1);
          }
          break;
        case 'meta':
          this.setTimerForState('startups');
          this.set('state', 'startups');
          this.set('startupIndex', this.get('startups.length') - 1);
          break;
      }
    }
  },

  init: function () {
    this._super();
    this.get('socket').connect();
  },

  activateKeyboard: Ember.on('init', function() {
    this.set('keyboardActivated', true);
  }),

  rightArrowWasPressed: Ember.on(keyUp('ArrowRight'), function() {
    this.send('nextSlide');
  }),

  leftArrowWasPressed: Ember.on(keyUp('ArrowLeft'), function() {
    this.send('previousSlide');
  }),

  setTimerForState: function(state) {
    var seconds = state === 'startups' ? this.get('STARTUP_SLIDE_DURATION') : this.get('META_SLIDE_DURATION'),
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
    return this.get('activeStartups').rejectBy('status', 'consolidation')
  }),
  friendsStartups: Ember.computed('activeStartups', function() {
    return this.get('activeStartups').filter(function(startup) {
      return startup.get('status') === 'consolidation' && WHITELIST.indexOf(startup.get('id')) >= 0;
    });
  }),
  combinedStartups: Ember.computed.union('incubateurStartups', 'friendsStartups'),
  startups: Ember.computed('combinedStartups', function() {
    return this.shuffle(this.get('combinedStartups'));
  }),
  currentStartup: Ember.computed('startups', 'startupIndex', function() {
    return this.get('startups')[this.get('startupIndex')];
  }),
  title: Ember.computed('state', 'currentStartup', function() {
    switch(this.get('state')) {
      case 'startups':
        return this.get('currentStartup.name');
      case 'meta':
        return "Sujets transverses";
    }
  }),
  subtitle: Ember.computed('state', 'currentStartup', function() {
    switch(this.get('state')) {
      case 'startups':
        return this.get('currentStartup.pitch');
      case 'meta':
        return '';
    }
  }),
  formattedElapsedSeconds: Ember.computed('elapsedSeconds', function() {
    return ("00" + String(this.get('elapsedSeconds'))).slice(-2);
  }),
  formattedElapsedMinutes: Ember.computed('elapsedMinutes', function() {
    return ("00" + String(this.get('elapsedMinutes'))).slice(-2);
  }),
  isEndingSoon: Ember.computed('elapsedMinutes', 'elapsedSeconds', function () {
    if (this.get('state') === 'startups') {
      return (this.get('elapsedMinutes') * 60 + this.get('elapsedSeconds')) > this.get('STARTUP_SLIDE_ENDS_SOON_AT');
    } else {
      return (this.get('elapsedMinutes') * 60 + this.get('elapsedSeconds')) > this.get('META_SLIDE_ENDS_SOON_AT');
    }
  }),
  nextSlide: Ember.computed('state', 'startupIndex', function() {
    if (this.get('state') === 'startups') {
      if (this.get('startupIndex') > this.get('startups.length') - 2) {
        return 'Sujets transverses';
      } else {
        return this.get('startups')[this.get('startupIndex') + 1].get('name');
      }
    } else {
      return 'fin';
    }
  })
});
