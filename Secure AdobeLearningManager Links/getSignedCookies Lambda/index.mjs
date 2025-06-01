import { getSignedCookies } from "@aws-sdk/cloudfront-signer";

const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;

const privateKeyRaw = process.env.privateKey;
const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

const cloudfrontDistributionDomain = process.env.cloudfrontDistributionDomain;
const keyPairId = process.env.keyPairId;
const intervalToAddInMilliseconds = 86400 * 1000; // 24 hours in milliseconds 

const createResponse = (statusCode, body, cookieHeaders) => {
    const responseBody = JSON.stringify(body);
    return {
        statusCode,
        headers: { "Content-Type": "application/json" },
        ...(cookieHeaders && { cookies: cookieHeaders }),
        body: responseBody,
    };
};

export const handler = async (event) => {
    if (!privateKey || !clientId || !clientSecret || !cloudfrontDistributionDomain || !keyPairId) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Missing Environment Variables!' }),
        };
    }

    const id = event?.pathParameters?.id;

    try {
        const userTokenResponse = await fetch('https://learningmanager.adobe.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code: id,
                grant_type: 'authorization_code',
                redirect_uri: `${cloudfrontDistributionDomain}`
            })
        })

        const userTokens = await userTokenResponse.json();
        const accessToken = userTokens?.access_token;

        if (!accessToken) {
            return createResponse(404, { error: 'No Tokens Found!!!' });
        }
        // optional account id validation if required
        else {
            const s3ObjectKey = "*";
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

            const cookieHeaders = [
                `CloudFront-Key-Pair-Id=${cookies['CloudFront-Key-Pair-Id']}; Expires=${expires}; Path=/; Secure; HttpOnly; SameSite=None;`,
                `CloudFront-Signature=${cookies['CloudFront-Signature']}; Expires=${expires}; Path=/; Secure; HttpOnly; SameSite=None`,
                `CloudFront-Policy=${cookies['CloudFront-Policy']}; Expires=${expires}; Path=/; Secure; HttpOnly; SameSite=None;`,
            ]
            return createResponse(200, { message: 'Cookies created successfully!' }, cookieHeaders);
        }

    }
    catch (err) {
        console.log(err);
        return createResponse(500, { error: err });
    }
}
