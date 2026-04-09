#!/bin/bash
# Start script for Interactive Wall Calendar
# Usage: ./start-project.sh

echo "🏗️  Setting up Interactive Wall Calendar..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Setup complete!"
echo ""
echo "🚀 Starting development server..."
echo ""
echo "📺 Open your browser and go to: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
