
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-cloudfront-signer/

import { getSignedCookies } from "@aws-sdk/cloudfront-signer"; // ESM

const cloudfrontDistributionDomain = "https://d111111abcdef8.cloudfront.net";
const s3ObjectKey = "private-content/private.jpeg";
const url = `${cloudfrontDistributionDomain}/${s3ObjectKey}`;
const privateKey = "CONTENTS-OF-PRIVATE-KEY";
const keyPairId = "PUBLIC-KEY-ID-OF-CLOUDFRONT-KEY-PAIR";
const dateLessThan = "2022-01-01";

const policy = {
  Statement: [
    {
      Resource: url,
      Condition: {
        DateLessThan: {
          "AWS:EpochTime": new Date(dateLessThan).getTime() / 1000, // time in seconds
        },
      },
    },
  ],
};

const policyString = JSON.stringify(policy);

const cookies = getSignedCookies({
  keyPairId,
  privateKey,
  policy: policyString,
});

console.log("Signed Cookies:", cookies);
