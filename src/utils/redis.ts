import Redis, { Redis as RedisClient } from 'ioredis';

import { logger } from './logger';

const redisConnection = ({
	redisHost,
	redisPort,
	redisDB,
}: {
	redisHost: string;
	redisPort: number;
	redisDB: number;
}): RedisClient => {
	const client = new Redis(redisPort, redisHost, { db: redisDB });

	client.on('connect', () => logger.info('Redis client connected'));

	client.on('error', (error) => logger.error({ prefixMsg: 'Something went wrong with redis', error }));

	return client;
};

const getRedisConnection = (): RedisClient => {
	return redisConnection({
		redisHost: process.env.REDIS_HOST!,
		redisPort: parseInt(process.env.REDIS_PORT!),
		redisDB: parseInt(process.env.REDIS_DATABASE!),
	});
};

export { getRedisConnection };
