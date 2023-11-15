import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import createAssessmentStack from "./createAssessmentStack";
import createAuthorizationStack from "./createAuthorizationStack";

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const userPool = createAuthorizationStack(this);
    createAssessmentStack(this, userPool);
  }
}
