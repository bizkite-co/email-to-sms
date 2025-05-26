import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"; // Import SNS client
import { SESEvent } from "aws-lambda";

const s3Client = new S3Client({});
const snsClient = new SNSClient({}); // Initialize SNS client

const APPROVED_SENDERS_BUCKET = process.env.APPROVED_SENDERS_BUCKET!;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN!; // Use SNS Topic ARN environment variable

export const handler = async (event: SESEvent) => {
  console.log("Received SES event:", JSON.stringify(event, null, 2));

  try {
    // Extract sender email from the first record
    const sender = event.Records[0].ses.mail.source;
    console.log("Sender email:", sender);

    // Read approved senders from S3
    const getObjectCommand = new GetObjectCommand({
      Bucket: APPROVED_SENDERS_BUCKET,
      Key: "approved-senders.txt",
    });
    const { Body } = await s3Client.send(getObjectCommand);

    if (!Body) {
      console.error("Approved senders file is empty or not found.");
      // It's better to throw an error here as the list is essential
      throw new Error("Approved senders list not available.");
    }

    const approvedSendersContent = await Body.transformToString();
    const approvedSenders = approvedSendersContent.split('\n').map(email => email.trim()).filter(email => email.length > 0);
    console.log("Approved senders list:", approvedSenders);

    // Check if sender is approved
    if (approvedSenders.includes(sender)) {
      console.log("Sender is approved. Publishing message to SNS topic.");

      // Publish message to SNS topic
      const publishCommand = new PublishCommand({
        TopicArn: SNS_TOPIC_ARN,
        Message: `Email received from approved sender: ${sender}`,
      });

      await snsClient.send(publishCommand);
      console.log("Message published to SNS topic successfully.");

      return { statusCode: 200, body: "Message published to SNS." };
    } else {
      console.log("Sender is not approved. Skipping SMS.");
      return { statusCode: 200, body: "Sender not approved." };
    }

  } catch (error) {
    console.error("Error processing SES event:", error);
    // Return a 500 status code for errors during processing
    return { statusCode: 500, body: `Error processing email: ${error.message}` };
  }
};