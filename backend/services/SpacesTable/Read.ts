import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Read - Hello from DYnamoDb",
  };

  try {
    if (event.queryStringParameters) {
      if (PRIMARY_KEY! in event.queryStringParameters) {
        console.info("Attempting to query with primary key", PRIMARY_KEY!);
        result.body = await queryWithPrimaryPartion(
          event.queryStringParameters
        );
      } else {
        result.body = await queryWithSecondaryPartion(
          event.queryStringParameters
        );
      }
    } else {
      result.body = await scanTable();
    }
  } catch (error) {
    console.log("error", error);
  }

  return result;
}

async function queryWithPrimaryPartion(
  queryParams: APIGatewayProxyEventQueryStringParameters
) {
  const keyValue = queryParams[PRIMARY_KEY!];
  console.info("queryWithPrimaryPartion --> keyValue", keyValue);

  const queryResponse = await dbClient
    .query({
      TableName: TABLE_NAME!,
      KeyConditionExpression: "#key = :keyValue",
      ExpressionAttributeNames: {
        "#key": PRIMARY_KEY!,
      },
      ExpressionAttributeValues: {
        ":keyValue": keyValue,
      },
    })
    .promise();
  return JSON.stringify(queryResponse.Items);
}

async function queryWithSecondaryPartion(
  queryParams: APIGatewayProxyEventQueryStringParameters
) {
  const queryKey = Object.keys(queryParams)[0];
  const queryValue = queryParams[queryKey];

  console.info(
    "queryWithSecondaryPartion --> queryKey",
    queryKey,
    "queryValue",
    queryValue
  );

  const queryResponse = await dbClient
    .query({
      TableName: TABLE_NAME!,
      IndexName: queryKey,
      KeyConditionExpression: "#key = :keyValue",
      ExpressionAttributeNames: {
        "#key": queryKey,
      },
      ExpressionAttributeValues: {
        ":keyValue": queryValue,
      },
    })
    .promise();

  return JSON.stringify(queryResponse.Items);
}

async function scanTable() {
  const queryResponse = await dbClient
    .scan({
      TableName: TABLE_NAME!,
    })
    .promise();

  return JSON.stringify(queryResponse.Items);
}

export { handler };
