# Use the base image with Node.js 12
FROM node:12

# Set working directory for future use
WORKDIR /skills_api

# Copy the current directory into the Docker image
COPY . /skills_api

# Install the dependencies from package.json
RUN npm install

# Expose port
EXPOSE 3000

# start api
CMD npm start
