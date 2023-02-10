# Fampay Backend Assignment

## Basic features:

1. Cron job to periodically fetch data from YouTube API
2. A simple GET API which either:
	1. returns the stored videos based on search query params (title and description)
	2. returns the stored video data in a paginated response sorted in descending order of published datetime
3. YouTube API key rotator to use a different key if a particular key's quota has been exhausted
4. Dockerised project 
5. Scalable and optimized backend 

## Additional features for those bonus points:
1. API key rotator to pick up the next API key in case rate limit of any key has been exhausted
2. Flexible search API: A video with title `How to make tea?` will match for the search query `tea how`. The same also works with description.

## Tools and technologies used:
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

## Reasoning behind some of the architechtural decisions:
1. Choice of tech stack
Since we were free to choose our tech stack, I went ahead with the one that I am most comfortable with. NodeJS makes it really easy to setup a backend application. It allows for building scalable network applications. With its fast performance, it makes it an ideal choice for building high-performance backend applications.\
MongoDB is a widely used NoSQL database that is flexible, scalable, and provides high performance. It's a great fit for building applications that require a lot of data manipulation, as it allows for easy storage and retrieval of data in a variety of forms.\
The combination of Node.js and TypeScript provides a fast and stable runtime environment with improved type safety, while Express.js, MongoDB, Redis, and Docker provide the necessary tools to build and deploy robust applications.
2. Cron
The cron is currently running on the server. If deployed like this, they will be running in the same container. This is a very bad design since the cron will always consume a lot of memory, so even if we don't necessarily have to scale our APIs, we will have to scale the server.
A better thing to do would be run our APIs on one server, and crons on another. This could be done by eliminating the `cron` packafge that I used and using something like `crontab` to manage our cron processes.
3. Using the same API for both fetching all data and search:
Even though it was mentioned that we have to create 2 different APIs, I believe that they server the same purpose -- to return video data. So if the search params (either title or description) are sent, it'll search and return, otherwise it'll just return the paginated response. Also, the response is always paginated so as to not put too much load on the server or the DB. 
4. YouTube API Key Rotation
The current key rotation works like this: 
	1. Before fetching the data from YouTube, we pick up the API keys from the environment 
	2. For each of the keys, we see how many times they have been used (I am maintaining a counter for each key)
	3. If the key is not found on Redis, that means it hasn't been used till now. So I set it to the actual API quota.
	4. If the key's remaining usage is not 0, we select it and decrement it by 0
	5. Apart from this, if any API still fails (could be if the counter is not correct), there is a fallback to recursively call our parent function `fetchDataFromYoutube` with information about the failed keys, so that we do not pick it up from redis.\
I believe that this is a pretty good architecture because we are not relying entirely on Redis and we have a fallback in place that will get us the next possible key.\
I will not go ahead with this archioture in production since calling a function (that does network calls) recursively should be avoided at all costs. But since this was a small task, I'm pretty proud of the fallback in place.

## Running the project:
```
1. git clone https://github.com/RajatSablok/fampay-backend-assignment
2. cd fampay-backend-assignment
```

### Running with docker:

Update the value of YOUTUBE_API_KEYS in docker-compose to actual API keys (csv) 
```
docker compose up
```

### Running manually with YARN

Create .env file by referencing .env.example
```
yarn build && yarn install && yarn start
```

Port 3000 is all yours now :))

---------
```javascript

if (youEnjoyed) {
    hireMe();
}

```
-----------
