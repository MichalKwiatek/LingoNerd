import { Duration, Stack } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as cognito from "aws-cdk-lib/aws-cognito";

function createAssessmentStack(
  stack: Stack,
  userPool: cognito.UserPool,
  userTableName: string
) {
  const userLevelTable = new dynamodb.Table(stack, "UserLevel", {
    partitionKey: {
      name: "id",
      type: dynamodb.AttributeType.STRING,
    },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  const getLevelLambda = new NodejsFunction(stack, "getLevelLambda", {
    memorySize: 128,
    timeout: Duration.seconds(5),
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: "handler",
    entry: path.join(
      __dirname,
      `../modules/assessment/lambdas/getLevelLambda.ts`
    ),
    environment: {
      USER_LEVEL_TABLE: userLevelTable.tableName,
      USER_TABLE: userTableName,
    },
  });
  userLevelTable.grantReadData(getLevelLambda);

  const assessmentApi = new apigw.RestApi(stack, `AssessmentApi`, {
    restApiName: `assessment-api`,
    defaultCorsPreflightOptions: {
      allowOrigins: apigw.Cors.ALL_ORIGINS,
    },
  });

  const getLevelLambdaIntegration = new apigw.LambdaIntegration(getLevelLambda);
  const publicLevelResource = assessmentApi.root
    .addResource("public")
    .addResource("level");
  publicLevelResource.addMethod("GET", getLevelLambdaIntegration);

  const authorizer = new apigw.CfnAuthorizer(stack, "CognitoAuthorizer", {
    restApiId: assessmentApi.restApiId,
    type: "COGNITO_USER_POOLS",
    name: "AssessmentAuthorizer",
    identitySource: "method.request.header.Authorization",
    providerArns: [userPool.userPoolArn],
  });

  const levelResource = assessmentApi.root.addResource("level");
  levelResource.addMethod("GET", getLevelLambdaIntegration, {
    authorizationType: apigw.AuthorizationType.COGNITO,
    authorizer: {
      authorizerId: authorizer.ref,
    },
  });
}

export default createAssessmentStack;
