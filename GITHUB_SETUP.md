# 🚀 How to Push to GitHub

## Step 1: Create GitHub Repository
1. Go to https://github.com and login
2. Click the **"+"** icon → **"New repository"**
3. Name: `giftofgrace` (or your preferred name)
4. Choose **Public** or **Private**
5. **DO NOT** check "Initialize with README"
6. Click **"Create repository"**

## Step 2: Run These Commands

```bash
# Navigate to your project (if not already there)
cd d:\GiftOfGrace\giftofgrace

# Stage all files
git add .

# Commit your changes
git commit -m "Initial commit: Gift of Grace e-commerce website"

# Add your GitHub repository as remote
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/giftofgrace.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/giftofgrace.git
git branch -M main
git push -u origin main
```

## If You Need to Set Git User (First Time)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Troubleshooting

**If you get authentication error:**
- Use a Personal Access Token instead of password
- Generate one: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Use token as password when pushing

**If repository already exists on GitHub:**
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

**To update after making changes:**
```bash
git add .
git commit -m "Your commit message"
git push
```

