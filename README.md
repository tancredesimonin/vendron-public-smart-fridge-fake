# Vendron Fake Smart Fridge Emulator

This repo is just a simple nodemon websocket server emulating the behaviour of a vendron smart fridge.

This has been very useful to locally test other code components and/or integrations instead of using real fridge to do so.

## Installation

1. `git clone git@github.com:tancredesimonin/vendron-public-smart-fridge-fake.git`
2. `npm i`
3. `npm run dev`
## Developer experience

- Quickly configure behaviour to mimic successful responses or errors
- Full logging experience

## Usage

Default behaviour will:

- respond to `check_state` events and close connection

**In the console:**

![check-state](/assets/check-state.PNG)

- respond to `smart_fridge_request` and keeps connection alive
- respond to `smart_fridge_door_open` and will mimic:
  - user takes a product
  - user takes another product
  - user replaces the last product
  - user takes another product
  - door closes
  - `smart_fridge_request_completed`

**In the console:**

![door-open](/assets/door-open.PNG)

## configure loading time between actions

In `server/config.ts` you'll find the `LOADING_TIME_MS` const you can tweak to better fit your needs in terms of speed between the flow steps.

### Mimic errors:

In `server/config.ts` you'll find a flow constant where you can set `sendSuccess` to `false` at the steps you want to mimic errors.
You'll be able to select the error you want to throw with the `errorToSend` being the index of the error list in `fakeData` const.

### Logging level:

In the `index.ts` line 19 you can configure the logging level wanted.

## Note / Contributing

This repo is far from perfectly reproducting the fridge behaviour but does the job.

If you want to use/contribute or want any support on vendron integration please [contact me on linkedin](https://www.linkedin.com/in/tancredesimonin/) or at tancrede-simonin@live.fr

## Related repo

Here you'll find my [Vendron Cloud Websocket to Rest API Adapter](https://github.com/tancredesimonin/vendron-cloud-rest-adapter) which aims at providing an API REST interface to the Vendron Smart Fridge Websocket API.