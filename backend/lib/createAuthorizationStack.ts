import { Duration, Stack } from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

function createAuthorizationStack(stack: Stack) {
  const userpool = new cognito.UserPool(stack, "app-user-pool", {
    userPoolName: "app-user-pool",
    signInAliases: {
      email: true,
    },
    selfSignUpEnabled: true,
    autoVerify: {
      email: true,
    },
    userVerification: {
      emailSubject: "Weryfikacja konta",
      emailBody:
        "Aby zweryfikować swoje konto kliknij w ten link: {##Verify Email##}",
      emailStyle: cognito.VerificationEmailStyle.LINK,
    },
    standardAttributes: {},
    customAttributes: {
      userId: new cognito.StringAttribute({
        mutable: false,
        minLen: 36,
        maxLen: 36,
      }),
    },
    passwordPolicy: {
      minLength: 8,
      requireLowercase: true,
      requireUppercase: true,
      requireDigits: true,
      requireSymbols: false,
    },
    accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
  });

  userpool.addDomain("CognitoDomain", {
    cognitoDomain: {
      domainPrefix: "lingo-nerd",
    },
  });

  const appClient = userpool.addClient("web-app-client", {
    userPoolClientName: "web-app-client",
    authFlows: {
      userSrp: true,
    },
  });

  const userTable = new dynamodb.Table(stack, "User", {
    partitionKey: {
      name: "id",
      type: dynamodb.AttributeType.STRING,
    },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  const createUserLambda = new NodejsFunction(stack, "createUser", {
    memorySize: 128,
    timeout: Duration.seconds(5),
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: "handler",
    entry: path.join(
      __dirname,
      `../modules/authorization/lambdas/createUserLambda.ts`
    ),
    environment: {
      USER_TABLE: userTable.tableName,
    },
  });
  userTable.grantWriteData(createUserLambda);

  userpool.addTrigger(
    cognito.UserPoolOperation.POST_CONFIRMATION,
    createUserLambda
  );
}

export default createAuthorizationStack;
