export default {
    oidc: {
        clientId: '****',
        response_type: 'code',
        issuer: 'https://dev-58330507.okta.com/oauth2/default',
        redirectUri: 'https://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email']
    }
}
