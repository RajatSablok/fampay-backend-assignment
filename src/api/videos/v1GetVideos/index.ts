import { TVideoData } from '../../../models/videoData.model';
import { logger } from '../../../utils/logger';

import { getVideosFromDb } from './helpers/getVideosFromDb';
import { sanitizeParams } from './helpers/sanitizeRequestParams';
import { TGetVideosPayload } from './types';

/**
 * @description Get paginated video data from the database (either all or filtered by title or description)
 * @param limit Number of videos to be returned
 * @param page Page number
 * @param description Description to be used for filtering
 * @param title Title to be used for filtering
 * @returns Promise<Array<TVideoData | undefined> | null>
 */
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
