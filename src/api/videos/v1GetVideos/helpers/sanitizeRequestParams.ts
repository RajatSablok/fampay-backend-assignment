import { TGetVideosPayload } from '../types';

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
