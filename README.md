# standup

Standup is a simple web app that allows [beta.gouv.fr](https://beta.gouv.fr) to run its [weekly standup meetings](https://github.com/sgmap/beta.gouv.fr/wiki/Standup). It is deployed on Surge and available at http://stand-up.surge.sh/.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Ember CLI](https://ember-cli.com/) (with NPM)
* [PhantomJS](http://phantomjs.org/)

To run the websockets server, you'll additionally need:

* [Erlang](https://www.erlang.org/)
* [Elixir](https://elixir-lang.org/)

## Installation

* `git clone <repository-url>` this repository
* `cd standup`
* `npm install`
* `bower install` or `npm run bower -- install`

### Websocket Server

* `cd wss`
* `mix deps.get`

## Running / Development

* `ember server` or `npm run start`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Websocket Server

* `cd wss`
* `mix phoenix.server`

## Running Tests

* `ember test` or `npm test`
* `ember test --server` or `npm run test -- --server`

### Websocket Server

* `cd wss`
* `mix test`

## Building

* `ember build` or `npm run build` (development)
* `ember build --environment production` or `npm run build -- --environment production` (production)

### Websocket Server

* `cd wss`
* `mix compile`

## Deploying

* `ember surge` or `npm run surge`

### Websocket Server

* TODO
