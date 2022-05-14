import express from 'express';

import auth from './routes/auth';

const app = express();

app.use(express.json());

app.use('/auth', auth);

app.listen(4000, () => console.log("Server is up and running on port 4000"));