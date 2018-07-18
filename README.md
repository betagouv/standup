# standup

Standup is a simple web app that allows [beta.gouv.fr](https://beta.gouv.fr) to run its [weekly standup meetings](https://github.com/sgmap/beta.gouv.fr/wiki/Standup). It is deployed on Surge and available at http://stand-up.surge.sh/.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)

To run the websockets server, you'll additionally need:

* [Erlang](https://www.erlang.org/)
* [Elixir](https://elixir-lang.org/)

## Installation

* `git clone <repository-url>` this repository
* `cd standup`
* `yarn install`

### Websocket Server

* `cd wss`
* `mix deps.get`

## Running / Development

* `ember server` or `yarn start`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Websocket Server

* `cd wss`
* `mix phoenix.server`

## Linting

* `yarn lint:js`
* `yarn lint:js --fix`

## Running Tests

* `ember test` or `yarn test`
* `ember test --server` or `yarn test --server`

### Websocket Server

* `cd wss`
* `mix test`

## Building

* `ember build` or `yarn build` (development)
* `ember build --prod` or `yarn build --prod` (production)

### Websocket Server

* `cd wss`
* `mix compile`

## Deploying

* `ember surge` or `yarn surge`

### Websocket Server

* TODO
