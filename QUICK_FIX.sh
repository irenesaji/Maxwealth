#!/bin/bash
# Quick fix for 403 Forbidden on Create Allocation
# Run this with: bash quick-fix.sh

set -e

echo "=========================================="
echo "Maxwealth - Quick Fix for Allocation Create"
echo "=========================================="
echo ""

# Check if backend is running
echo "Checking if backend is running..."
if curl -s http://localhost:3021/api &> /dev/null; then
    echo "✓ Backend is running on port 3021"
else
    echo "✗ Backend is not running on port 3021"
    echo "Please start the backend first:"
    echo "  cd maxwealth-bse-backend && npm start"
    exit 1
fi

echo ""
echo "To fix the 403 Forbidden error, run ONE of these options:"
echo ""
echo "========== OPTION 1: Using API Call (Quickest) =========="
echo ""
echo "1. Get your phone number from the login screen or browser storage"
echo "2. Run this curl command:"
echo ""
echo "    curl -X POST http://localhost:3021/api/dev/make-admin \\"
echo "      -H 'Content-Type: application/json' \\"
echo "      -d '{\"mobile\": \"+91XXXXXXXXXX\"}'"
echo ""
echo "Replace +91XXXXXXXXXX with your actual phone number"
echo ""

echo "========== OPTION 2: Using Database Directly =========="
echo ""
echo "1. Connect to your database (PostgreSQL/MySQL/MongoDB)"
echo "2. Find your user:"
echo "    SELECT * FROM users WHERE mobile='YOUR_PH_NUMBER';"
echo ""
echo "3. Update the role:"
echo "    UPDATE users SET role='Admin' WHERE mobile='YOUR_PH_NUMBER';"
echo ""

echo "========== OPTION 3: Check Your Phone Number =========="
echo ""
echo "If you don't know your phone number:"
echo "1. Check your browser's Application Storage:"
echo "   - Press F12 in browser"
echo "   - Go to Storage/Application tab"
echo "   - Look in localStorage for 'user_mobile' or similar"
echo ""
echo "2. Or check the backend logs when you logged in:"
echo "   - Look for log messages showing the phone number"
echo ""

echo ""
echo "========== TESTING AFTER FIX =========="
echo ""
echo "1. Log out completely (clear all cookies)"
echo "2. Close and reopen the browser"
echo "3. Log back in with your phone number and OTP"
echo "4. Go to Allocations → Create"
echo "5. Try creating a new allocation"
echo ""
echo "✓ Should work now instead of showing 403 Forbidden"
echo ""
