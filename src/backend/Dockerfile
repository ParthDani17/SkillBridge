# Step 1: Use official lightweight Node.js 20 LTS Alpine image
FROM node:20-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package dependency manifests
COPY package*.json ./

# Step 4: Install dependencies
RUN npm ci --omit=dev

# Step 5: Copy application source code
COPY . .

# Step 6: Create temp folder for Multer uploads if not present
RUN mkdir -p public/temp

# Step 7: Expose backend listening port
EXPOSE 5000

# Step 8: Start the backend server
CMD ["node", "server.js"]
