import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, isProduction } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { apiRouter } from './routes/index.js';

export const app = express();

app.set('trust proxy', 1); // behind Render's proxy
app.disable('x-powered-by');

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json({ limit: '100kb' }));
app.use(morgan(isProduction ? 'combined' : 'dev'));

app.get('/', (_req, res) => {
  res.json({ name: 'Retain API', health: '/api/health' });
});
app.use('/api', apiRouter);

app.use(notFound);
app.use(errorHandler);
