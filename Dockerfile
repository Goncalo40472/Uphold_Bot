# Node runtime version
FROM node:20.8.1

# Set the working directory
WORKDIR /uphold_bot

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install npm@latest -g &&\
    npm install axios &&\
    npm install pg

# Copy the rest of the application code to the working directory
COPY . .

# Expose a port
EXPOSE 8080

# Command to run the bot
CMD ["node", "index.js"]