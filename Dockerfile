FROM node:12 as truffle
RUN npm install -g truffle

FROM truffle as truffleapp
RUN mkdir -p /src
COPY . /src/
WORKDIR /src
RUN yarn
EXPOSE 3000
