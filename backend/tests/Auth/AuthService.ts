import { Auth, Amplify } from "aws-amplify";
// import Amplify from "aws-amplify";
import { config } from "./config";
import { CognitoUser } from "@aws-amplify/auth";
import * as AWS from "aws-sdk";
import { Credentials } from "aws-sdk/lib/credentials";

Amplify.configure({
  Auth: {
    manadatorySignIn: false,
    region: config.REGION,
    userPoolId: config.USER_POOL_ID,
    userPoolWebClientId: config.APP_CLIENT_ID,
    identityPoolId: config.IDENTITY_POOL_ID,
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
});

export class AuthService {
  public async login(username: string, password: string) {
    try {
      const user = (await Auth.signIn(username, password)) as CognitoUser;
      return user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }

  public async getAWSTemporaryCredentials(user: CognitoUser) {
    // try {
    const cognitioIdentityPool = `cognito-idp.${config.REGION}.amazonaws.com/${config.USER_POOL_ID}`;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(
      {
        IdentityPoolId: config.IDENTITY_POOL_ID,
        Logins: {
          [cognitioIdentityPool]: user
            .getSignInUserSession()!
            .getIdToken()
            .getJwtToken(),
        },
      },
      { region: config.REGION }
    );
    await this.refreshCredentials();
    // } catch (error) {
    //   console.error("Error getting temporary credentials:", error);
    //   throw error;
    // }
  }

  private async refreshCredentials(): Promise<void> {
    return new Promise((resolve, reject) => {
      (AWS.config.credentials as Credentials).refresh((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
