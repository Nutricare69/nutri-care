# STAGE 1: Build the React app
FROM node:22-alpine AS builder

# Install compatibility libraries for React 19/Vite 7
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Add this temporarily to debug
RUN find src -name "SignUp.jsx"

# 🌟 ADD THIS LINE TO DEBUG:
RUN ls -R src/pages/SignUp/

# STAGE 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy the built files from the 'builder' stage to Nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]