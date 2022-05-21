import express from 'express';
// import Boom from 'boom';

import Hasura from '../../clients/hasura';
import { GET_MEETING_PARTICIPANTS } from './queries';

const router = express.Router();

router.post('/meeting_created', async (req, res, next) => {
    const meeting = req.body.event.data.new;
    
    const data = await Hasura.request(GET_MEETING_PARTICIPANTS, {
        meeting_id: meeting.id,
    });

    console.log(data);

});

export default router;