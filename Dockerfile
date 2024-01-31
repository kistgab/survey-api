FROM node:20.11
WORKDIR /usr/src/survey-api
COPY package*.json .
RUN npm ci --production
EXPOSE 3000
CMD [ "npm start" ]