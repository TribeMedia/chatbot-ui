# Base image
FROM node:18-bookworm

RUN apt-get update && apt-get install -y libc6 build-essential git

ENV ONNXRUNTIME_NODE_DISABLE_NATIVE 1

# Create app directory
WORKDIR /app

RUN npm install onnxruntime-node --build-from-source

# Copy package.json and package-lock.json before other files
# Utilizes Docker cache to save re-installing dependencies if unchanged
COPY package*.json ./
COPY .env ./

# Install dependencies
RUN npm install

# Copy over rest of app files
COPY . .

# Build next app
RUN ONNXRUNTIME_NODE_DISABLE_NATIVE=1 npm run build

# Expose port
EXPOSE 3000

# Start the next server
CMD ["npm", "start"]
