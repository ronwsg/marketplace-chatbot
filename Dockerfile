FROM node:6.7.0

# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

#Intall gulp
RUN npm install -g gulp

# Install app dependencies
COPY package.json /usr/src/app/

RUN npm install

# Bundle app source
COPY . /usr/src/app

RUN gulp dist && gulp compile-server

EXPOSE 8080

ENTRYPOINT [ "gulp", "prod" ]
