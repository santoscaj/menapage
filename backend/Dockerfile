FROM node:16-alpine3.13

WORKDIR /app

COPY . .

EXPOSE 3000

RUN npm install \
    && npm ls  \
    && npm cache clean --force

CMD ["npm","start"]