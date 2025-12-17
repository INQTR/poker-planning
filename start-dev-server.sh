#!/bin/bash

# Start the development server for AgileKit
# This script starts both the Convex backend and Next.js frontend

echo "Starting development server for AgileKit..."
echo "=================================================="

# Function to start Convex backend
start_convex() {
    echo "Starting Convex backend..."
    npx convex dev
}

# Function to start Next.js development server
start_nextjs() {
    echo "Starting Next.js development server..."
    npm run dev
}

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "Error: This doesn't appear to be the agilekit project directory."
    echo "Please run this script from the root of the agilekit project."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH."
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed or not in PATH."
    exit 1
fi

echo "Node.js version:"
node --version
echo "npm version:"
npm --version

# Start both services in background
echo ""
echo "Starting services..."
echo ""

# Start Convex backend in background
start_convex &
CONVEX_PID=$!

# Give Convex a moment to start
sleep 3

# Start Next.js development server in background  
start_nextjs &
NEXTJS_PID=$!

echo "Services started successfully!"
echo "Convex backend PID: $CONVEX_PID"
echo "Next.js development server PID: $NEXTJS_PID"

echo ""
echo "Application URLs:"
echo "- Frontend: http://localhost:3000"
echo "- Backend: http://127.0.0.1:3210"
echo ""
echo "To stop the servers, use: pkill -P $CONVEX_PID $NEXTJS_PID"
echo "=================================================="

# Wait for processes to complete (this will keep the script running)
wait