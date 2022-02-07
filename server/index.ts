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
      const string = data.toString();
      const json = JSON.parse(string);
      messageLogger.debug("data received:", json);
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
      } else {
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
        ws.send(JSON.stringify(acknowledgment));
        messageLogger.success("Message sent: acknowledgment");
        ws.send(JSON.stringify(message));
        messageLogger.success(`Message sent: ${message?.command}`);
        if (json.command && json.command === "smart_fridge_door_open") {
          if (json.command_data && !json.command_data.public_api_token) {
            messageLogger.error(
              "Missing property command_data.public_api_token in request payload"
            );
          }
          if (json.command_data && !json.command_data.machine_uid) {
            messageLogger.error(
              "Missing property command_data.machine_uid in request payload"
            );
          }
          if (json.command_data && !json.command_data.payment_name) {
            messageLogger.error(
              "Missing property command_data.payment_name in request payload"
            );
          }
          if (json.command_data && !json.command_data.currency) {
            messageLogger.error(
              "Missing property command_data.currency in request payload"
            );
          }
          if (json.command_data && !json.command_data.pre_authorized_amount) {
            messageLogger.error(
              "Missing property command_data.pre_authorized_amount in request payload"
            );
          }
          if (json.command_data && !json.command_data.payment_detail) {
            messageLogger.error(
              "Missing property command_data.payment_detail in request payload"
            );
          }
          messageLogger.success(`Customer is taking products ...`);

          setTimeout(() => {
            messageLogger.success(`Customer is closing door ...`);
            // TODO: status 0 means dispensing failed
            ws.send(
              JSON.stringify({
                command: `smart_fridge_door_close_success`,
                command_data: {
                  status: 1,
                  error_data: [],
                  json_data: {
                    code: 1,
                    message: "Smart Fridge Door is locked",
                    data: { door_status: "CLOSED" },
                  },
                },
                ref: json.ref,
              })
            );
            messageLogger.success(
              `Message sent: smart_fridge_door_close_success`
            );
          }, LOADING_TIME_MS);
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
                      transaction_id: "valuetocheck",
                      transaction_status: 1,
                      product_data: purchasedProducts,
                    },
                  },
                },
                ref: json.ref,
              })
            );
            messageLogger.success(`Message sent: smart_fridge_request_completed`);
          }, LOADING_TIME_MS * 2);

        }
      }
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on ws://localhost:${port}`);
  });
});
