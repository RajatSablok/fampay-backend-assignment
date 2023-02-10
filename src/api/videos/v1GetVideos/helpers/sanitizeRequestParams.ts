import { TGetVideosPayload } from '../types';

/**
 * @description Sanitizes the request params to prevent malicious requests
 * @param limit Number of videos to be returned
 * @param page Page number
 * @returns { limit: number; page: number }
 */
export const sanitizeParams = ({ limit = '10', page = '1' }: TGetVideosPayload): { limit: number; page: number } => {
	let sanitizedLimit = parseInt(limit, 10);
	let sanitizedPage = parseInt(page, 10);

	if (sanitizedLimit <= 0 || sanitizedLimit > 100) {
		sanitizedLimit = 10;
	}
	if (sanitizedPage <= 0) {
		sanitizedPage = 1;
	}

	return { limit: sanitizedLimit, page: sanitizedPage };
};
