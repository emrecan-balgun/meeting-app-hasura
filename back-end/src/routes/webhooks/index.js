import express from 'express';
// import Boom from 'boom';

// import Hasura from '../../clients/hasura';
// import { IS_EXISTS_USER, INSERT_USER_MUTATION, LOGIN_QUERY } from './queries';

const router = express.Router();

router.post('/meeting_created', verifyAccessToken, (req, res, next) => {
    
});

export default router;