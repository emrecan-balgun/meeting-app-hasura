import express from 'express';
import Boom from 'boom';
import Hasura from '../../clients/hasura';
import { IS_EXISTS_USER, INSERT_USER_MUTATION } from './queries';

const router = express.Router();

router.post('/register', async (req, res, next) => {
    const input = req.body.input.data;

    if(!input.email || !input.password) {
        return next(Boom.badRequest('Email and password are required'));
    }

    try{
        const isExistUser = await Hasura.request(IS_EXISTS_USER, {
            email: input.email
        });

        if(isExistUser.users.length > 0) {
            throw Boom.conflict(`User already exists (${input.email})`);
        }
        
        const user = await Hasura.request(INSERT_USER_MUTATION, {
            input: {
                ...input
            }
        })

        console.log(user);

        res.json({ accessToken: 'accessToken' });

    }catch(err) {
        return next(Boom.badRequest(err));
    }
})

export default router;