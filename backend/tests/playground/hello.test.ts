// import { handler } from '../../services/node-lambda/hello';
import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/SpacesTable/Read";

// handler({}, {});

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    location: "London",
  },
} as any;

const result = handler(event as any, {} as any).then((apiResult) => {
  const items = JSON.parse(apiResult.body);
  console.log("items", items);
});
