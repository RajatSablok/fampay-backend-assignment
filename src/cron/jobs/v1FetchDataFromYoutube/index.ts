import { CronJob } from 'cron';
import { Redis as RedisClient } from 'ioredis';

import { TVideoData } from '../../../models/videoData.model';
import { FETCH_YOUTUBE_DATA_CRON_CONFIG } from '../../../utils/constants';
import { logger } from '../../../utils/logger';
import { createOrReturnDBConnection } from '../../../utils/mongo';
import { redis } from '../../../utils/redis';

import { fetchVideosFromYouTube } from './helpers/fetchVideosFromYouTube';
import { saveVideoDataToDb } from './helpers/saveVideoDataToDb';

const v1FetchDataFromYoutube = async () => {
	try {
		logger.info(`v1FetchDataFromYoutube started at ${new Date()}`);
		await createOrReturnDBConnection({ dbUri: process.env.DB_URI! });

		const videos = await fetchVideosFromYouTube({ redisClient: redis.client as RedisClient });

		if (!videos || !videos.items.length) {
			return;
		}

		const allVideoData: Array<TVideoData> = videos.items.map((video) => {
			const { title, description, publishedAt, thumbnails, channelTitle, channelId } = video.snippet;
			const { videoId } = video.id;

			return {
				title,
				description,
				publishedAt,
				channelTitle,
				channelId,
				thumbnailImageUrl: thumbnails.high.url,
				youtubeVideoId: videoId,
			};
		});

		await saveVideoDataToDb(allVideoData);

		return;
	} catch (error) {
		logger.error({ error, prefixMsg: `An error occurred in v1FetchDataFromYoutube` });
	}
};

export const fetchYouTubeDataCronJob = new CronJob(
	FETCH_YOUTUBE_DATA_CRON_CONFIG,
	v1FetchDataFromYoutube,
	null,
	false,
	'Asia/Kolkata',
);
