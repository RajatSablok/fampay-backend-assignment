
# use node 18.5 on debian 11 (bullseye)
FROM node:18.5-bullseye as fampay-backend-assignment

# create a directory /opt/fampay-backend-assignment
RUN mkdir -p /opt/fampay-backend-assignment

# use /opt/fampay-backend-assignment as workdir
WORKDIR /opt/fampay-backend-assignment

# copy the repository to workdir
COPY . .

RUN touch .env

ENV GITHUB_TOKEN=${GITHUB_TOKEN}

# install the required packages
RUN yarn install

# build distributables
RUN yarn build

# Use all above build steps
FROM fampay-backend-assignment as fampay-backend-assignment-server

# export port 3000
EXPOSE 3000

# run yarn start
RUN echo "build server"
CMD [ "yarn", "start" ]