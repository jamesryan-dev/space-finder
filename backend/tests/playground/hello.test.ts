// import { handler } from '../../services/node-lambda/hello';
import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/SpacesTable/Create";

// handler({}, {});

const event: APIGatewayProxyEvent = {
  body: {
    name: "some name",
  },
} as any;

const result = handler(event as any, {} as any).then((apiResult) => {
  const items = JSON.parse(apiResult.body);
  console.log("items", items);
});
