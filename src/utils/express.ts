import { decorateRouter as myDecoratedRouter } from '@awaitjs/express';
import { Router } from 'express';

export const decoratedRouter = myDecoratedRouter(Router());
