# Use the Node 19 Alpine image
FROM node:19-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# 🌟 IMPORTANT: This installs ONLY the production dependencies.
# It will skip 'nodemon' since it's a devDependency (or you can move it to devDependencies)
RUN npm install --omit=dev

# Copy all source code
COPY . .

# Expose your Express port
EXPOSE 5000

# Start the app using the 'start' script we updated
CMD ["npm", "start"]