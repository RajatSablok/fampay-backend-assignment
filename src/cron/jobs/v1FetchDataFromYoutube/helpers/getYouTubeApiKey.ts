import 'dotenv-safe/config';
import { Redis as RedisClient } from 'ioredis';

import { YOUTUBE_API_RATE_LIMIT } from '../../../../utils/constants';
import { logger } from '../../../../utils/logger';

/**
 * 1. Get all keys from environment
 * 2. In a loop, check if the key exists in redis
 * 3. If it exists in skipKeys, continue (skip to next key)
 * 4. If it does not exist, set it to 10000 and return the key
 * 5. If it does exist and has a value of 0, continue (skip to next key)
 * 6. If it does exist and has a value greater than 0, decrement it by 1 and return the key
 */

/**
 * Gets a valid YouTube API key (logic is explained above)
 * @param redisClient Redis client
 * @param skipKeys Array of keys that have already been tried
 * @returns YouTube API key or undefined if all keys have been exhausted
 */
export const getYouTubeApiKey = async ({
	redisClient,
	skipKeys,
}: {
	redisClient: RedisClient;
	skipKeys?: Array<string>;
}): Promise<string | undefined> => {
	const YOUTUBE_API_KEYS = process.env.YOUTUBE_API_KEYS?.split(',') || [];

	let finalKey: string | undefined;
	for (const key of YOUTUBE_API_KEYS) {
		logger.debug(`Checking key ${key} for remaining requests`);
		if (skipKeys?.includes(key)) {
			logger.info(`Skipping key ${key} as it has already been tried`);
			continue;
		}

		const remainingRequests = await redisClient.get(key);

		if (!remainingRequests) {
			await redisClient.set(key, YOUTUBE_API_RATE_LIMIT);
			finalKey = key;
			break;
		}
		if (parseInt(remainingRequests) === 0) {
			logger.info(`Skipping key ${key} as it has no remaining requests`);
			continue;
		}
		await redisClient.decr(key);
		finalKey = key;
		break;
	}

	if (!finalKey) {
		logger.critical('All YouTube API keys have been exhausted');
	}

	return finalKey;
};
