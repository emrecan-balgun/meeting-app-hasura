import express from 'express';
import nodemailer from 'nodemailer';
import moment from 'moment';
import axios from 'axios';
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

    const schedule_event = {
        type: "create_scheduled_event",
        args: {
            webhook: "{{ACTION_BASE_ENDPOINT}}/webhooks/meeting_reminder",
            schedule_at: moment(meetings_by_pk.meeting_date).subtract(2, "minutes"),
            payload: {
                meeting_id: meeting.id,
            }
        },
    };

    const add_event = await axios("http://localhost:8080/v1/query", {
        method: "POST",
        data: JSON.stringify(schedule_event),
        headers: {
            "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        }
    })

    const event_data = add_event.data;

    console.log(event_data);

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

router.post('/meeting_reminder', async(req, res, next) => {
    const { meeting_id } = req.body.payload;

    const { meetings_by_pk } = await Hasura.request(GET_MEETING_PARTICIPANTS, {
        id: meeting_id,
    });

    const title = meetings_by_pk.title;
    const { email } = meetings_by_pk.user;
    const participants = meetings_by_pk.participants
        .map(({ user }) => user.email)

    participants.push(email);

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: participants.toString(),
        subject: `Your meeting ${title} will start soon!`,
        text: `Your meeting ${title} will start in two minutes!
        You can click the link to join the meeting:
        `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            throw new Error(err);
        } else {
            return res.json({ info });
        }
    });
})

export default router;