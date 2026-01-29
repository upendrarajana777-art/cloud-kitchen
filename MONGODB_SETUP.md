# 🔧 MongoDB Atlas Setup Guide

## Quick Setup Steps:

### 1. Go to MongoDB Atlas
Visit: https://cloud.mongodb.com

### 2. Create a Free Cluster
- Click "Build a Database"
- Choose FREE tier (M0)
- Select a cloud provider & region (choose closest to you)
- Click "Create"

### 3. Create Database User
- Go to "Database Access" (left sidebar)
- Click "Add New Database User"
- Choose "Password" authentication
- Username: `cloudkitchen`
- Password: Generate a secure password (SAVE THIS!)
- Database User Privileges: "Read and write to any database"
- Click "Add User"

### 4. Whitelist IP Address
- Go to "Network Access" (left sidebar)
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (for development)
  - This adds `0.0.0.0/0`
- Click "Confirm"

### 5. Get Connection String
- Go to "Database" (left sidebar)
- Click "Connect" on your cluster
- Choose "Connect your application"
- Driver: Node.js
- Copy the connection string

It will look like:
```
mongodb+srv://cloudkitchen:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Update Your .env File
Open `server/.env` and replace the MONGODB_URI line:

```env
MONGODB_URI=mongodb+srv://cloudkitchen:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/cloudkitchen?retryWrites=true&w=majority
```

**Important:**
- Replace `<password>` with your actual database user password
- Replace `cluster0.xxxxx` with your actual cluster URL
- Add `/cloudkitchen` before the `?` to specify the database name

### 7. Test Connection
```bash
cd server
npm start
```

You should see:
```
✅ MongoDB Atlas Connected
🚀 Server running on port 5000
```

## Common Issues:

### "Invalid scheme" error
- Make sure the URI starts with `mongodb+srv://`
- No spaces in the connection string

### "Authentication failed"
- Double-check username and password
- Special characters in password? URL-encode them

### "Network timeout"
- Check if IP is whitelisted in Network Access
- Try using `0.0.0.0/0` for testing

### Password has special characters?
Use [URL encoder](https://www.urlencoder.org/) for the password part.

Example:
- Password: `p@ss!word#123`
- Encoded: `p%40ss%21word%23123`

## Need Help?
If you don't have MongoDB Atlas set up yet, would you like me to help you:
1. Set up a local MongoDB instead?
2. Walk through the Atlas setup step-by-step?
