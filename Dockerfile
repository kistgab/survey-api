FROM node:20.11
WORKDIR /usr/src/survey-api
RUN npm ci --production