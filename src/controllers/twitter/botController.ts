import {
  DescribeInstancesCommand,
  Instance,
  InstanceStateChange,
  StartInstancesCommand,
  StopInstancesCommand,
} from "@aws-sdk/client-ec2";
import { ec2Client } from "~/helpers/ec2Client";
import { TwitterBot } from "~/models";

type ManageBotInstancesRespond = {
  success: boolean;
  instanceStates: InstanceStateChange[] | undefined;
  errorMessage: string;
  errorCode: string;
};
export class TwitterBotController {
  async getAll(): Promise<TwitterBot[]> {
    return await TwitterBot.find();
  }

  async getByUsername(username: string): Promise<TwitterBot> {
    return await TwitterBot.findOneOrFail({
      username,
    });
  }
  /**
  * Checking if bots are running (on AWS)
  * 
  * Return example: [
      {
          "instanceId": "i-03e28f160b2cf7515",
          "state": {
              "Code": 16,
              "Name": "running"
          }
      }
   * @returns ids and states of all bot instances 
   */
  async getBotInstancesStatus() {
    try {
      const data = await ec2Client.send(
        new DescribeInstancesCommand({
          Filters: [
            {
              Name: "tag:Name",
              Values: ["DASDD Ubuntu Bot Server"],
            },
          ],
        })
      );
      if (data.Reservations) {
        const instances = data.Reservations.filter((e) => e.Instances)
          .map((e) => e.Instances)
          .flat() as Instance[];
        const instanceState = instances.map((e) => {
          return { instanceId: e.InstanceId, state: e.State };
        });
        console.log(instanceState);
        return instanceState;
      }
    } catch (err) {
      console.log("Error", err);
    }
  }

  /**
   * Start or stop bot instances
   *
   * Return example: 
   * ```{
      "success": true,
      "instanceStates": [
          {
              "CurrentState": {
                  "Code": 80,
                  "Name": "stopped"
              },
              "InstanceId": "i-03e28f160b2cf7515",
              "PreviousState": {
                  "Code": 80,
                  "Name": "stopped"
              }
          }
      ],
      "errorMessage": "",
      "errorCode": ""
  }```

  ```{
      "success": false,
      "instanceStates": [],
      "errorCode": "IncorrectInstanceState",
      "errorMessage": "The instance is not in a state from which it can be started. It could be in the process of stopping. Please try again later"
  }```
   * @param action "stop" | "start"
   * @param ids  list of instance ids to apply the action to. If not specified, find all bot instances
   * @returns
   */
  async manageBotInstances(
    action: string,
    ids: string[] | null
  ): Promise<ManageBotInstancesRespond> {
    try {
      if (!ids) {
        // ids not supplied, find all bot instances and apply the action to them
        const data = await ec2Client.send(
          new DescribeInstancesCommand({
            Filters: [
              {
                Name: "tag:Name",
                Values: ["DASDD Ubuntu Bot Server"],
              },
            ],
          })
        );
        ids = [];
        if (data.Reservations) {
          const instances = data.Reservations.filter((e) => e.Instances)
            .map((e) => e.Instances)
            .flat() as Instance[];
          ids = instances
            .filter((instance) => instance.InstanceId)
            .map((instance) => instance.InstanceId) as string[];
        }
      }

      if (ids.length <= 0) {
        return {
          success: false,
          instanceStates: [],
          errorMessage: "No instance found",
          errorCode: "NoInstanceFound",
        };
      }

      let result;
      let commandData;
      switch (action) {
        case "stop":
          commandData = (
            await ec2Client.send(new StopInstancesCommand({ InstanceIds: ids }))
          ).StoppingInstances;
          result = {
            success: true,
            instanceStates: commandData,
            errorMessage: "",
            errorCode: "",
          };
          break;
        case "start":
          commandData = (
            await ec2Client.send(
              new StartInstancesCommand({ InstanceIds: ids })
            )
          ).StartingInstances;
          result = {
            success: true,
            instanceStates: commandData,
            errorMessage: "",
            errorCode: "",
          };
          break;
        default:
          result = {
            success: false,
            instanceStates: [],
            errorMessage: "Invalid action",
            errorCode: "InvalidAction",
          };
      }

      return result;
    } catch (err: any) {
      console.log(err);
      switch (err.Code) {
        case "InvalidInstanceID.Malformed":
          return {
            success: false,
            instanceStates: [],
            errorCode: err.Code,
            errorMessage: "Invalid instance ids",
          };
        case "IncorrectInstanceState":
          return {
            success: false,
            instanceStates: [],
            errorCode: err.Code,
            errorMessage:
              "The instance is not in a state from which it can be started. It could be in the process of stopping. Please try again later",
          };
        default:
          return {
            success: false,
            instanceStates: [],
            errorCode: err.Code,
            errorMessage: err.message,
          };
      }
    }
  }
}
