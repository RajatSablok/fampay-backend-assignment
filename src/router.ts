import { searchRoutes } from './api/videos/routes';
import { decoratedRouter as router } from './utils/express';

const BASE_ROUTE = '/api';

router.use(BASE_ROUTE, searchRoutes);

export { router };
