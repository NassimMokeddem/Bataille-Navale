import router from "../Controllers/Controller.js"
import express from "express";
import morgan from "morgan";

const app = express();
const port = 3000;

app.use(morgan('dev'));

app.use('/partie', router);

app.listen(port, () => {
    console.log(`Started app listening on port ${port}`)
})