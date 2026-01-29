# Quick Local MongoDB Setup

## Option 1: Using Docker (Easiest)

```bash
# Start MongoDB container
docker run -d -p 27017:27017 --name cloudkitchen-mongodb mongo:latest

# Your .env is already configured for local MongoDB!
# Just run:
cd server
npm start
```

## Option 2: Install MongoDB Locally

### Windows:
1. Download: https://www.mongodb.com/try/download/community
2. Run installer (use default settings)
3. MongoDB will auto-start on port 27017

### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

## Option 3: MongoDB Atlas (Cloud - Free Forever)

If you prefer cloud hosting:

1. Go to: https://cloud.mongodb.com
2. Create free account
3. Create M0 (free) cluster
4. Create database user
5. Whitelist IP: 0.0.0.0/0
6. Get connection string
7. Update `server/.env`:

```env
MONGODB_URI=mongodb+srv://your_user:your_pass@cluster0.abcde.mongodb.net/cloudkitchen?retryWrites=true&w=majority
```

## Test Connection

```bash
cd server
npm start
```

You should see:
```
✅ MongoDB Atlas Connected
🚀 Server running on port 5000
```
