#!/bin/bash
# Deployment Architecture Verification Script
# Tests whether domains are correctly routed to appropriate services

echo "🔍 yoohoo.guru Deployment Architecture Verification"
echo "================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test domains
DOMAINS=("yoohoo.guru" "www.yoohoo.guru" "api.yoohoo.guru")

echo "📋 Expected Architecture:"
echo "  yoohoo.guru     → Vercel frontend (React app)"
echo "  www.yoohoo.guru → Vercel frontend (React app)" 
echo "  api.yoohoo.guru → Railway backend (JSON API)"
echo ""

# Function to test domain routing
test_domain() {
    local domain=$1
    local expected_type=$2
    
    echo -n "🌐 Testing $domain... "
    
    # Get response with timeout
    response=$(curl -s -m 10 -H "User-Agent: yoohoo-deployment-test" "https://$domain/" 2>/dev/null)
    http_code=$(curl -s -m 10 -o /dev/null -w "%{http_code}" "https://$domain/" 2>/dev/null)
    
    if [ -z "$response" ] || [ "$http_code" = "000" ]; then
        echo -e "${RED}❌ FAILED${NC} - Domain not accessible"
        return 1
    fi
    
    # Check content type to determine service
    if echo "$response" | grep -q "<!DOCTYPE html>" || echo "$response" | grep -q "<html"; then
        actual_type="frontend"
        service="Vercel/Frontend"
    elif echo "$response" | grep -q '"message"' || echo "$response" | grep -q '"error"' || echo "$response" | grep -q '"status"'; then
        actual_type="backend"  
        service="Railway/Backend"
    else
        actual_type="unknown"
        service="Unknown Service"
    fi
    
    # Verify against expected type
    if [ "$actual_type" = "$expected_type" ]; then
        echo -e "${GREEN}✅ CORRECT${NC} - Serving from $service"
        
        # Additional checks for backend
        if [ "$expected_type" = "backend" ]; then
            if echo "$response" | grep -q "API-only server" || echo "$response" | grep -q "yoohoo.guru API"; then
                echo "    ${BLUE}ℹ${NC}  Backend properly configured as API-only"
            fi
        fi
        
        # Additional checks for frontend  
        if [ "$expected_type" = "frontend" ]; then
            if echo "$response" | grep -q "yoohoo" || echo "$response" | grep -q "skill"; then
                echo "    ${BLUE}ℹ${NC}  Frontend content detected"
            elif echo "$response" | grep -q "<!DOCTYPE html>"; then
                echo "    ${YELLOW}⚠${NC}  HTML served but may be blank/error page"
            fi
        fi
        
    else
        echo -e "${RED}❌ WRONG${NC} - Expected $expected_type, got $actual_type ($service)"
        echo "    ${YELLOW}🔧 Fix Required:${NC} Update DNS to point to correct service"
        return 1
    fi
}

# Test health endpoints
test_health() {
    echo ""
    echo "🏥 Testing API Health Endpoints:"
    
    # Test main API health
    echo -n "  /health endpoint... "
    health_response=$(curl -s -m 10 "https://api.yoohoo.guru/health" 2>/dev/null)
    
    if echo "$health_response" | grep -q '"status":"OK"' || echo "$health_response" | grep -q '"status": "OK"'; then
        echo -e "${GREEN}✅ HEALTHY${NC}"
    else
        echo -e "${RED}❌ UNHEALTHY${NC}"
        echo "    Response: $health_response"
    fi
    
    # Test API root
    echo -n "  /api endpoint... "
    api_response=$(curl -s -m 10 "https://api.yoohoo.guru/api" 2>/dev/null)
    
    if echo "$api_response" | grep -q "yoohoo.guru API" || echo "$api_response" | grep -q '"message"'; then
        echo -e "${GREEN}✅ ACTIVE${NC}"
    else
        echo -e "${RED}❌ INACTIVE${NC}"  
        echo "    Response: $api_response"
    fi
}

# Test CORS configuration  
test_cors() {
    echo ""
    echo "🔐 Testing CORS Configuration:"
    
    # Test CORS from frontend domain
    echo -n "  CORS from www.yoohoo.guru... "
    cors_response=$(curl -s -m 10 \
        -H "Origin: https://www.yoohoo.guru" \
        -H "Access-Control-Request-Method: GET" \
        -X OPTIONS "https://api.yoohoo.guru/api" 2>/dev/null)
        
    cors_header=$(curl -s -m 10 \
        -H "Origin: https://www.yoohoo.guru" \
        -I "https://api.yoohoo.guru/health" 2>/dev/null | grep -i "access-control-allow-origin")
    
    if [ -n "$cors_header" ]; then
        echo -e "${GREEN}✅ CONFIGURED${NC}"
        echo "    $cors_header"
    else
        echo -e "${RED}❌ NOT CONFIGURED${NC}"
        echo "    ${YELLOW}🔧 Fix Required:${NC} Add CORS_ORIGIN_PRODUCTION environment variable"
    fi
}

# Run all tests
echo "🚀 Starting Tests..."
echo ""

# Test domain routing
test_domain "yoohoo.guru" "frontend"
test_domain "www.yoohoo.guru" "frontend"  
test_domain "api.yoohoo.guru" "backend"

# Test health endpoints
test_health

# Test CORS  
test_cors

echo ""
echo "🎯 Summary:"
echo "  If any tests failed, check DNS configuration and environment variables"
echo "  Ensure Railway has SERVE_FRONTEND=false"  
echo "  Ensure domains point to correct services (Vercel for frontend, Railway for API)"
echo ""
echo "📚 Documentation:"
echo "  - See DEPLOYMENT_ROUTING_FIX.md for detailed instructions"
echo "  - Check Railway environment variables"
echo "  - Verify Vercel deployment status"