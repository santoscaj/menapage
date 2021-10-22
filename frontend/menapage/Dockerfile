FROM node:16-alpine3.13

ENV VUE_APP_BACKEND='http://localhost:3000'

WORKDIR /app

COPY . .

EXPOSE 8080

RUN npm install -f \
    && npm ls \
    && npm cache clean --force

CMD ["npm","run","serve"]
