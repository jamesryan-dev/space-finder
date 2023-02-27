// import { handler } from '../../services/node-lambda/hello';
import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/SpacesTable/Update";

// handler({}, {});

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    spaceId: "d3f8eca1-4862-4c77-bcc8-80725571e239",
  },
  body: {
    location: "new location",
  },
} as any;

const result = handler(event as any, {} as any).then((apiResult) => {
  const items = JSON.parse(apiResult.body);
  console.log("items", items);
});
