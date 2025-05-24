import { getSignedCookies } from "@aws-sdk/cloudfront-signer";

const intervalToAddInMilliseconds = 86400 * 1000; // 24 hours in milliseconds 

export const createSignedCookies = async (userSub, cloudfrontDistributionDomain, keyPairId, privateKey) => {

    const s3ObjectKey = `images/${userSub}/*`;
    const url = `${cloudfrontDistributionDomain}/${s3ObjectKey}`;
    const dateLessThan = Math.floor((Date.now() + intervalToAddInMilliseconds) / 1000);

    const policy = {
        Statement: [
            {
                "Resource": url,
                Condition: {
                    DateLessThan: {
                        "AWS:EpochTime": dateLessThan,
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

    const expires = new Date(dateLessThan * 1000).toUTCString();

    return {cookies, expires};
}