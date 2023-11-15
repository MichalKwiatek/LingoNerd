import { APIGatewayEvent } from "aws-lambda";

export const authorize = (event: APIGatewayEvent): string => {
  const userId = event.requestContext.authorizer?.claims["custom:userId"];
  if (userId == null) {
    throw new Error("No user id found in event");
  }

  return userId;
};
