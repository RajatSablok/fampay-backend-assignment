import { TVideoData } from '../../../models/videoData.model';
import { logger } from '../../../utils/logger';

import { getVideosFromDb } from './helpers/getVideosFromDb';
import { sanitizeParams } from './helpers/sanitizeRequestParams';
import { TGetVideosPayload } from './types';

export const v1GetVideos = async ({
	limit,
	page,
	description,
	title,
}: TGetVideosPayload): Promise<Array<TVideoData | undefined> | null> => {
	try {
		const sanitizedParams = sanitizeParams({ limit, page });

		return getVideosFromDb({ ...sanitizedParams, title, description });
	} catch (error) {
		logger.error({ error, prefixMsg: `An error occurred in v1GetVideoData` });
	}
	return null;
};
