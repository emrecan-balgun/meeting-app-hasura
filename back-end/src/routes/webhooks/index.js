import express from 'express';
import nodemailer from 'nodemailer';
// import Boom from 'boom';

import Hasura from '../../clients/hasura';
import { GET_MEETING_PARTICIPANTS } from './queries';

const router = express.Router();

const smptpConfig = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    },
};

const transporter = nodemailer.createTransport(smptpConfig);

router.post('/meeting_created', async (req, res, next) => {
    const meeting = req.body.event.data.new;
    
    const { meetings_by_pk } = await Hasura.request(GET_MEETING_PARTICIPANTS, {
        id: meeting.id,
    });

    const title = meeting.title;
    const { email, fullName } = meetings_by_pk.user;
    const participants = meetings_by_pk.participants.map(({ user }) => (user.email).toString());

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: participants,
        subject: `${fullName} invited you to a meeting!`,
        text: `${fullName} invited you to a meeting!\n\n${title}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            throw new Error(err);
        } else {
            return res.json({ info });
        }
    });

});

export default router;