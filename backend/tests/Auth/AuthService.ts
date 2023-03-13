import { Auth, Amplify } from "aws-amplify";
// import Amplify from "aws-amplify";
import { config } from "./config";
import { CognitoUser } from "@aws-amplify/auth";

Amplify.configure({
  Auth: {
    manadatorySignIn: false,
    region: config.REGION,
    userPoolId: config.USER_POOL_ID,
    userPoolWebClientId: config.APP_CLIENT_ID,
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
}
