import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define S3 bucket for approved sender email addresses
    const approvedSendersBucket = new s3.Bucket(this, 'ApprovedSendersBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Allows easy cleanup during development
      autoDeleteObjects: true, // Automatically deletes objects when bucket is destroyed
    });

    // Output the bucket name
    new cdk.CfnOutput(this, 'ApprovedSendersBucketName', {
      value: approvedSendersBucket.bucketName,
      description: 'Name of the S3 bucket for approved sender email addresses',
    });

    // Define the Lambda function
    const emailProcessorLambda = new nodejs.NodejsFunction(this, 'EmailProcessorLambda', {
      runtime: lambda.Runtime.NODEJS_20_X, // Use an appropriate runtime
      entry: path.join(__dirname, '..', 'lambda', 'email-processor', 'index.ts'), // Path to the Lambda handler
      handler: 'handler',
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: {
        APPROVED_SENDERS_BUCKET: approvedSendersBucket.bucketName,
        SNS_TOPIC_ARN: 'arn:aws:sns:us-east-1:318364255844:sms-responses-topic:755e3ee1-cf09-40e6-992c-9ef39225a453', // User provided SNS Topic ARN
      },
      projectRoot: '/home/mstouffer/repos/email-to-sms', // Explicitly set project root
    });

    // Grant Lambda permissions to read from the S3 bucket
    approvedSendersBucket.grantRead(emailProcessorLambda);

    // Grant Lambda permissions to publish to the SNS topic
    emailProcessorLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['sns:Publish'],
      resources: ['arn:aws:sns:us-east-1:318364255844:sms-responses-topic:755e3ee1-cf09-40e6-992c-9ef39225a453'], // User provided SNS Topic ARN
    }));
  }
}
