import { EC2Client } from "@aws-sdk/client-ec2";
const env = process.env;

// Set the AWS Region.
const REGION = env.AWS_REGION;

// Create an Amazon EC2 service client object.
export const ec2Client = new EC2Client({ region: REGION });
