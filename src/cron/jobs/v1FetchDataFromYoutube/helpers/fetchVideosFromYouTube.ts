import axios from 'axios';
import { Redis as RedisClient } from 'ioredis';

import {
	SEARCH_QUERY,
	YOUTUBE_API_HIT_FREQUENCY_IN_SECONDS,
	YOUTUBE_SEARCH_BASE_URL,
} from '../../../../utils/constants';
import { logger } from '../../../../utils/logger';
import { TYouTubeSearchResponse } from '../types';

import { getYouTubeApiKey } from './getYouTubeApiKey';

/**
 * Fetches videos from YouTube recursively until a valid API key is found
 * @param redisClient Redis client
 * @param keysTried Array of keys that have already been tried
 * @returns YouTube search response or null if all keys have been exhausted
 */
export const fetchVideosFromYouTube = async ({
	redisClient,
	keysTried = [],
}: {
	redisClient: RedisClient;
	keysTried?: Array<string>;
}): Promise<TYouTubeSearchResponse | null> => {
	try {
		const youtubeApiKey = await getYouTubeApiKey({ redisClient, skipKeys: keysTried });

		logger.debug(`Selected YouTube API key: ${youtubeApiKey}`);

		if (!youtubeApiKey) {
			logger.critical('All YouTube API keys have been exhausted');
			return null;
		}
		keysTried.push(youtubeApiKey);

		const now = new Date();
		// publishedAfter should be YOUTUBE_API_HIT_FREQUENCY_IN_SECONDS seconds before now in the format of 2021-01-01T00:00:00Z
		const publishedAfter = new Date(now.getTime() - YOUTUBE_API_HIT_FREQUENCY_IN_SECONDS * 1000)
			.toISOString()
			.replace(/\.\d{3}Z$/, 'Z');

		const response = await axios.get(YOUTUBE_SEARCH_BASE_URL, {
			params: {
				part: 'snippet',
				key: youtubeApiKey,
				type: 'video',
				order: 'date',
				publishedAfter,
				q: SEARCH_QUERY,
			},
		});

		logger.debug(`Response: ${JSON.stringify(response.data)} from YouTube API`);
		logger.debug(`Response status: ${response.status} from YouTube API`);

		return response.data as TYouTubeSearchResponse;
	} catch (error) {
		logger.error({ error, prefixMsg: `An error occurred in fetchVideosFromYouTube` });

		// If the error is due to the API key being exhausted, try again with a different key
		return await fetchVideosFromYouTube({ redisClient, keysTried });
	}
};
