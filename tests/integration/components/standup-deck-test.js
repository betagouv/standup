import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('standup-deck', 'Integration | Component | standup deck', {
  integration: true
});

test('it renders the initial state', function(assert) {
  this.render(hbs`{{standup-deck model=null}}`);

  assert.equal(
    this.$('h1')
      .text()
      .trim(),
    'STAND-UP'
  );
  assert.equal(
    this.$('a')
      .text()
      .trim(),
    'COMMENCER'
  );
});
