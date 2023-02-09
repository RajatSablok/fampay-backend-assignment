import { TVideoData, VideoDataModel } from '../../../../models/videoData.model';

export const getVideosFromDb = async ({
	title,
	description,
	limit,
	page,
}: {
	limit: number;
	page: number;
	title?: string;
	description?: string;
}): Promise<Array<TVideoData | undefined>> => {
	return VideoDataModel.find(
		{
			...((title || description) && {
				$text: {
					$search: `${title || ''} ${description || ''}`,
					$caseSensitive: false,
					$diacriticSensitive: true,
				},
			}),
		},
		{
			title: 1,
			description: 1,
			channelId: 1,
			channelTitle: 1,
			publishedAt: 1,
			thumbnailImageUrl: 1,
			youtubeVideoId: 1,
		},
		{
			sort: {
				publishedAt: -1,
			},
			limit: limit,
			skip: limit * (page - 1),
		},
	);
};
