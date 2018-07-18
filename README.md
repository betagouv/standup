# standup

Standup is a simple web app that allows [beta.gouv.fr](https://beta.gouv.fr) to run its [weekly standup meetings](https://github.com/sgmap/beta.gouv.fr/wiki/Standup). It is deployed on Surge and available at http://stand-up.surge.sh/.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)

## Installation

* `git clone <repository-url>` this repository
* `cd standup`
* `yarn install`

## Running / Development

* `ember server` or `yarn start`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

## Linting

* `yarn lint:js`
* `yarn lint:js --fix`

## Running Tests

* `ember test` or `yarn test`
* `ember test --server` or `yarn test --server`

## Building

* `ember build` or `yarn build` (development)
* `ember build --prod` or `yarn build --prod` (production)

## Deploying

* `ember surge` or `yarn surge`
