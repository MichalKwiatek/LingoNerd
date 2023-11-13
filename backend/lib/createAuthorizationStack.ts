import { Duration, Stack } from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";

function createAuthorizationStack(stack: Stack) {
  const userpool = new cognito.UserPool(stack, 'app-user-pool', {
    userPoolName: 'app-user-pool',
    signInAliases: {
      email: true,
    },
    selfSignUpEnabled: true,
    autoVerify: {
      email: true,
    },
    userVerification: {
      emailSubject: 'Weryfikacja konta',
      emailBody: 'Aby zweryfikować swoje konto kliknij w ten link: {##Verify Email##}',
      emailStyle: cognito.VerificationEmailStyle.LINK,
    },
    standardAttributes: {
    
    },
    customAttributes: {
      'userId': new cognito.StringAttribute({
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

  userpool.addDomain('CognitoDomain', {
    cognitoDomain: {
      domainPrefix: 'lingo-nerd',
    },
  });

  const appClient = userpool.addClient('web-app-client', {
    userPoolClientName: 'web-app-client',
    authFlows: {
      userSrp: true,
    },
  });
}

export default createAuthorizationStack;
