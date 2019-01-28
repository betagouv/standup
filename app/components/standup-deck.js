import { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { EKMixin, keyUp } from 'ember-keyboard';

export default Component.extend(EKMixin, {
  // Slide (60) + buffer (5)
  STARTUP_SLIDE_DURATION: 65,
  // Duration (65) - 15
  STARTUP_SLIDE_ENDS_SOON_AT: 50,
  // Slide (300) + buffer (15)
  META_SLIDE_TOTAL_DURATION: 315,
  // Duration (315) - 60
  META_SLIDE_ENDS_SOON_AT: 255,

  store: service(),
  hifi: service(),
  state: 'home',
  startupIndex: 0,
  incubatorIndex: 0,
  timer: null,
  elapsedSeconds: null,
  elapsedMinutes: null,

  actions: {
    goToNextSlide() {
      clearInterval(this.timer);

      switch (this.state) {
        case 'home':
          this.setTimerForState('startups');
          this.set('state', 'startups');
          break;
        case 'startups':
          if (this.startupIndex < this.startups.length - 1) {
            this.setTimerForState('startups');
            this.set('startupIndex', this.startupIndex + 1);
          } else {
            this.set('startupIndex', 0);
            // Go straight to meta
            this.setTimerForState('meta');
            this.set('state', 'meta');
          }
          break;
        case 'incubators':
          if (this.incubatorIndex < this.otherIncubators.length - 1) {
            this.setTimerForState('incubators');
            this.set('incubatorIndex', this.incubatorIndex + 1);
          } else {
            this.set('incubatorIndex', 0);
            this.setTimerForState('meta');
            this.set('state', 'meta');
          }
          break;
        case 'meta':
          clearInterval(this.timer);
          this.set('state', 'home');
          break;
      }
    },

    goToPreviousSlide() {
      clearInterval(this.timer);

      switch (this.state) {
        case 'startups':
          if (this.startupIndex === 0) {
            this.set('state', 'home');
          } else {
            this.setTimerForState('startups');
            this.set('startupIndex', this.startupIndex - 1);
          }
          break;
        case 'incubators':
          if (this.incubatorIndex === 0) {
            this.setTimerForState('startups');
            this.set('state', 'startups');
            this.set('startupIndex', this.startups.length - 1);
          } else {
            this.setTimerForState('incubators');
            this.set('incubatorIndex', this.incubatorIndex - 1);
          }
          break;
        case 'meta':
          this.setTimerForState('incubators');
          this.set('state', 'incubators');
          this.set('incubatorIndex', this.otherIncubators.length - 1);
          break;
      }
    }
  },

  /* eslint ember/no-on-calls-in-components:0 */
  activateKeyboard: on('init', function() {
    this.set('keyboardActivated', true);
  }),

  rightArrowWasPressed: on(keyUp('ArrowRight'), function() {
    this.send('goToNextSlide');
  }),

  leftArrowWasPressed: on(keyUp('ArrowLeft'), function() {
    this.send('goToPreviousSlide');
  }),

  setTimerForState(state) {
    let seconds;

    switch (state) {
      case 'startups':
        seconds = this.STARTUP_SLIDE_DURATION;
        break;
      case 'incubators':
        seconds = this.incubatorSlideDuration;
        break;
      case 'meta':
        seconds = this.META_SLIDE_DURATION;
        break;
    }

    let startTime = Date.parse(new Date());
    let endTime = this.endTime(seconds);
    let timer = setInterval(() => this.tick(state, startTime, endTime), 1000);

    this.set('timer', timer);
    this.tick(state, startTime, endTime);
  },

  tick(state, startTime, endTime) {
    let elapsedTime = this.getElapsedTime(startTime);
    this.set('elapsedSeconds', elapsedTime.seconds);
    this.set('elapsedMinutes', elapsedTime.minutes);

    if (Date.parse(new Date()) >= endTime) {
      this.hifi.play('assets/sounds/gong.mp3');
    }
  },

  shuffle(collection) {
    let currentIndex = collection.length,
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

  endTime(seconds) {
    let time = new Date();
    time.setSeconds(time.getSeconds() + seconds);

    return Date.parse(time);
  },

  getElapsedTime(startTime) {
    let time = Date.parse(new Date()) - startTime,
      seconds = Math.floor((time / 1000) % 60),
      minutes = Math.floor((time / 1000 / 60) % 60);

    return {
      minutes: minutes,
      seconds: seconds
    };
  },

  totalSlides: computed('startups', 'otherIncubators', function() {
    return this.startups.length + this.otherIncubators.length + 1;
  }),
  progress: computed('state', 'startupIndex', 'incubatorIndex', function() {
    var currentSlideNumber;

    switch (this.state) {
      case 'home':
        currentSlideNumber = 0;
        break;
      case 'startups':
        currentSlideNumber = this.startupIndex + 1;
        break;
      case 'incubators':
        currentSlideNumber = this.startups.length + this.incubatorIndex + 1;
        break;
      case 'meta':
        currentSlideNumber =
          this.startups.length + this.otherIncubators.length + 1;
        break;
    }

    return currentSlideNumber / this.totalSlides;
  }),
  eigIncubator: computed('model', function() {
    return this.store.peekRecord('incubator', 'eig');
  }),
  eigStartups: computed('model', function() {
    return this.model.filterBy('incubator', this.eigIncubator);
  }),
  startups: computed('combinedStartups', function() {
    return this.shuffle(this.eigStartups);
  }),
  currentStartup: computed('startups', 'startupIndex', function() {
    return this.startups[this.startupIndex];
  }),
  otherIncubators: computed('model', function() {
    return this.store
      .peekAll('incubator')
      .rejectBy('id', 'dinsic')
      .toArray();
  }),
  currentIncubator: computed('otherIncubators', 'incubatorIndex', function() {
    return this.otherIncubators[this.incubatorIndex];
  }),
  incubatorSlideDuration: computed('currentIncubator', function() {
    return 60 * this.currentIncubator.startups.length;
  }),
  incubatorSlideEndsSoonAt: computed('incubatorSlideDuration', function() {
    return this.incubatorSlideDuration - 30;
  }),
  title: computed('state', 'currentStartup', 'currentIncubator', function() {
    switch (this.state) {
      case 'startups':
        return this.currentStartup.name;
      case 'incubators':
        return this.currentIncubator.title;
      case 'meta':
        return 'Sujets transverses';
    }
  }),
  subtitle: computed('state', 'currentStartup', 'currentIncubator', function() {
    switch (this.state) {
      case 'startups':
        return this.currentStartup.pitch;
      case 'incubators':
        return this.currentIncubator.startups
          .rejectBy('status', 'death')
          .mapBy('name')
          .join(', ');
      case 'meta':
        return '';
    }
  }),
  formattedElapsedSeconds: computed('elapsedSeconds', function() {
    return ('00' + String(this.elapsedSeconds)).slice(-2);
  }),
  formattedElapsedMinutes: computed('elapsedMinutes', function() {
    return ('00' + String(this.elapsedMinutes)).slice(-2);
  }),
  isEndingSoon: computed('elapsedMinutes', 'elapsedSeconds', function() {
    let totalElapsedSeconds = this.elapsedMinutes * 60 + this.elapsedSeconds;

    switch (this.state) {
      case 'startups':
        return totalElapsedSeconds > this.STARTUP_SLIDE_ENDS_SOON_AT;
      case 'incubators':
        return totalElapsedSeconds > this.incubatorSlideEndsSoonAt;
      case 'meta':
        return totalElapsedSeconds > this.META_SLIDE_ENDS_SOON_AT;
    }
  }),
  nextSlideName: computed(
    'state',
    'startupIndex',
    'incubatorIndex',
    function() {
      switch (this.state) {
        case 'startups':
          if (this.startupIndex > this.startups.length - 2) {
            return this.otherIncubators[0].title;
          } else {
            return this.startups[this.startupIndex + 1].name;
          }
        case 'incubators':
          if (this.incubatorIndex > this.otherIncubators.length - 2) {
            return 'Sujets transverses';
          } else {
            return this.otherIncubators[this.incubatorIndex + 1].title;
          }
        case 'meta':
          return 'fin';
      }
    }
  )
});
