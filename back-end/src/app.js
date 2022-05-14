import express from 'express';
const app = express();

app.use(express.json());

app.post('/register', (req, res) => {
    const input = req.body.input.data;

    res.json({
        accessToken: 'accessToken'
    });
});

app.listen(4000, () => console.log("Server is up and running on port 4000"));