import { PostConfirmationConfirmSignUpTriggerEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (
  event: PostConfirmationConfirmSignUpTriggerEvent
) => {
  try {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);

    if (event.triggerSource !== "PostConfirmation_ConfirmSignUp") {
      console.log("Not confirming the email, doing nothing");
      return event;
    }

    const userId = event.request.userAttributes["custom:userId"];
    if (userId == null) {
      console.error(
        'No user id in event.request.userAttributes["custom:userId"]'
      );
      return event;
    }

    const command = new PutCommand({
      TableName: process.env.USER_TABLE,
      Item: { id: userId, userId },
    });

    await docClient.send(command);

    return event;
  } catch (error) {
    console.error(error);
    return event;
  }
};
