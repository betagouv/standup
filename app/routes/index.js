import Route from '@ember/routing/route';

const EXTRA_STARTUPS = [];

export default Route.extend({
  model() {
    this.store.push({ data: EXTRA_STARTUPS });

    return this.store.findAll('startup', { reload: true });
  }
});
