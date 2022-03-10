import express, { Express } from "express";
import * as http from "http";
import next from "next";
import { WebSocketServer } from "ws";
import {
  fakeData,
  flow,
  knownCommands,
  LOADING_TIME_MS,
  purchasedProducts,
} from "./config";
import { Logger } from "./logger";

const port: number = parseInt(process.env.PORT || "3000", 10);
const dev: boolean = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const messageLogger = new Logger({
  name: "ws",
  level: "debug",
  logTimestamp: false,
});

nextApp.prepare().then(async () => {
  const app: Express = express();
  const server: http.Server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  wss.on("connection", function connection(ws) {
    ws.on("message", (data) => {

      /**
       * Catch-all message
       */
      const string = data.toString();
      const json = JSON.parse(string);
      messageLogger.debug("data received:", json);

      /**
       * Catch configuration error in received payload
       */
      if (!json.ref) {
        messageLogger.error("Missing property ref in request payload");
      }
      if (!json.command) {
        messageLogger.error("Missing property command in request payload");
      }
      if (!json.command_data) {
        messageLogger.error("Missing property command_data in request payload");
      }
      if (json.command && !knownCommands.includes(json.command)) {
        messageLogger.error(
          `Command ${json.command} is not supported - maybe check your spelling`
        );
      }

      /**
       * Catch-all well configured messages
       */
      else {
        messageLogger.success(
          `Command triggered: ${json.command} - ref: ${json.ref}`
        );
        const indexOfCommand = knownCommands.indexOf(json.command);
        const acknowledgment = {
          respond: json.command,
          respond_data: fakeData[indexOfCommand].acknowledgmentData,
          ref: json.ref,
        };
        let message;
        // checks if you have configured the flow to mimic a successful response
        if (flow[indexOfCommand].sendSuccess) {
          messageLogger.info(
            `Command triggered: ${json.command} - configured to mimic successful response`
          );
          message = {
            command: `${json.command}_success`,
            command_data: fakeData[indexOfCommand].successData,
            ref: json.ref,
          };
        }
        // checks if you have configured the flow to mimic an error
        else if (!flow[indexOfCommand].sendSuccess) {
          messageLogger.info(
            `Command triggered: ${json.command} - configured to mimic error response`
          );
          message = {
            command: `${json.command}_error`,
            command_data:
              fakeData[indexOfCommand].errorList[
                flow[indexOfCommand].errorToSend
              ],
            ref: json.ref,
          };
        }

        /**
         * Handling `smart_fridge_request`
         */

        if (json.command === "smart_fridge_request") {

          // sending smart_fridge_request_begun
          message = {
            command: `${json.command}_begun`,
            command_data: fakeData[indexOfCommand].successData,
            ref: json.ref,
          };

        }

        /**
         * Handling the smart_fridge_door_open
         */
        if (json.command === "smart_fridge_door_open") {

          /**
           * Handling Configuration error in given payload
           */
          if (!json.command_data.public_api_token) {
            messageLogger.error(
              "Missing property command_data.public_api_token in request payload"
            );
          }
          if (!json.command_data.machine_uid) {
            messageLogger.error(
              "Missing property command_data.machine_uid in request payload"
            );
          }
          
          /**
           * Customer is taking a product
           */
          setTimeout(() => {
            messageLogger.success(`Customer is taking a product ...`);
            ws.send(
              JSON.stringify({
                command: `smart_fridge_product_taken`,
                command_data: {
                  status: 1,
                  error_data: [],
                  json_data: {
                    code: 1,
                    message: "Product taken list is updated",
                    list: [purchasedProducts[0]]
                  },
                },
                ref: json.ref,
              })
            );
            messageLogger.success(
              `Message sent: smart_fridge_product_taken`
            );
          }, LOADING_TIME_MS);

          /**
           * Customer is taking another product
           */
            setTimeout(() => {
            messageLogger.success(`Customer is taking a product ...`);
            ws.send(
              JSON.stringify({
                command: `smart_fridge_product_taken`,
                command_data: {
                  status: 1,
                  error_data: [],
                  json_data: {
                    code: 1,
                    message: "Product taken list is updated",
                    list: [purchasedProducts[0], purchasedProducts[1]]
                  },
                },
                ref: json.ref,
              })
            );
            messageLogger.success(
              `Message sent: smart_fridge_product_taken`
            );
          }, LOADING_TIME_MS * 2);

          /**
           * Customer replace the previous product
           */
            setTimeout(() => {
            messageLogger.success(`Customer replaces a product ...`);
            ws.send(
              JSON.stringify({
                command: `smart_fridge_product_taken`,
                command_data: {
                  status: 1,
                  error_data: [],
                  json_data: {
                    code: 1,
                    message: "Product taken list is updated",
                    list: [purchasedProducts[0]]
                  },
                },
                ref: json.ref,
              })
            );
            messageLogger.success(
              `Message sent: smart_fridge_product_taken`
            );
          }, LOADING_TIME_MS * 3);

          /**
           * Customer takes a last product
           */
            setTimeout(() => {
            messageLogger.success(`Customer is taking a product ...`);
              ws.send(
              JSON.stringify({
                command: `smart_fridge_product_taken`,
                command_data: {
                  status: 1,
                  error_data: [],
                  json_data: {
                    code: 1,
                    message: "Product taken list is updated",
                    list: [purchasedProducts[0], purchasedProducts[2]]
                  },
                },
                ref: json.ref,
              })
            );
            messageLogger.success(
              `Message sent: smart_fridge_product_taken`
            );
          }, LOADING_TIME_MS * 4);


          /**
           * Door has been closed by customer
           */
          setTimeout(() => {
          ws.send(
            JSON.stringify({
              command: `smart_fridge_door_close_success`,
              command_data: {
                status: 1,
                error_data: [],
                json_data: {
                  code: 1,
                  message: "Door is successfully locked",
                  data: { door_status: "LOCKED" },
                },
              },
              ref: json.ref,
            })
          );
          messageLogger.success(
            `Message sent: smart_fridge_door_close_success`
          );
        }, LOADING_TIME_MS * 5);

          /**
           * Request has been completed
           */
          setTimeout(() => {
            ws.send(
              JSON.stringify({
                command: `smart_fridge_request_completed`,
                command_data: {
                  status: 1,
                  error_data: [],
                  json_data: {
                    code: 1,
                    message:
                      "This Smart Fridge request has been completed & closed",
                    data: {
                      transaction_id: "",
                      transaction_status: 1,
                      transaction_total: 1.5,
                      transaction_product: purchasedProducts,
                    },
                  },
                },
                ref: json.ref,
              })
            );
            messageLogger.success(`Message sent: smart_fridge_request_completed`);
          }, LOADING_TIME_MS * 6);

        }

          /**
         * Responding with the acknowledgement and success message
         */
          ws.send(JSON.stringify(acknowledgment));
          messageLogger.success("Message sent: acknowledgment");
          ws.send(JSON.stringify(message));
          messageLogger.success(`Message sent: ${message?.command}`);
      }
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on ws://localhost:${port}`);
  });
});
