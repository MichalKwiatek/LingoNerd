import { Duration, Stack } from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigw from "aws-cdk-lib/aws-apigateway";

function createAssessmentStack(stack: Stack) {
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
    entry: path.join(__dirname, `../modules/assessment/getLevelLambda.ts`),
    environment: {
      USER_LEVEL_TABLE: userLevelTable.tableName,
    },
  });
  userLevelTable.grantReadData(getLevelLambda);

  const assessmentApi = new apigw.RestApi(stack, `AssessmentApi`, {
    restApiName: `assessment-api`,
    defaultCorsPreflightOptions: {
      allowOrigins: apigw.Cors.ALL_ORIGINS,
    }
  });

  const getLevelLambdaIntegration = new apigw.LambdaIntegration(getLevelLambda);
  const blogPostsResource = assessmentApi.root.addResource("level");
  blogPostsResource.addMethod("GET", getLevelLambdaIntegration);
}

export default createAssessmentStack;
