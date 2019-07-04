import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  host: 'https://standup.eig-forever.org',
  namespace: '',

  pathForType: function(type) {
    return this._super(type) + '.json';
  }
});
