FROM node:12
RUN npm install -g ganache-cli
EXPOSE 8545
ENTRYPOINT [ "ganache-cli", "--port", "8545", "--host", "0.0.0.0", "-d" ]
