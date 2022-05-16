import express from 'express';
import Boom from 'boom';
import Hasura from '../../clients/hasura';
import bcrypt from 'bcryptjs';
import { IS_EXISTS_USER, INSERT_USER_MUTATION } from './queries';
import { registerSchema } from './validation';

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
        
        const user = await Hasura.request(INSERT_USER_MUTATION, {
            input: {
                ...input,
                password: hash
            }
        })

        console.log(user);

        res.json({ accessToken: 'accessToken' });

    }catch(err) {
        return next(Boom.badRequest(err));
    }
})

export default router;