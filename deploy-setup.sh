#!/bin/bash

echo "🚀 NutriCare Deployment Setup"
echo "=============================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore file..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Temporary folders
tmp/
temp/
EOF
    echo "✅ .gitignore created"
fi

# Check if environment files exist
if [ ! -f "server/.env" ]; then
    echo "📝 Creating server environment file..."
    cp server/env.example server/.env
    echo "✅ Server .env file created (please update with your values)"
fi

if [ ! -f "client/.env" ]; then
    echo "📝 Creating client environment file..."
    cp client/env.example client/.env
    echo "✅ Client .env file created (please update with your values)"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update server/.env with your actual environment variables"
echo "2. Update client/.env with your backend URL (after backend deployment)"
echo "3. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for deployment'"
echo "   git push"
echo "4. Follow the DEPLOYMENT.md guide to deploy on Vercel and Render"
echo ""
echo "🔗 Useful links:"
echo "- Vercel: https://vercel.com/dashboard"
echo "- Render: https://dashboard.render.com/"
echo "- MongoDB Atlas: https://cloud.mongodb.com/"
