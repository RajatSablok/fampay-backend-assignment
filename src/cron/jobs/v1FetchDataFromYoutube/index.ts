import { TVideoData, VideoDataModel } from '../../../models/videoData.model';
import { logger } from '../../../utils/logger';
import { createOrReturnDBConnection } from '../../../utils/mongo';
import { getRedisConnection } from '../../../utils/redis';

import { fetchVideosFromYouTube } from './helpers/fetchVideosFromYouTube';

const saveVideoDataToDb = (videos: Array<TVideoData>) => {
	return VideoDataModel.insertMany(videos, { ordered: false, rawResult: true });
};

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

		logger.debug(`allVideoData: ${JSON.stringify(allVideoData)}`);

		const res = await saveVideoDataToDb(allVideoData);

		logger.debug(`res: ${JSON.stringify(res)}`);

		return true;
	} catch (error) {
		logger.error({ error, prefixMsg: `An error occurred in v1SampleCron` });
		return false;
	}
};

v1FetchDataFromYoutube().catch((error) => {
	logger.error({ error, prefixMsg: `An error occurred in v1SampleCron` });
});
