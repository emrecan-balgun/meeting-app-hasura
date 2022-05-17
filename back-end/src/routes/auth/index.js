import express from 'express';
import Boom from 'boom';
import bcrypt from 'bcryptjs';

import Hasura from '../../clients/hasura';
import { IS_EXISTS_USER, INSERT_USER_MUTATION } from './queries';
import { registerSchema, loginSchema } from './validation';
import { signAccessToken } from './helpers';

const router = express.Router();

router.post('/register', async (req, res, next) => {
    const input = req.body.input.data;

    input.email = input.email.toLowerCase();

    const { error } = registerSchema.validate(input);

    if(error) {
        return next(Boom.badRequest(error.details[0].message));
    }

    try{
        const isExistUser = await Hasura.request(IS_EXISTS_USER, {
            email: input.email
        });

        if(isExistUser.users.length > 0) {
            throw Boom.conflict(`User already exists (${input.email})`);
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(input.password, salt);
        
        const { insert_users_one: user } = await Hasura.request(INSERT_USER_MUTATION, {
            input: {
                ...input,
                password: hash
            }
        })

        const accessToken = await signAccessToken(user);

        res.json({ accessToken });

    }catch(err) {
        return next(Boom.badRequest(err));
    }
})

router.post('/login', async (req, res, next) => {
    const input = req.body.input.data;

    input.email = input.email.toLowerCase();

    const { error } = loginSchema.validate(input);

    if(error) {
        return next(Boom.badRequest(error.details[0].message));
    }
})

export default router;