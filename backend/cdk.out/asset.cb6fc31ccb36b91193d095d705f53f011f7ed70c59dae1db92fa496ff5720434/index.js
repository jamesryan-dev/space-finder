"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// services/SpacesTable/Read.ts
var Read_exports = {};
__export(Read_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(Read_exports);
var import_aws_sdk = require("aws-sdk");
var TABLE_NAME = process.env.TABLE_NAME;
var PRIMARY_KEY = process.env.PRIMARY_KEY;
var dbClient = new import_aws_sdk.DynamoDB.DocumentClient();
async function handler(event, context) {
  const result = {
    statusCode: 200,
    body: "Read - Hello from DYnamoDb"
  };
  try {
    if (event.queryStringParameters) {
      console.log("if (query string parameters)");
      if (PRIMARY_KEY in event.queryStringParameters) {
        const keyValue = event.queryStringParameters[PRIMARY_KEY];
        console.log("keyValue", keyValue);
        const queryResponse = await dbClient.query({
          TableName: TABLE_NAME,
          KeyConditionExpression: "#key = :keyValue",
          ExpressionAttributeNames: {
            "#key": PRIMARY_KEY
          },
          ExpressionAttributeValues: {
            ":keyValue": keyValue
          }
        }).promise();
        result.body = JSON.stringify(queryResponse);
        console.log("queryResponse", queryResponse);
      }
    } else {
      console.log("else (no query string parameters)");
      const queryResponse = await dbClient.scan({
        TableName: TABLE_NAME
      }).promise();
      result.body = JSON.stringify(queryResponse);
    }
  } catch (error) {
    console.log("error", error);
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
