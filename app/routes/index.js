import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    this.get('store').createRecord('startup', {
      id: 'openfisca',
      name: 'OpenFisca',
      pitch: 'Rendre le droit calculable',
      status: 'success'
    }, {
      id: 'alpha',
      name: 'Alpha',
      pitch: '',
      status: 'construction'
    });

    return this.get('store').findAll('startup', { reload: true });
  }
});
