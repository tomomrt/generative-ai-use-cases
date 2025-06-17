# How to Delete Resources

Please execute the following command depending on your deployment method. **All data including Cognito UserPool, DynamoDB Table, etc. will be deleted.**

```bash
# Delete the environment specified in context.env of cdk.json
npm run cdk:destroy

# Delete the environment configured in parameter.ts ('prod' in the following example)
npm run cdk:destroy -- -c env=prod
```

> [!NOTE]
> If the values in cdk.json (parameter.ts) differ between deployment and deletion times, certain stacks may not be deleted when running the above command.
> Please verify that no stacks remain by checking the CloudFormation page in AWS Management Console (in the modelRegion and the region where you executed cdk deploy).

## If an Error Occurs

You may encounter the following error:

> **The bucket you tried to delete is not empty. You must delete all versions in the bucket.**

S3 Buckets need to be emptied before deletion. While AWS CDK provides the `autoDeleteObjects: true` option to automatically empty the bucket before deletion, this error can occur if new files are added between emptying the bucket and the actual deletion.

If this error occurs, follow these steps to manually delete the Stack:

1. Open [AWS CloudFormation](https://console.aws.amazon.com/cloudformation/home) and select GenerativeAiUseCasesStack.
2. Click Delete. You will be asked if you want to skip the deletion of the S3 Bucket that failed to delete. Check the box and proceed with deletion.
3. The deletion of all resources except the skipped S3 Bucket will complete.
4. Open [Amazon S3](https://s3.console.aws.amazon.com/s3/home) and find the skipped S3 Bucket. (Search for "generative" etc.)
5. Execute Empty (to empty the Bucket) => Delete (to delete the Bucket)
