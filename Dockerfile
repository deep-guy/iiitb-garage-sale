#  Dockerfile for Node Express Backend

FROM node:15

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./
RUN npm install -g npm@7.13.0
RUN npm install --silent

# Copy app source code
COPY . .

# Exports
EXPOSE 3000

CMD ["npm","start"]
