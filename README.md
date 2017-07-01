# standup

Standup is a simple web app that allows [beta.gouv.fr](https://beta.gouv.fr) to run its [weekly standup meetings](https://github.com/sgmap/beta.gouv.fr/wiki/Standup). It is deployed on Surge and available at http://stand-up.surge.sh/.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Ember CLI](https://ember-cli.com/) (with NPM)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* `cd standup`
* `npm install`
* `bower install` or `npm run bower -- install`

## Running / Development

* `ember server` or `npm run start`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `ember test` or `npm run test`
* `ember test --server` or `npm run test -- --server`

### Building

* `ember build` or `npm run build` (development)
* `ember build --environment production` or `npm run build -- --environment production` (production)

### Deploying

* `ember surge` or `npm run surge`
