# Stage 1: Build the Astro site
FROM node:lts-alpine AS build

WORKDIR /app

# Install dependencies based on package-lock.json
COPY package*.json ./
RUN npm install

# Copy the rest of the source code and build the static site
COPY . .
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:stable-alpine

# Set Nginx to listen on port 3000 instead of 80
RUN sed -i 's/80;/3000;/g' /etc/nginx/conf.d/default.conf

# Copy the built files from the build stage to Nginx's default public directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]