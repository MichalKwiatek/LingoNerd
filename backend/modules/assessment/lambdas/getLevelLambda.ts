import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import createLambdaResponse from "../../../utlis/createLambdaResponse";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);
  if (event.queryStringParameters?.id == null) {
    return createLambdaResponse(400, {
      error: "Missing id in query parameters",
    });
  }

  const command = new GetCommand({
    TableName: process.env.USER_LEVEL_TABLE,
    Key: { id: event.queryStringParameters?.id },
  });

  const response = await docClient.send(command);
  console.log("dynamo db response", response);

  if (response.Item == null || response.Item.level == null) {
    return createLambdaResponse(404, { error: "No level for this user" });
  }

  return createLambdaResponse(200, { level: response.Item.level });
};
