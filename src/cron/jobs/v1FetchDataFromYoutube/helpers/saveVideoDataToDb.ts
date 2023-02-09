import { TVideoData, VideoDataModel } from '../../../../models/videoData.model';

export const saveVideoDataToDb = async (videos: Array<TVideoData>): Promise<void> => {
	await VideoDataModel.insertMany(videos, { ordered: false, rawResult: true });
};
