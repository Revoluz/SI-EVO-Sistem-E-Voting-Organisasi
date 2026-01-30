#!/bin/bash

# Quick Start Script untuk SI-EVO Voting System

echo "╔════════════════════════════════════════╗"
echo "║   SI-EVO VOTING SYSTEM - Quick Start   ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Run test
echo "🧪 Running test..."
node test.js
echo ""

echo "✅ Ready to start!"
echo "Run: npm start"
