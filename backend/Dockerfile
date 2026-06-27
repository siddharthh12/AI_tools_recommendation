# Use the official Microsoft Playwright Node.js image which includes all browser dependencies
FROM mcr.microsoft.com/playwright:v1.44.1-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy package JSON files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the backend application code
COPY . .

# Expose the backend API port
EXPOSE 5000

# Run the Express server
CMD ["node", "server.js"]
