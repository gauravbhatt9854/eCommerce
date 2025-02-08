# Step 1: Use official Node.js image as base
FROM node:18-alpine

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json before copying other files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the app
COPY . .

# Step 6: Generate Prisma client & apply database migrations
RUN npx prisma generate
RUN npx prisma migrate deploy

# Step 7: Build the Next.js app
RUN npm run build

# Step 8: Expose the default port
EXPOSE 3000

# Step 9: Start the Next.js app in production mode
CMD ["npm", "run", "start"]
