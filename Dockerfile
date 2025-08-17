# Use official Node image as base
FROM node:14-buster

# Install Meteor
RUN curl https://install.meteor.com/ | sh

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN meteor npm install --unsafe-perm

# Copy application code
COPY . .

# Expose default Meteor port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
