import { AuthService } from "./AuthService";
import { config } from "./config";
import * as AWS from "aws-sdk";

AWS.config.region = config.REGION;

async function getBuckets() {
  let buckets;
  try {
    buckets = await new AWS.S3().listBuckets().promise();
  } catch (error) {
    console.error("Error getting buckets:", error);
    buckets = undefined;
    // throw error;
  }
  return buckets;
}

async function callStuff() {
  const authService = new AuthService();

  const user = await authService.login(
    config.TEST_USERNAME,
    config.TEST_USER_PASSWORD
  );

  await authService.getAWSTemporaryCredentials(user);

  const someCreds = AWS.config.credentials;
  const buckets = await getBuckets();
  const a = 5;
}

callStuff();
