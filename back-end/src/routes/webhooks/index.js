import express from 'express';
import nodemailer from 'nodemailer';
// import Boom from 'boom';

import Hasura from '../../clients/hasura';
import { GET_MEETING_PARTICIPANTS } from './queries';

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: "google",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
    }
})

router.post('/meeting_created', async (req, res, next) => {
    const meeting = req.body.event.data.new;
    
    const data = await Hasura.request(GET_MEETING_PARTICIPANTS, {
        meeting_id: meeting.id,
    });



});

export default router;