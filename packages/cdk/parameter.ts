import * as cdk from 'aws-cdk-lib';
import {
  StackInput,
  stackInputSchema,
  ProcessedStackInput,
} from './lib/stack-input';
import { ModelConfiguration } from 'generative-ai-use-cases';

// Get parameters from CDK Context
const getContext = (app: cdk.App): StackInput => {
  const params = stackInputSchema.parse(app.node.getAllContext());
  return params;
};

// If you want to define parameters directly
const envs: Record<string, Partial<StackInput>> = {
  // If you want to define an anonymous environment, uncomment the following and the content of cdk.json will be ignored.
  // If you want to define an anonymous environment in parameter.ts, uncomment the following and the content of cdk.json will be ignored.
  // '': {
  //   // Parameters for anonymous environment
  //   // If you want to override the default settings, add the following
  // },
  dev: {
    // Parameters for development environment
    "ragEnabled": false,
    "kendraIndexArn": null,
    "kendraIndexLanguage": "ja",
    "kendraDataSourceBucketName": null,
    "kendraIndexScheduleEnabled": false,
    "kendraIndexScheduleCreateCron": null,
    "kendraIndexScheduleDeleteCron": null,
    "ragKnowledgeBaseEnabled": true,
    "ragKnowledgeBaseId": null,
    "ragKnowledgeBaseStandbyReplicas": false,
    "ragKnowledgeBaseAdvancedParsing": true,
    "ragKnowledgeBaseAdvancedParsingModelId": "anthropic.claude-3-sonnet-20240229-v1:0",
    "ragKnowledgeBaseBinaryVector": false,
    "embeddingModelId": "amazon.titan-embed-text-v2:0",
    "rerankingModelId": null,
    "queryDecompositionEnabled": false,
    "selfSignUpEnabled": false,
    "allowedSignUpEmailDomains": null,
    "samlAuthEnabled": false,
    "samlCognitoDomainName": "",
    "samlCognitoFederatedIdentityProviderName": "",
    "hiddenUseCases": {},
    "modelRegion": "us-west-2",
    "modelIds": [
      "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
      "us.anthropic.claude-3-5-sonnet-20241022-v2:0",
      "us.anthropic.claude-3-5-haiku-20241022-v1:0",
      "us.anthropic.claude-3-5-sonnet-20240620-v1:0",
      "us.anthropic.claude-3-opus-20240229-v1:0",
      "us.anthropic.claude-3-sonnet-20240229-v1:0",
      "us.anthropic.claude-3-haiku-20240307-v1:0",
      "us.deepseek.r1-v1:0",
      "us.meta.llama3-3-70b-instruct-v1:0",
      "us.meta.llama3-2-90b-instruct-v1:0",
      "us.meta.llama3-2-11b-instruct-v1:0",
      "us.meta.llama3-2-3b-instruct-v1:0",
      "us.meta.llama3-2-1b-instruct-v1:0",
      "us.amazon.nova-pro-v1:0",
      "us.amazon.nova-lite-v1:0",
      "us.amazon.nova-micro-v1:0",
      "cohere.command-r-plus-v1:0",
      "cohere.command-r-v1:0",
      "mistral.mistral-large-2407-v1:0"
    ],
    "imageGenerationModelIds": [
      "amazon.titan-image-generator-v2:0",
      "amazon.titan-image-generator-v1",
      "stability.sd3-large-v1:0",
      "stability.sd3-5-large-v1:0",
      "stability.stable-image-core-v1:0",
      "stability.stable-image-core-v1:1",
      "stability.stable-image-ultra-v1:0",
      "stability.stable-image-ultra-v1:1",
      "stability.stable-diffusion-xl-v1"
    ],
    "videoGenerationModelIds": [
    "amazon.nova-reel-v1:0",
    "luma.ray-v2:0"
    ],
    "endpointNames": [],
    "agentEnabled": false,
    "searchAgentEnabled": false,
    "searchApiKey": "",
    "agents": [],
    "inlineAgents": false,
    "flows": [],
    "allowedIpV4AddressRanges": null,
    "allowedIpV6AddressRanges": null,
    "allowedCountryCodes": null,
    "hostName": null,
    "domainName": null,
    "hostedZoneId": null,
    "dashboard": false,
    "anonymousUsageTracking": true,
    "guardrailEnabled": false,
    "crossAccountBedrockRoleArn": "",
    "useCaseBuilderEnabled": true,
  },
  staging: {
    // Parameters for staging environment
  },
  prod: {
    // Parameters for production environment
  },
  // If you need other environments, customize them as needed
};

// For backward compatibility, get parameters from CDK Context > parameter.ts
export const getParams = (app: cdk.App): ProcessedStackInput => {
  // By default, get parameters from CDK Context
  let params = getContext(app);

  // If the env matches the ones defined in envs, use the parameters in envs instead of the ones in context
  if (envs[params.env]) {
    params = stackInputSchema.parse({
      ...envs[params.env],
      env: params.env,
    });
  }
  // Make the format of modelIds, imageGenerationModelIds consistent
  const convertToModelConfiguration = (
    models: (string | ModelConfiguration)[],
    defaultRegion: string
  ): ModelConfiguration[] => {
    return models.map((model) =>
      typeof model === 'string'
        ? { modelId: model, region: defaultRegion }
        : model
    );
  };

  return {
    ...params,
    modelIds: convertToModelConfiguration(params.modelIds, params.modelRegion),
    imageGenerationModelIds: convertToModelConfiguration(
      params.imageGenerationModelIds,
      params.modelRegion
    ),
    videoGenerationModelIds: convertToModelConfiguration(
      params.videoGenerationModelIds,
      params.modelRegion
    ),
    speechToSpeechModelIds: convertToModelConfiguration(
      params.speechToSpeechModelIds,
      params.modelRegion
    ),
  };
};
