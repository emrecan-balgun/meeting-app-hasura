import express from 'express';

const router = express.Router();

router.post('/register', (req, res) => {
    const input = req.body.input.data;
    res.json({ accessToken: 'accessToken' });
})

export default router;