import { TVideoData } from '../../../models/videoData.model';
import { logger } from '../../../utils/logger';
import { createOrReturnDBConnection } from '../../../utils/mongo';
import { getRedisConnection } from '../../../utils/redis';

import { fetchVideosFromYouTube } from './helpers/fetchVideosFromYouTube';
import { saveVideoDataToDb } from './helpers/saveVideoDataToDb';

const v1FetchDataFromYoutube = async () => {
	try {
		await createOrReturnDBConnection({ dbUri: process.env.DB_URI! });
		const redisClient = getRedisConnection();

		const videos = await fetchVideosFromYouTube({ redisClient });

		if (!videos || !videos.items.length) {
			return false;
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

		return true;
	} catch (error) {
		logger.error({ error, prefixMsg: `An error occurred in v1FetchDataFromYoutube` });
		return false;
	}
};

v1FetchDataFromYoutube()
	.then(() => {
		logger.info(`v1FetchDataFromYoutube completed successfully`);
		process.exit(0);
	})
	.catch((error) => {
		logger.error({ error, prefixMsg: `An error occurred in v1FetchDataFromYoutube` });
		process.exit(1);
	});
