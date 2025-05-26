# Implement Email to SMS Notification System - Task 3: Develop Lambda Function

This task is the third step in implementing the Email to SMS Notification System as outlined in [plan.md](plan.md).

**Objective:** Develop an AWS Lambda function that will be triggered by SES, parse the email sender, check against the approved senders list in S3, and send an SMS via Pinpoint if the sender is approved.

**Steps:**

1.  Navigate to the CDK project directory `/home/mstouffer/repos/email-to-sms`.
2.  Create a new directory for the Lambda function code (e.g., `lambda/email-processor`).
3.  Write the Lambda function code (e.g., `index.ts` or `index.py`) to:
    *   Accept the SES email event as input.
    *   Extract the sender's email address from the event.
    *   Read the `approved-senders.txt` file from the S3 bucket (defined in Task 2).
    *   Parse the S3 file content to get the list of approved senders.
    *   Check if the extracted sender email is in the approved list.
    *   If approved, use the AWS SDK (Pinpoint client) to send an SMS to the target phone number.
    *   Include error handling and logging to CloudWatch.
4.  In the main stack file (`lib/email-to-sms-stack.ts`), define the Lambda function resource, pointing to the code created in step 3.
5.  Configure the Lambda with necessary environment variables (e.g., Pinpoint Application ID, target phone number, S3 bucket name).
6.  Grant the Lambda function the necessary IAM permissions (as outlined in the plan): `s3:GetObject` and `mobiletargeting:SendMessages`.
7.  Synthesize the CDK application (`cdk synth`) to verify the CloudFormation template includes the Lambda function and its permissions.

Once the Lambda function is developed and configured, the next task will be to configure the SES Receipt Rule.

## Task 3 Status

### Achievements

- Created the `lambda/email-processor` directory within the email-to-sms project.
- Developed the Lambda function code (`lambda/email-processor/index.ts`) to process SES events, read approved senders from S3, and publish SMS notifications to an SNS topic, as requested.
- Created `package.json` and `tsconfig.json` files for the Lambda function's dependencies and TypeScript compilation.
- Updated the main CDK stack file (`lib/app-stack.ts`) to define the Lambda function resource, configure environment variables (`APPROVED_SENDERS_BUCKET` and `SNS_TOPIC_ARN`), and grant the required IAM permissions (`s3:GetObject` on the S3 bucket and `sns:Publish` on the SNS topic).
- Created the missing CDK application entry point file (`bin/app.ts`).
- Updated the project root `tsconfig.json` to include the `bin` and `lib` directories for TypeScript compilation.

### Current Issues

- The `npm run synth` command, which synthesizes the CDK application, consistently fails with a TypeScript compilation error (`Cannot find module 'aws-cdk-lib'`) in the `bin/app.ts` file. The underlying cause of this compilation issue within the CDK environment remains unresolved, preventing successful synthesis and verification of the CloudFormation template.

### Next Steps

- Investigate and resolve the `cdk synth` TypeScript compilation error in the email-to-sms project.
- Successfully synthesize the CDK application to generate the CloudFormation template.
- Proceed to Task 4: Configure the SES Receipt Rule to trigger the Lambda function.