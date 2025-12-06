// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {ExpertClientMoneyRouter} from "../src/ExpertClientMoneyRouter.sol";
import {
    ISuperfluid,
    ISuperToken
} from "../lib/protocol-monorepo/packages/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

/**
 * @title DeployScript
 * @notice Deployment script for ExpertClientMoneyRouter contract
 * @dev Deploys to Base Sepolia testnet
 */
contract DeployScript is Script {
    // Base Sepolia Superfluid addresses
    // These are the official Superfluid contracts on Base Sepolia
    address constant BASE_SEPOLIA_HOST = 0x4c073B3bab6e8826c59D2Db5F913204a6474CAB7;
    
    // You'll need to deploy or get a SuperToken address
    // For testing, you can use the Superfluid dashboard to create a test SuperToken
    // Or deploy one using SuperTokenFactory
    address constant BASE_SEPOLIA_SUPER_TOKEN = 0x0000000000000000000000000000000000000000; // TODO: Replace with actual SuperToken address

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying ExpertClientMoneyRouter...");
        console.log("Deployer address:", deployer);
        console.log("Deployer balance:", deployer.balance);

        vm.startBroadcast(deployerPrivateKey);

        // Validate addresses
        require(BASE_SEPOLIA_HOST != address(0), "Invalid Superfluid Host address");
        require(BASE_SEPOLIA_SUPER_TOKEN != address(0), "Invalid SuperToken address - please set BASE_SEPOLIA_SUPER_TOKEN");

        ISuperfluid host = ISuperfluid(BASE_SEPOLIA_HOST);
        ISuperToken acceptedToken = ISuperToken(BASE_SEPOLIA_SUPER_TOKEN);

        // Deploy the contract
        ExpertClientMoneyRouter router = new ExpertClientMoneyRouter(
            host,
            acceptedToken
        );

        vm.stopBroadcast();

        console.log("ExpertClientMoneyRouter deployed at:", address(router));
        console.log("Host:", BASE_SEPOLIA_HOST);
        console.log("Accepted Token:", BASE_SEPOLIA_SUPER_TOKEN);

        // Write deployment info to file for frontend
        writeDeploymentInfo(address(router));
    }

    function writeDeploymentInfo(address router) internal {
        string memory json = string.concat(
            '{\n',
            '  "contractAddress": "', vm.toString(router), '",\n',
            '  "network": "base-sepolia",\n',
            '  "chainId": 84532,\n',
            '  "host": "', vm.toString(BASE_SEPOLIA_HOST), '",\n',
            '  "acceptedToken": "', vm.toString(BASE_SEPOLIA_SUPER_TOKEN), '",\n',
            '  "deployedAt": "', vm.toString(block.timestamp), '"\n',
            '}\n'
        );

        vm.writeFile(
            "./deployments/base-sepolia.json",
            json
        );

        console.log("\nDeployment info written to: ./deployments/base-sepolia.json");
    }
}

