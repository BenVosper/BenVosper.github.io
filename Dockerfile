FROM node:21

COPY . /app
WORKDIR /app

RUN npm install

ENV PORT=$PORT
EXPOSE $PORT
ENTRYPOINT ["/app/entrypoint.sh"]
