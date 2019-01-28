import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  host: 'https://eig-standup.antoine-augusti.fr',
  namespace: '',

  pathForType: function(type) {
    return this._super(type) + '.json';
  }
});
