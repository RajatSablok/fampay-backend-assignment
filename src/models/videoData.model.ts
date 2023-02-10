import { Schema, model, Types } from 'mongoose';

type TVideoData = {
	title: string;
	description: string;
	publishedAt: Date;
	thumbnailImageUrl: string;
	youtubeVideoId: string;
	channelId: string;
	channelTitle: string;
};

type TRawVideoData = TVideoData & {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
};

const videoDataSchema = new Schema<TVideoData>(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		publishedAt: {
			type: Date,
			required: true,
		},
		thumbnailImageUrl: {
			type: String,
			required: true,
		},
		channelId: {
			type: String,
			required: true,
		},
		channelTitle: {
			type: String,
			required: true,
		},
		youtubeVideoId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

videoDataSchema.index({ youtubeVideoId: 1 }, { unique: true }); // To ensure that same video is not inserted twice
videoDataSchema.index({
	title: 'text',
	description: 'text',
}); // To enable full text search on title and description
videoDataSchema.index({ publishedAt: -1 }); // To sort by publishedAt in descending order

const VideoDataModel = model('VideoData', videoDataSchema);

export { TVideoData, TRawVideoData, VideoDataModel };
