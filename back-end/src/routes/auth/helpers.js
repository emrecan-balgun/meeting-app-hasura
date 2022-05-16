import JWT from 'jsonwebtoken';

export const signAccessToken = (user) => {
    return new Promise((resolve, reject) => {
        const payload = {
            "https://hasura.io/jwt/claims": {
                "x-hasura-allowed-roles": ["user"],
                "x-hasura-default-role": "user",
                "x-hasura-user-id": user.id
            },
            email: user.email,
        };

        const options = {
            expiresIn: '100d',
            issuer: 'meeting-app',
            audience: user.id,
        };

        JWT.sign(payload, )
    });
}