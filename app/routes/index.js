import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    this.store.createRecord('startup', {
      id: 'openfisca',
      name: 'OpenFisca',
      pitch: 'Rendre le droit calculable',
      status: 'success',
      incubator: 'dinsic'
    });

    this.store.createRecord('startup', {
      id: 'alpha',
      name: 'Alpha',
      pitch:
        "La 1ère formation à l'innovation dans le secteur public basée sur la méthode Startups d'État ",
      status: 'construction',
      incubator: 'dinsic'
    });

    return this.store.findAll('startup', { reload: true });
  }
});
