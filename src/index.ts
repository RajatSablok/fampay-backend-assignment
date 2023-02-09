import 'dotenv-safe/config';
import { upgradeResponse } from '@yellowclass/yc-utils/dist/src/expressHelpers';
import compression from 'compression';
import timeout from 'connect-timeout';
import cors from 'cors';
import Express from 'express';
import httpContext from 'express-http-context';

import { config as serverConfig } from './config';
import { fetchYouTubeDataCronJob } from './cron/jobs/v1FetchDataFromYoutube';
import { router } from './router';
import { initLogger, logger } from './utils/logger';
import { createOrReturnDBConnection } from './utils/mongo';
import { getRedisConnection } from './utils/redis';

// Initialize the logger
initLogger({ logFile: './logs/express-app.log' });

// Initialize the Express App
const app = Express();
createOrReturnDBConnection({ dbUri: process.env.DB_URI! });

const redisClient = getRedisConnection();

app.use(timeout('60s'));
app.use(cors());
app.use(compression());
app.use(Express.json({ limit: '50mb' }));
app.use(Express.urlencoded({ limit: '50mb' }));
app.use(httpContext.middleware);

app.use((req, res, next) => {
	req.redisClient = redisClient;
	next();
});

upgradeResponse(app).use(router);

fetchYouTubeDataCronJob.start();

// eslint-disable-next-line func-names, no-unused-vars, consistent-return, @typescript-eslint/no-unused-vars
app.use((error, _, res, next) => {
	logger.error({ error });
	return res.status(500).json({
		status: 500,
		message: 'Internal Server Error',
		errors: { error: error.toString(), ...(error.errors ?? {}) },
	});
});

app.listen(serverConfig.port, () => {
	logger.info(`Server running at ${serverConfig.port}`);
});
