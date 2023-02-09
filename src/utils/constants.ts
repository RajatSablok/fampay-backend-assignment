export const SEARCH_QUERY = 'backend development tutorial';

export const YOUTUBE_SEARCH_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

export const YOUTUBE_API_RATE_LIMIT = 10000;

export const YOUTUBE_API_HIT_FREQUENCY_IN_SECONDS = 10;

export const FETCH_YOUTUBE_DATA_CRON_CONFIG = `*/${YOUTUBE_API_HIT_FREQUENCY_IN_SECONDS} * * * * *`;
