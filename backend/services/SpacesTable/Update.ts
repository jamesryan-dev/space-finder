import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { getEventBody } from "../Shared/Utils";

const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Hello from DYnamoDb",
  };

  try {
    const requestBody = getEventBody(event);
    const spaceId = event.queryStringParameters?.[PRIMARY_KEY];

    if (requestBody && spaceId) {
      const requestBodyKey = Object.keys(requestBody)[0];
      const requestBodyValue = requestBody[requestBodyKey];

      const updatedResult = await dbClient
        .update({
          TableName: TABLE_NAME,
          Key: {
            [PRIMARY_KEY]: spaceId,
          },
          UpdateExpression: `set #name = :value`,
          ExpressionAttributeNames: {
            "#name": requestBodyKey,
          },
          ExpressionAttributeValues: {
            ":value": requestBodyValue,
          },
          ReturnValues: "UPDATED_NEW",
        })
        .promise();

      result.body = JSON.stringify(updatedResult);
    }
  } catch (err: unknown) {
    console.error("error", err);
    if (err instanceof Error) {
      result.body = err.message;
    }
  }

  return result;
}

export { handler };
