
# use node 18.5 on debian 11 (bullseye)
FROM node:18.5-bullseye as yc-node-microservice-boilerplate

# create a directory /opt/yc-node-microservice-boilerplate
RUN mkdir -p /opt/yc-node-microservice-boilerplate

# use /opt/yc-node-microservice-boilerplate as workdir
WORKDIR /opt/yc-node-microservice-boilerplate

# copy the repository to workdir
COPY . .

# set the bit registry (required for importing from yc-utils)
RUN npm config set @bit:registry https://node.bit.dev

# install the required packages
RUN yarn install

# build distributables
RUN yarn build


# Use all above build steps
FROM yc-node-microservice-boilerplate as yc-node-microservice-boilerplate-server
# export port 8088
EXPOSE 8088
# run yarn start
RUN echo "build server"
CMD [ "yarn", "start" ]


# Use all above build steps
FROM yc-node-microservice-boilerplate as yc-node-microservice-boilerplate-consumer-1
# run yarn start
RUN echo "build consumer1"
CMD [ "yarn", "start", "--consumerKey=UPDATE_ACTIVITY_SCOREBOARD" ]
