const API_BASE_URL = "https://....cloudfront.net/api";

export const getAccessToken = () => {
    const sessionStoragKeys = Object.keys(sessionStorage);
    const oidcKey = sessionStoragKeys.find(key => key.startsWith("oidc.user:https://cognito-idp."));
    const oidcContext = JSON.parse(sessionStorage.getItem(oidcKey) || "{}");
    const accessToken = oidcContext?.access_token;
    return accessToken;
};

export const getUserDetails = () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
        return null;
    }
    const payload = accessToken.split('.')[1];
    const decodedPayload = atob(payload);
    const userDetails = JSON.parse(decodedPayload);
    return userDetails;
}

const createHeaders = () => {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
    };
}

export const getSignedCookie = async () => {
    const response = await fetch(`${API_BASE_URL}/getSignedCookies`,
        {
            method: "GET",
            headers: createHeaders(),
            credentials: 'include'
        },
    );
    return response.json();
};
