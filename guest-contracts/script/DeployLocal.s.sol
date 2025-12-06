// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {ExpertClientMoneyRouter} from "../src/ExpertClientMoneyRouter.sol";
import {
    ISuperfluid,
    ISuperToken
} from "../lib/protocol-monorepo/packages/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

/**
 * @title DeployLocalScript
 * @notice Deployment script for local testing (Anvil)
 * @dev Uses mock addresses for local development
 */
contract DeployLocalScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying ExpertClientMoneyRouter to local network...");
        console.log("Deployer address:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        // For local testing, use mock addresses
        // In production, these would be real Superfluid contract addresses
        address mockHost = address(0x1234567890123456789012345678901234567890);
        address mockToken = address(0x0987654321098765432109876543210987654321);

        ISuperfluid host = ISuperfluid(mockHost);
        ISuperToken acceptedToken = ISuperToken(mockToken);

        ExpertClientMoneyRouter router = new ExpertClientMoneyRouter(
            host,
            acceptedToken
        );

        vm.stopBroadcast();

        console.log("ExpertClientMoneyRouter deployed at:", address(router));
        console.log("\nNOTE: This is for local testing only!");
        console.log("Use Deploy.s.sol for Base Sepolia deployment.");
    }
}


