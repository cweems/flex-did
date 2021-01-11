# Flex Direct Inward Dial

![Screen Shot 2021-01-10 at 10 59 37 PM](https://user-images.githubusercontent.com/1418949/104153583-9468df00-5397-11eb-965f-43e41040917f.png)

Creates a Direct Inward Dial (DID) setup for Twilio Flex. Each agent can be assigned a number, and calls to that number will go directly to that agent. Outbound calls will come from that agent's assigned number.

![Screen Shot 2021-01-10 at 11 02 48 PM](https://user-images.githubusercontent.com/1418949/104153867-4e604b00-5398-11eb-8bbc-d3cb66236532.png)

## Setup

Flex DID configures inbound phone numbers with a Studio Flow and TaskRouter Workflow that matches tasks to workers using a shared `phone_number` attribute.

Not supported or maintained by Twilio. MIT License.

### Initial setup

```shell
$ git clone https://github.com/cweems/flex-did.git
$ cd flex-did
$ npm install
$ cp .env.example .env

# Add your Twilio API Key and Secret to .env
```

### Twilio Account Configuration

Twilio Account configuration in one command:

```shell
$ npm run flex-did-setup-all
```

Run each command separately:

```shell
$ buy-numbers
$ workflow-setup
$ studio-setup
$ update-numbers
```

### Agent Attribute / SSO Configuration

Add a `phone_number` attribute to one of your TaskRouter workers with an e.164 phone number. Or, configure your SSO system to provide the `phone_number` attribute when an agent logs in.

### Twilio Flex Plugin Testing and Deployment

From the `flex-did` directory, run the following to start your dev environment:

```shell
$ cd plugin-flex-did
$ npm install
$ twilio flex:plugins:start
```

To deploy the plugin, run:

```shell
$ twilio flex:plugins:deploy --changelog "Deploying flex-did"

$ twilio flex:plugins:release --plugin plugin-flex-did@0.0.1 --name "Flex DID" --description "Provides direct inward dial functionality."
```
