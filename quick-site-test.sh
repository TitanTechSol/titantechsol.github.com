#!/bin/bash
# CAUSAI Enhanced: Quick Site Health Check Script
# Usage: ./quick-site-test.sh

echo "🚀 TitanTechSol Site Health Check"
echo "=================================="

# Check if server is running
echo ""
echo "🌐 Checking server status..."
if curl -s http://localhost:9000 > /dev/null; then
    echo "✅ Server is running on http://localhost:9000"
else
    echo "❌ Server not running. Start with: npm start"
    exit 1
fi

# Test main pages
echo ""
echo "📄 Testing page responses..."
pages=("/" "/about" "/services" "/portfolio" "/team" "/contact")

for page in "${pages[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:9000$page")
    if [ "$status" = "200" ]; then
        echo "✅ $page - OK ($status)"
    else
        echo "❌ $page - ERROR ($status)"
    fi
done

# Check bundle files
echo ""
echo "📦 Checking build files..."
if [ -f "public/bundle.js" ]; then
    echo "✅ Main bundle found"
else
    echo "⚠️ Main bundle not found - run: npm run build"
fi

if [ -f "public/react-vendor*.js" ]; then
    echo "✅ React vendor bundle found"
else
    echo "⚠️ React vendor bundle not found"
fi

echo ""
echo "🔗 Quick Test URLs:"
echo "   Home: http://localhost:9000/"
echo "   Services (Interactive): http://localhost:9000/services"
echo ""
echo "📋 Manual Tests:"
echo "   [ ] Interactive service navigation working"
echo "   [ ] All pages load without errors"
echo "   [ ] Mobile responsive design"
echo "   [ ] Navigation menu functional"
echo ""
echo "✨ Test complete! Check FINAL-SITE-TEST-RESULTS.md for detailed analysis."
