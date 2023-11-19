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
  const assessmentApi = new apigw.RestApi(stack, `AssessmentApi`, {
    restApiName: `assessment-api`,
    defaultCorsPreflightOptions: {
      allowOrigins: apigw.Cors.ALL_ORIGINS,
    },
  });

  const userResource = assessmentApi.root.addResource("user");
  const publicResource = assessmentApi.root.addResource("public");
  const publicUserResource = publicResource.addResource("user");

  const authorizer = new apigw.CfnAuthorizer(stack, "CognitoAuthorizer", {
    restApiId: assessmentApi.restApiId,
    type: "COGNITO_USER_POOLS",
    name: "AssessmentAuthorizer",
    identitySource: "method.request.header.Authorization",
    providerArns: [userPool.userPoolArn],
  });

  createUserLevelStack(
    stack,
    userTableName,
    authorizer,
    userResource,
    publicUserResource
  );

  createLevelsStack(
    stack,
    userTableName,
    authorizer,
    publicResource,
    assessmentApi
  );
}

function createUserLevelStack(
  stack: Stack,
  userTableName: string,
  authorizer: apigw.CfnAuthorizer,
  userResource: apigw.Resource,
  publicUserResource: apigw.Resource
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

  const getLevelLambdaIntegration = new apigw.LambdaIntegration(getLevelLambda);

  const publicLevelResource = publicUserResource.addResource("level");
  publicLevelResource.addMethod("GET", getLevelLambdaIntegration);

  const levelResource = userResource.addResource("level");
  levelResource.addMethod("GET", getLevelLambdaIntegration, {
    authorizationType: apigw.AuthorizationType.COGNITO,
    authorizer: {
      authorizerId: authorizer.ref,
    },
  });
}

function createLevelsStack(
  stack: Stack,
  userTableName: string,
  authorizer: apigw.CfnAuthorizer,
  publicResource: apigw.Resource,
  assessmentApi: apigw.RestApi
) {
  const levelsTable = new dynamodb.Table(stack, "Levels", {
    partitionKey: {
      name: "PK",
      type: dynamodb.AttributeType.STRING,
    },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  });

  const LEVEL_COUNT_PK = "LEVEL_COUNT";
  const getAmountOfLevelsLambda = new NodejsFunction(
    stack,
    "getAmountOfLevels",
    {
      memorySize: 128,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "handler",
      entry: path.join(
        __dirname,
        `../modules/assessment/lambdas/getAmountOfLevels.ts`
      ),
      environment: {
        LEVELS_TABLE: levelsTable.tableName,
        USER_TABLE: userTableName,
        LEVEL_COUNT_PK,
      },
    }
  );
  levelsTable.grantReadData(getAmountOfLevelsLambda);

  const getAmountOfLevelsLambdaIntegration = new apigw.LambdaIntegration(
    getAmountOfLevelsLambda
  );
  const publicLevelsResource = publicResource
    .addResource("levels")
    .addResource("count");
  publicLevelsResource.addMethod("GET", getAmountOfLevelsLambdaIntegration);

  const levelsResource = assessmentApi.root
    .addResource("levels")
    .addResource("count");
  levelsResource.addMethod("GET", getAmountOfLevelsLambdaIntegration, {
    authorizationType: apigw.AuthorizationType.COGNITO,
    authorizer: {
      authorizerId: authorizer.ref,
    },
  });
}

export default createAssessmentStack;
