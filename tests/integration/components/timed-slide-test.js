import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('timed-slide', 'Integration | Component | timed slide', {
  integration: true
});

test('it renders', function(assert) {
  this.set('startupName', 'My startup name');
  this.set('startupPitch', 'Such pitch');
  this.set('elapsedMinutes', '1');
  this.set('elapsedSeconds', '59');
  this.set('nextSlideName', 'Next startup');

  this.render(hbs`
    {{timed-slide
      title=startupName
      subtitle=startupPitch
      formattedElapsedMinutes=elapsedMinutes
      formattedElapsedSeconds=elapsedSeconds
      nextSlideName=nextSlideName}}
  `);

  assert.equal(
    this.$('.timed-slide__title')
      .text()
      .trim(),
    'My startup name'
  );
  assert.equal(
    this.$('.timed-slide__subtitle')
      .text()
      .trim(),
    'Such pitch'
  );
  assert.equal(
    this.$('.elapsed-time')
      .text()
      .trim(),
    '1:59'
  );
  assert.equal(
    this.$('.next-slide')
      .text()
      .trim(),
    'Suivant : Next startup'
  );
});

test('it renders correctly when isEndingSoon is true', function(assert) {
  this.set('isEndingSoon', true);

  this.render(hbs`
    {{timed-slide
      isEndingSoon=isEndingSoon}}
  `);

  assert.equal(this.$('.elapsed-time').hasClass('ending-soon'), true);
});

test('it sends an action on click', function(assert) {
  let didReceiveAction = false;
  this.on('nextStartup', function() {
    didReceiveAction = true;
  });

  this.render(hbs`{{timed-slide onClick=(action "nextStartup")}}`);
  this.$('div').click();

  assert.ok(didReceiveAction);
});
