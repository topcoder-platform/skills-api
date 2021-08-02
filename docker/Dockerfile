# Use the base image with Node.js 12
FROM node:12

# Set working directory for future use
WORKDIR /usr/src/app

# Copy the current directory into the Docker image
COPY . /usr/src/app

# Install the dependencies from package.json
RUN npm install

# Expose port
EXPOSE 3000

# start api
CMD npm start
