import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('timed-slide', 'Integration | Component | timed slide', {
  integration: true
});

test('it renders', function(assert) {
  this.set('startupName',  'My startup name');
  this.set('startupPitch', 'Such pitch');
  this.set('remainingMinutes', '1');
  this.set('remainingSeconds', '59');

  this.render(hbs`
    {{timed-slide
      title=startupName
      subtitle=startupPitch
      formattedMinutesLeft=remainingMinutes
      formattedSecondsLeft=remainingSeconds}}
  `);

  assert.equal(this.$('.timed-slide__title').text().trim(),    'My startup name');
  assert.equal(this.$('.timed-slide__subtitle').text().trim(), 'Such pitch');
  assert.equal(this.$('.time-left').text().trim(),    '1:59');
});

test('it sends an action on click', function(assert) {
  let didReceiveAction = false;
  this.on('nextStartup', function() {
    didReceiveAction = true;
  });

  this.render(hbs`{{timed-slide next=(action "nextStartup")}}`);
  this.$('div').click();

  assert.ok(didReceiveAction);
});
