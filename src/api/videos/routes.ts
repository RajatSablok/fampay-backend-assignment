import { Request, Response } from 'express';

import { decoratedRouter as router } from '../../utils/express';

import { v1GetVideos } from './v1GetVideos';

router.getAsync('/v1/videos', async (req: Request, res: Response) => {
	const data = await v1GetVideos(req.query);

	res.status(200).json(data);
});

export { router as searchRoutes };
