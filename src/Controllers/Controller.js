import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!\n')
})

router.all('*', (req, res) => {
    res.sendStatus(404).end()
})

export default router;