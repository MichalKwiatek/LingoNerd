import { APIGatewayEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import AuthorizationError from "../../errors/AuthorizationError";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const authorize = async (event: APIGatewayEvent): Promise<string> => {
  const authorizedUserId = event.requestContext.authorizer?.claims[
    "custom:userId"
  ] as string | undefined;
  const unauthorizedUserId = event.queryStringParameters?.userId;

  if (authorizedUserId == null && unauthorizedUserId == null) {
    throw new AuthorizationError("No userId provided");
  }

  if (authorizedUserId != null) {
    return authorizedUserId;
  }

  const command = new GetCommand({
    TableName: process.env.USER_LEVEL_TABLE,
    Key: { id: unauthorizedUserId },
  });

  const response = await docClient.send(command);
  if (response.Item != null) {
    throw new AuthorizationError(
      `This user has to be authorized: ${unauthorizedUserId}`
    );
  }

  return unauthorizedUserId as string;
};
