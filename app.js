import express from 'express';
import { sitegroundDB } from './db.js';

import dotenv from 'dotenv'
import morgan from 'morgan';
import cors from 'cors';
import routesScripts from './routesScripts.js';


dotenv.config()
const port = process.env.PORT;
const app = express();

const corsOptions = {
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.urlencoded({
  extended: true,
}));


app.use(routesScripts);


const main = async () => {
  try {
    await sitegroundDB.sync();
    await app.listen(port, () => console.log(`ready at port ${port}`));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

main();