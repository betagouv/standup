import Route from '@ember/routing/route';

const EXTRA_STARTUPS = [
  {
    id: 'openfisca',
    type: 'startup',
    attributes: {
      name: 'OpenFisca',
      pitch: 'Transformer la loi en code, puis le code en loi',
      status: 'success'
    },
    relationships: {
      incubator: {
        data: {
          type: 'incubator',
          id: 'dinsic'
        }
      }
    }
  },
  {
    id: 'alpha',
    type: 'startup',
    attributes: {
      name: 'Alpha',
      pitch:
        "La 1re formation à l'innovation dans le secteur public basée sur la méthode Startups d'État",
      status: 'construction'
    },
    relationships: {
      incubator: {
        data: {
          type: 'incubator',
          id: 'dinsic'
        }
      }
    }
  },
  {
    id: 'demarches-simplifiees.fr',
    type: 'startup',
    attributes: {
      name: 'demarches-simplifiees.fr',
      pitch: 'Dématérialiser n’importe quelle démarche administrative en quelques minutes',
      status: 'consolidation'
    },
    relationships: {
      incubator: {
        data: {
          type: 'incubator',
          id: 'dinsic'
        }
      }
    }
  },
];

export default Route.extend({
  model() {
    this.store.push({ data: EXTRA_STARTUPS });

    return this.store.findAll('startup', { reload: true });
  }
});
