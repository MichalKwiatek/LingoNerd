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
  try {
    const command = new GetCommand({
      TableName: process.env.LEVELS_TABLE,
      Key: { PK: process.env.LEVEL_COUNT_PK },
    });

    const response = await docClient.send(command);

    if (response.Item == null || response.Item.count == null) {
      return createLambdaResponse(404, { error: "Amount of levels not found" });
    }

    return createLambdaResponse(200, { count: response.Item.count });
  } catch (error: any) {
    console.error(error);
    const statusCode = error?.statusCode ?? 500;
    const message = error?.message ?? "Internal Server Error";
    return createLambdaResponse(statusCode, { error: message });
  }
};
