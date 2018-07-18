import { union } from '@ember/object/computed';
import { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
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

export default Component.extend(EKMixin, {
  // Slide (60) + buffer (5)
  STARTUP_SLIDE_DURATION: 65,
  // Duration (65) - 15
  STARTUP_SLIDE_ENDS_SOON_AT: 50,
  // Slide (120) + buffer (10)
  INCUBATOR_SLIDE_DURATION: 130,
  // Duration (130) - 15
  INCUBATOR_SLIDE_ENDS_SOON_AT: 115,
  // Slide (300) + buffer (15)
  META_SLIDE_TOTAL_DURATION: 315,
  // Duration (315) - 60
  META_SLIDE_ENDS_SOON_AT: 255,

  hifi: service(),
  socket: service('websocket'),
  state: 'home',
  startupIndex: 0,
  incubatorIndex: 0,
  timer: null,
  elapsedSeconds: null,
  elapsedMinutes: null,

  actions: {
    goToNextSlide: function() {
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
            this.setTimerForState('incubators');
            this.set('state', 'incubators');
          }
          break;
        case 'incubators':
          if (this.get('incubatorIndex') < (this.get('groupedOtherIncubatorsStartups.length') - 1)) {
            this.setTimerForState('incubators');
            this.set('incubatorIndex', this.get('incubatorIndex') + 1);
          } else {
            this.set('incubatorIndex', 0);
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

    goToPreviousSlide: function() {
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
        case 'incubators':
          if (this.get('incubatorIndex') === 0) {
            this.setTimerForState('startups');
            this.set('state', 'startups');
            this.set('startupIndex', this.get('startups.length') - 1);
          } else {
            this.setTimerForState('incubators');
            this.set('incubatorIndex', this.get('incubatorIndex') - 1);
          }
          break;
        case 'meta':
          this.setTimerForState('startups');
          this.set('state', 'startups');
          this.set('incubatorIndex', this.get('groupedOtherIncubatorsStartups.length') - 1);
          break;
      }
    }
  },

  init: function () {
    this._super();
    this.get('socket').connect();
  },

  activateKeyboard: on('init', function() {
    this.set('keyboardActivated', true);
  }),

  rightArrowWasPressed: on(keyUp('ArrowRight'), function() {
    this.send('goToNextSlide');
  }),

  leftArrowWasPressed: on(keyUp('ArrowLeft'), function() {
    this.send('goToPreviousSlide');
  }),

  setTimerForState: function(state) {
    var seconds,
        startTime,
        endTime,
        timer;

    switch(state) {
      case 'startups':
        seconds = this.get('STARTUP_SLIDE_DURATION');
        break
      case 'incubators':
        seconds = this.get('INCUBATOR_SLIDE_DURATION');
        break
      case 'meta':
        seconds = this.get('META_SLIDE_DURATION');
        break
    }

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

  dinsicStartups: computed('model', function() {
    return this.get('model').filterBy('incubator', 'dinsic');
  }),
  activeDinsicStartups: computed('model', function() {
    return this.get('dinsicStartups').rejectBy('status', 'death');
  }),
  incubateurStartups: computed('activeDinsicStartups', function() {
    return this.get('activeDinsicStartups').rejectBy('status', 'consolidation');
  }),
  friendsStartups: computed('activeDinsicStartups', function() {
    return this.get('activeDinsicStartups')
      .filterBy('status', 'consolidation')
      .filter(function(startup) {
        return WHITELIST.indexOf(startup.get('id')) >= 0;
      });
  }),
  combinedStartups: union('incubateurStartups', 'friendsStartups'),
  startups: computed('combinedStartups', function() {
    return this.shuffle(this.get('combinedStartups'));
  }),
  currentStartup: computed('startups', 'startupIndex', function() {
    return this.get('startups')[this.get('startupIndex')];
  }),
  groupedOtherIncubatorsStartups: computed('model', function() {
    var otherIncubatorsStartups = this.get('model').rejectBy('incubator', 'dinsic'),
        otherIncubators = otherIncubatorsStartups.mapBy('incubator').uniq(),
        groupedIncubatorsStartups = [];

    otherIncubators.forEach(function(item) {
      groupedIncubatorsStartups.push({
        incubator: item,
        startups: otherIncubatorsStartups.filterBy('incubator', item)
      });
    });

    return groupedIncubatorsStartups;
  }),
  currentIncubator: computed('groupedOtherIncubatorsStartups', 'incubatorIndex', function() {
    return this.get('groupedOtherIncubatorsStartups')[this.get('incubatorIndex')];
  }),
  title: computed('state', 'currentStartup', 'currentIncubator', function() {
    switch(this.get('state')) {
      case 'startups':
        return this.get('currentStartup.name');
      case 'incubators':
        return this.get('currentIncubator.incubator');
      case 'meta':
        return "Sujets transverses";
    }
  }),
  subtitle: computed('state', 'currentStartup', 'currentIncubator', function() {
    switch(this.get('state')) {
      case 'startups':
        return this.get('currentStartup.pitch');
      case 'incubators':
        return this.get('currentIncubator.startups').mapBy('name').join(', ');
      case 'meta':
        return '';
    }
  }),
  formattedElapsedSeconds: computed('elapsedSeconds', function() {
    return ("00" + String(this.get('elapsedSeconds'))).slice(-2);
  }),
  formattedElapsedMinutes: computed('elapsedMinutes', function() {
    return ("00" + String(this.get('elapsedMinutes'))).slice(-2);
  }),
  isEndingSoon: computed('elapsedMinutes', 'elapsedSeconds', function () {
    var totalElapsedSeconds = this.get('elapsedMinutes') * 60 + this.get('elapsedSeconds');

    switch(this.get('state')) {
      case 'startups':
        return totalElapsedSeconds > this.get('STARTUP_SLIDE_ENDS_SOON_AT');
      case 'incubators':
        return totalElapsedSeconds > this.get('INCUBATOR_SLIDE_ENDS_SOON_AT');
      case 'meta':
        return totalElapsedSeconds > this.get('META_SLIDE_ENDS_SOON_AT');
    }
  }),
  nextSlideName: computed('state', 'startupIndex', 'incubatorIndex', function() {
    switch(this.get('state')) {
      case 'startups':
        if (this.get('startupIndex') > this.get('startups.length') - 2) {
          return this.get('groupedOtherIncubatorsStartups.firstObject.incubator');
        } else {
          return this.get('startups')[this.get('startupIndex') + 1].get('name');
        }
      case 'incubators':
          if (this.get('incubatorIndex') > this.get('groupedOtherIncubatorsStartups.length') - 2) {
          return 'Sujets transverses';
        } else {
          return this.get('groupedOtherIncubatorsStartups')[this.get('incubatorIndex') + 1].incubator;
        }
      case 'meta':
        return 'fin';
    }
  })
});
