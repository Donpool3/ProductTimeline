#!/bin/bash

echo "Testing Product Timeline API..."
echo ""

# Wait for server to start
echo "Waiting for server to start..."
sleep 5

# Test root endpoint
echo "1. Testing root endpoint (GET /)..."
curl -s http://localhost:3001/ | jq '.'
echo ""

# Test health endpoint
echo "2. Testing health endpoint (GET /api/v1/health)..."
curl -s http://localhost:3001/api/v1/health | jq '.'
echo ""

# Test liveness probe
echo "3. Testing liveness probe (GET /api/v1/health/live)..."
curl -s http://localhost:3001/api/v1/health/live | jq '.'
echo ""

# Test readiness probe
echo "4. Testing readiness probe (GET /api/v1/health/ready)..."
curl -s http://localhost:3001/api/v1/health/ready | jq '.'
echo ""

# Test Swagger docs
echo "5. Testing Swagger documentation (GET /api/docs)..."
curl -s -I http://localhost:3001/api/docs | head -n 1
echo ""

# Test rate limiting headers
echo "6. Testing rate limiting (checking headers)..."
curl -s -I http://localhost:3001/api/v1/health | grep -i "x-ratelimit"
echo ""

echo "API tests complete!"
