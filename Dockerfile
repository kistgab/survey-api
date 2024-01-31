FROM node:20.11
WORKDIR /usr/src/survey-api
COPY package*.json .
RUN npm ci --production