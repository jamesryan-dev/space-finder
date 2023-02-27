import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

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

  const requestBody =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);
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

  return result;
}

export { handler };
