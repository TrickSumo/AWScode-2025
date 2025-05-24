import middy from '@middy/core'
import ssm from '@middy/ssm';
import { createSignedCookies } from "./lib/cloudfront.mjs";

const createResponse = (statusCode, body, cookieHeaders) => {
    const responseBody = JSON.stringify(body);
    return {
        statusCode,
        headers: { "Content-Type": "application/json" },
        cookies: cookieHeaders,
        body: responseBody,
    };
};

export const lambdaHandler = async (event, context) => {

    const cloudfrontDistributionDomain = context.CLOUDFRONT_DISTRIBUTION_DOMAIN;
    const keyPairId = context.CLOUDFRONT_KEY_PAIR_ID;
    const privateKeyRaw = context.CLOUDFRONT_PRIVATE_KEY;
    const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

    try {
        const userSub = event?.requestContext?.authorizer?.jwt?.claims?.sub;

        const { cookies, expires } = await createSignedCookies(userSub, cloudfrontDistributionDomain, keyPairId, privateKey);

        const cookieHeaders = [
            `CloudFront-Key-Pair-Id=${cookies['CloudFront-Key-Pair-Id']}; Expires=${expires}; Path=/; Secure; HttpOnly; SameSite=None;`,
            `CloudFront-Signature=${cookies['CloudFront-Signature']}; Expires=${expires}; Path=/; Secure; HttpOnly; SameSite=None`,
            `CloudFront-Policy=${cookies['CloudFront-Policy']}; Expires=${expires}; Path=/; Secure; HttpOnly; SameSite=None;`,
        ]

        return createResponse(200, { message: 'Cookies created successfully!' }, cookieHeaders);
    }
    catch (err) {
        console.error(err);
        return createResponse(500, { error: 'Failed to create signed cookies!' });
    }
};

export const handler = middy()
    .use(
        ssm({
            fetchData: {
                CLOUDFRONT_DISTRIBUTION_DOMAIN: process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN_PARAM_NAME,
                CLOUDFRONT_KEY_PAIR_ID: process.env.CLOUDFRONT_KEY_PAIR_ID_PARAM_NAME,
                CLOUDFRONT_PRIVATE_KEY: process.env.CLOUDFRONT_PRIVATE_KEY_PARAM_NAME,
            },
            setToContext: true,
            cache: true,
            cacheExpiry: 5 * 60 * 1000,
        })
    )
    .handler(lambdaHandler)