import mongoose from 'mongoose';

import { logger } from './logger';

const connectToMongoDB = ({ dbUri }: { dbUri: string }) => mongoose.connect(dbUri);

/**
 *
 * @param params.dbUri The URI of the MongoDB database
 * @description - Connects to the MongoDB database if not connected or return existing connection
 * - Tries to reconnect to the database if the connection is lost
 * @returns A promise that resolves to a MongoDB connection
 */
export const createOrReturnDBConnection = ({ dbUri }: { dbUri: string }): Promise<mongoose.Connection> => {
	let db = mongoose.connection;

	return new Promise((resolve, reject) => {
		if (db.readyState) return resolve(db);

		connectToMongoDB({ dbUri });
		mongoose.Promise = global.Promise;
		// Get the default connection
		db = mongoose.connection;

		db.once('open', () => {
			logger.info('Connected to mongoose ');
			resolve(db);
		});

		db.on('connected', () => {
			logger.info('Mongoose connected');
			resolve(db);
		});

		db.on('reconnected', () => {
			logger.info('Mongoose reconnected');
			resolve(db);
		});

		db.on('disconnected', (err) => {
			logger.info('Mongoose default connection is disconnected');
			connectToMongoDB({ dbUri });
			reject(err);
		});

		// Bind connection to error event (to get notification of connection errors)
		db.on('error', (error) => {
			logger.error({ error });
			mongoose.disconnect();
		});

		process.on('SIGINT', () => {
			db.close(() => {
				logger.info('Mongoose default connection is disconnected due to application termination');
				process.exit(0);
			});
		});
	});
};
