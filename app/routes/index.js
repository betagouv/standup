import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    this.get('store').createRecord('startup', {
      id: 'openfisca',
      name: 'OpenFisca',
      pitch: 'Rendre le droit calculable',
      status: 'success',
      incubator: 'dinsic'
    });

    this.get('store').createRecord('startup', {
      id: 'alpha',
      name: 'Alpha',
      pitch: 'La 1ère formation à l\'innovation dans le secteur public basée sur la méthode Startups d\'État ',
      status: 'construction',
      incubator: 'dinsic'
    });

    return this.get('store').findAll('startup', { reload: true });
  }
});
