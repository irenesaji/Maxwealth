#!/bin/bash
# Script to help debug and fix the 403 Forbidden issue
# Run this after starting the backend

echo "=== Maxwealth Admin - Debug & Fix Script ==="
echo ""
echo "This script will help you identify your user and fix the role issue."
echo ""

# Check if user has mysql/psql client
if command -v mysql &> /dev/null; then
    echo "✓ Found mysql client"
    echo ""
    echo "Please enter your database credentials to update your user role:"
    echo ""
    read -p "Database host (default: localhost): " DB_HOST
    DB_HOST=${DB_HOST:-localhost}
    
    read -p "Database user (default: root): " DB_USER
    DB_USER=${DB_USER:-root}
    
    read -sp "Database password: " DB_PASS
    echo ""
    
    read -p "Database name (default: maxwealth_user): " DB_NAME
    DB_NAME=${DB_NAME:-maxwealth_user}
    
    read -p "Your phone number: " PHONE_NUMBER
    
    echo ""
    echo "Executing: UPDATE users SET role = 'Admin' WHERE mobile = '$PHONE_NUMBER'"
    echo ""
    
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "UPDATE users SET role = 'Admin' WHERE mobile = '$PHONE_NUMBER';"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ User role updated successfully!"
        echo ""
        echo "Next steps:"
        echo "1. Log out from the application"
        echo "2. Clear browser cache/cookies"
        echo "3. Log back in with your phone number and OTP"
        echo "4. Try creating an allocation again"
    else
        echo ""
        echo "✗ Error updating database. Please check your credentials."
    fi
else
    echo "✗ mysql client not found. Please use one of these manual options:"
    echo ""
    echo "Option 1: Connect to your database manually and run:"
    echo "  UPDATE users SET role = 'Admin' WHERE mobile = 'YOUR_PHONE_NUMBER';"
    echo ""
    echo "Option 2: Convert updated SQL file to TypeScript and run as a migration"
    echo ""
    echo "Option 3: Access your database through:"
    echo "  - phpMyAdmin (if available)"
    echo "  - MongoDB Compass (if using MongoDB)"
    echo "  - pgAdmin (if using PostgreSQL)"
fi

echo ""
echo "=== Debug Info ==="
echo "Backend: Running on port 3021"
echo "Frontend: Running on port 3001"
echo ""
echo "If you need more help, check FIX_ADMIN_ROLE.md in the root directory"
