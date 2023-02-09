export type TYouTubeSearchResponse = {
	kind: string;
	etag: string;
	nextPageToken: string;
	regionCode: string;
	pageInfo: TPageInfo;
	items: Array<TItem>;
};

type TItem = {
	kind: string;
	etag: string;
	id: TId;
	snippet: TSnippet;
};

type TId = {
	kind: string;
	videoId: string;
};

type TSnippet = {
	publishedAt: Date;
	channelId: string;
	title: string;
	description: string;
	thumbnails: TThumbnails;
	channelTitle: string;
	liveBroadcastContent: string;
	publishTime: Date;
};

type TThumbnails = {
	default: TDefault;
	medium: TDefault;
	high: TDefault;
};

type TDefault = {
	url: string;
	width: number;
	height: number;
};

type TPageInfo = {
	totalResults: number;
	resultsPerPage: number;
};
