import JWT from 'jsonwebtoken';
import Boom from 'boom';

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
            audience: user.id.toString(),
        };

        JWT.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, options, (err, token) => {
            if(err) {
                return reject(Boom.internal('Error signing access token'));
            }

            resolve(token);
        })
    });
}