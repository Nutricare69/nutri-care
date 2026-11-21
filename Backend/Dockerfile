# Upgrade to an active LTS Node Alpine image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Update Alpine OS packages to patch system-level vulnerabilities
RUN apk update && apk upgrade --no-cache

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --omit=dev

# Copy all source code
COPY . .

# Expose your Express port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
