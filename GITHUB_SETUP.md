# GitHub Setup Instructions

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `makro` (or your preferred name)
3. Description: "Macro Outlook Tracker - Narrative Intelligence Platform"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Connect and Push

After creating the repository, GitHub will show you commands. Use these instead (already configured):

```bash
# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/makro.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Quick Setup Script

Or run this single command (replace YOUR_USERNAME):

```bash
git remote add origin https://github.com/YOUR_USERNAME/makro.git && git branch -M main && git push -u origin main
```

## Alternative: Using SSH

If you prefer SSH (and have SSH keys set up):

```bash
git remote add origin git@github.com:YOUR_USERNAME/makro.git
git branch -M main
git push -u origin main
```

---

**Note:** You'll be prompted for your GitHub credentials when pushing. Use a Personal Access Token if you have 2FA enabled.
