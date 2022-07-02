FROM node:18.4.0-alpine3.16
ADD ./ /service
WORKDIR /service
RUN npm install

ENTRYPOINT npm start
