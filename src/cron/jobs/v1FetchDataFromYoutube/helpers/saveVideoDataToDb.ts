import { TVideoData, VideoDataModel } from '../../../../models/videoData.model';

/**
 * @description Save video data to the database
 * @param videos Array of videos to be saved to the database
 * @returns Promise<void>
 */
export const saveVideoDataToDb = async (videos: Array<TVideoData>): Promise<void> => {
	await VideoDataModel.insertMany(videos, { ordered: false, rawResult: true });
};
