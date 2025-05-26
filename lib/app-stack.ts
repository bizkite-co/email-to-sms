import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

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
  }
}
