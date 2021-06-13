FROM node:16-alpine3.13

WORKDIR /app

COPY . .

EXPOSE 8080

RUN npm install \
    && npm ls \
    && npm cache clean --force

CMD ["npm","run","serve"]