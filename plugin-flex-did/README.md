# Flex DID Plugin

The Flex DID plugin provides two features:

-   Agents can see their assigned phone number (`worker.phone_number`)
-   Agents can initiate calls from their assigned phone number

![Screen Shot 2021-01-10 at 11 02 48 PM](https://user-images.githubusercontent.com/1418949/104153867-4e604b00-5398-11eb-8bbc-d3cb66236532.png)

## Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards, install the dependencies by running `npm install`:

```bash
$ npm install
```

## Development

In order to develop locally, you can use the Webpack Dev Server by running:

```bash
$ twilio flex:plugins:start
```

This will automatically start up the Webpack Dev Server and open the browser for you. Your app will run on `http://localhost:3000`. If you want to change that you can do this by setting the `PORT` environment variable:

```bash
PORT=3001 npm start
```

When you make changes to your code, the browser window will be automatically refreshed.

## Deploy

When you are ready to deploy your plugin, in your terminal run:

```bash
$ twilio flex:plugins:deploy --changelog "Deploying flex-did"

$ twilio flex:plugins:release --plugin plugin-flex-did@0.0.1 --name "Flex DID" --description "Provides direct inward dial functionality."
```

For more details on deploying your plugin, refer to the [deploying your plugin guide](https://www.twilio.com/docs/flex/plugins#deploying-your-plugin).

Note: Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex to provide them globally.
