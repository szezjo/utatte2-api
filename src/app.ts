import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import MainRouter from './routes/index.js';

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/', MainRouter);

app.get('/', (_req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
