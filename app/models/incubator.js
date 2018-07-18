import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  owner: DS.attr('string'),
  website: DS.attr('string'),
  github: DS.attr('string'),
  contact: DS.attr('string'),
  startups: DS.hasMany('startup', { async: false })
});
