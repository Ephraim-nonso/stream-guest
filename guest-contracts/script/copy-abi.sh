#!/bin/bash

# Script to copy ABI and deployment info to frontend

CONTRACT_NAME="ExpertClientMoneyRouter"
FRONTEND_DIR="../../src/constants"
DEPLOYMENTS_DIR="./deployments"

echo "Copying contract ABI and deployment info to frontend..."

# Create constants directory if it doesn't exist
mkdir -p "$FRONTEND_DIR"

# Copy ABI
if [ -f "out/$CONTRACT_NAME.sol/$CONTRACT_NAME.json" ]; then
    jq '.abi' "out/$CONTRACT_NAME.sol/$CONTRACT_NAME.json" > "$FRONTEND_DIR/contract-abi.json"
    echo "✓ ABI copied to $FRONTEND_DIR/contract-abi.json"
else
    echo "✗ Error: Contract ABI not found. Run 'forge build' first."
    exit 1
fi

# Copy deployment info if it exists
if [ -f "$DEPLOYMENTS_DIR/base-sepolia.json" ]; then
    cp "$DEPLOYMENTS_DIR/base-sepolia.json" "$FRONTEND_DIR/contract-deployment.json"
    echo "✓ Deployment info copied to $FRONTEND_DIR/contract-deployment.json"
else
    echo "⚠ Warning: Deployment info not found. Deploy the contract first."
fi

echo "Done!"


