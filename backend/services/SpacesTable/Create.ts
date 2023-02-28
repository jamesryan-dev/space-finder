import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";
import {
  missingFieldError,
  validateAsSpaceEntry,
} from "../Shared/InputValidator";

const TABLE_NAME = process.env.TABLE_NAME;
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
    const item =
      typeof event.body == "object" ? event.body : JSON.parse(event.body);
    item.spaceId = v4();

    validateAsSpaceEntry(item);

    await dbClient
      .put({
        TableName: TABLE_NAME!,
        Item: item,
      })
      .promise();

    result.body = JSON.stringify("created item: " + item.spaceId);
  } catch (err: unknown) {
    console.error("error", err);
    if (err instanceof missingFieldError) {
      result.statusCode = 403;
      result.body = err.message;
    } else {
      result.statusCode = 500;
    }
  }

  return result;
}

export { handler };
