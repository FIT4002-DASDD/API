/*
 * Author: Sara Tran
 * -----
 * Last Modified: Thursday, 18th November 2021 9:19:08 pm
 * Modified By: Sara Tran
 */

import { EC2Client } from "@aws-sdk/client-ec2";
const env = process.env;

// Set the AWS Region.
const REGION = env.AWS_REGION;

// Create an Amazon EC2 service client object.
export const ec2Client = new EC2Client({ region: REGION });
