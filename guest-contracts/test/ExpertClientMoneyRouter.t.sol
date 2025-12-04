// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {ExpertClientMoneyRouter} from "../src/ExpertClientMoneyRouter.sol";
import {
    ISuperfluid,
    ISuperToken,
    IConstantFlowAgreementV1
} from "../lib/protocol-monorepo/packages/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

/**
 * @title ExpertClientMoneyRouterTest
 * @notice Comprehensive unit and fuzz tests for ExpertClientMoneyRouter contract
 */
contract ExpertClientMoneyRouterTest is Test {
    ExpertClientMoneyRouter public router;
    
    // Mock contracts
    MockSuperfluid public mockHost;
    MockSuperToken public mockToken;
    MockCFA public mockCFA;
    
    // Test addresses
    address public owner;
    address public expert1;
    address public expert2;
    address public client1;
    address public client2;
    address public unauthorized;
    
    // Events
    event ExpertRegistered(address indexed expert);
    event ExpertUnregistered(address indexed expert);
    event ClientRegistered(address indexed client);
    event ClientUnregistered(address indexed client);
    event FlowCreated(address indexed client, address indexed expert, int96 flowRate);
    event FlowUpdated(address indexed client, address indexed expert, int96 oldFlowRate, int96 newFlowRate);
    event FlowDeleted(address indexed client, address indexed expert);

    function setUp() public {
        // Create test addresses
        owner = address(this);
        expert1 = address(0x1);
        expert2 = address(0x2);
        client1 = address(0x3);
        client2 = address(0x4);
        unauthorized = address(0x5);
        
        // Deploy mock contracts
        mockHost = new MockSuperfluid();
        mockToken = new MockSuperToken();
        mockCFA = new MockCFA();
        
        // Set up mock host to return mock CFA
        mockHost.setCFA(address(mockCFA));
        
        // Deploy router
        router = new ExpertClientMoneyRouter(ISuperfluid(address(mockHost)), ISuperToken(address(mockToken)));
    }

    // ============ Registration Tests ============

    function test_RegisterExpert() public {
        vm.expectEmit(true, false, false, true);
        emit ExpertRegistered(expert1);
        
        router.registerExpert(expert1);
        
        assertTrue(router.isExpert(expert1));
        assertFalse(router.isExpert(expert2));
    }

    function test_RegisterExpert_RevertIf_AlreadyRegistered() public {
        router.registerExpert(expert1);
        
        vm.expectRevert(ExpertClientMoneyRouter.ExpertAlreadyRegistered.selector);
        router.registerExpert(expert1);
    }

    function test_UnregisterExpert() public {
        router.registerExpert(expert1);
        
        vm.expectEmit(true, false, false, true);
        emit ExpertUnregistered(expert1);
        
        router.unregisterExpert(expert1);
        
        assertFalse(router.isExpert(expert1));
    }

    function test_UnregisterExpert_RevertIf_NotRegistered() public {
        vm.expectRevert(ExpertClientMoneyRouter.ExpertNotRegistered.selector);
        router.unregisterExpert(expert1);
    }

    function test_RegisterClient() public {
        vm.expectEmit(true, false, false, true);
        emit ClientRegistered(client1);
        
        router.registerClient(client1);
        
        assertTrue(router.isClient(client1));
        assertFalse(router.isClient(client2));
    }

    function test_RegisterClient_RevertIf_AlreadyRegistered() public {
        router.registerClient(client1);
        
        vm.expectRevert(ExpertClientMoneyRouter.ClientAlreadyRegistered.selector);
        router.registerClient(client1);
    }

    function test_UnregisterClient() public {
        router.registerClient(client1);
        
        vm.expectEmit(true, false, false, true);
        emit ClientUnregistered(client1);
        
        router.unregisterClient(client1);
        
        assertFalse(router.isClient(client1));
    }

    function test_UnregisterClient_RevertIf_NotRegistered() public {
        vm.expectRevert(ExpertClientMoneyRouter.ClientNotRegistered.selector);
        router.unregisterClient(client1);
    }

    // ============ Flow Creation Tests ============

    function test_CreateFlow() public {
        router.registerExpert(expert1);
        router.registerClient(client1);
        
        int96 flowRate = 1000;
        
        vm.prank(client1);
        vm.expectEmit(true, true, false, true);
        emit FlowCreated(client1, expert1, flowRate);
        
        router.createFlow(expert1, flowRate);
        
        assertEq(router.getFlowRate(client1, expert1), flowRate);
        assertEq(router.getExpertTotalFlowRate(expert1), flowRate);
        assertEq(router.getClientTotalFlowRate(client1), flowRate);
    }

    function test_CreateFlow_RevertIf_NotAClient() public {
        router.registerExpert(expert1);
        
        vm.prank(unauthorized);
        vm.expectRevert(ExpertClientMoneyRouter.NotAClient.selector);
        router.createFlow(expert1, 1000);
    }

    function test_CreateFlow_RevertIf_NotAnExpert() public {
        router.registerClient(client1);
        
        vm.prank(client1);
        vm.expectRevert(ExpertClientMoneyRouter.NotAnExpert.selector);
        router.createFlow(expert1, 1000);
    }

    function test_CreateFlow_RevertIf_InvalidFlowRate() public {
        router.registerExpert(expert1);
        router.registerClient(client1);
        
        vm.prank(client1);
        vm.expectRevert(ExpertClientMoneyRouter.InvalidFlowRate.selector);
        router.createFlow(expert1, 0);
        
        vm.prank(client1);
        vm.expectRevert(ExpertClientMoneyRouter.InvalidFlowRate.selector);
        router.createFlow(expert1, -100);
    }

    function test_CreateFlow_UpdatesExistingFlow() public {
        router.registerExpert(expert1);
        router.registerClient(client1);
        
        int96 initialFlowRate = 1000;
        int96 newFlowRate = 2000;
        
        vm.startPrank(client1);
        router.createFlow(expert1, initialFlowRate);
        
        vm.expectEmit(true, true, false, true);
        emit FlowUpdated(client1, expert1, initialFlowRate, newFlowRate);
        
        router.createFlow(expert1, newFlowRate);
        vm.stopPrank();
        
        assertEq(router.getFlowRate(client1, expert1), newFlowRate);
        assertEq(router.getExpertTotalFlowRate(expert1), newFlowRate);
        assertEq(router.getClientTotalFlowRate(client1), newFlowRate);
    }

    function test_CreateFlow_MultipleClientsToSameExpert() public {
        router.registerExpert(expert1);
        router.registerClient(client1);
        router.registerClient(client2);
        
        int96 flowRate1 = 1000;
        int96 flowRate2 = 2000;
        
        vm.prank(client1);
        router.createFlow(expert1, flowRate1);
        
        vm.prank(client2);
        router.createFlow(expert1, flowRate2);
        
        assertEq(router.getFlowRate(client1, expert1), flowRate1);
        assertEq(router.getFlowRate(client2, expert1), flowRate2);
        assertEq(router.getExpertTotalFlowRate(expert1), flowRate1 + flowRate2);
        assertEq(router.getClientTotalFlowRate(client1), flowRate1);
        assertEq(router.getClientTotalFlowRate(client2), flowRate2);
    }

    // ============ Flow Update Tests ============

    function test_UpdateFlow() public {
        router.registerExpert(expert1);
        router.registerClient(client1);
        
        int96 initialFlowRate = 1000;
        int96 newFlowRate = 2000;
        
        vm.startPrank(client1);
        router.createFlow(expert1, initialFlowRate);
        
        vm.expectEmit(true, true, false, true);
        emit FlowUpdated(client1, expert1, initialFlowRate, newFlowRate);
        
        router.updateFlow(expert1, newFlowRate);
        vm.stopPrank();
        
        assertEq(router.getFlowRate(client1, expert1), newFlowRate);
        assertEq(router.getExpertTotalFlowRate(expert1), newFlowRate);
        assertEq(router.getClientTotalFlowRate(client1), newFlowRate);
    }

    function test_UpdateFlow_RevertIf_NoActiveFlow() public {
        router.registerExpert(expert1);
        router.registerClient(client1);
        
        vm.prank(client1);
        vm.expectRevert(ExpertClientMoneyRouter.NoActiveFlow.selector);
        router.updateFlow(expert1, 1000);
    }

    function test_UpdateFlow_RevertIf_InvalidFlowRate() public {
        router.registerExpert(expert1);
        router.registerClient(client1);
        
        vm.startPrank(client1);
        router.createFlow(expert1, 1000);
        
        vm.expectRevert(ExpertClientMoneyRouter.InvalidFlowRate.selector);
        router.updateFlow(expert1, 0);
        
        vm.expectRevert(ExpertClientMoneyRouter.InvalidFlowRate.selector);
        router.updateFlow(expert1, -100);
        vm.stopPrank();
    }

    // ============ Flow Deletion Tests ============

    function test_DeleteFlow() public {
        router.registerExpert(expert1);
        router.registerClient(client1);
        
        int96 flowRate = 1000;
        
        vm.startPrank(client1);
        router.createFlow(expert1, flowRate);
        
        vm.expectEmit(true, true, false, true);
        emit FlowDeleted(client1, expert1);
        
        router.deleteFlow(expert1);
        vm.stopPrank();
        
        assertEq(router.getFlowRate(client1, expert1), 0);
        assertEq(router.getExpertTotalFlowRate(expert1), 0);
        assertEq(router.getClientTotalFlowRate(client1), 0);
    }

    function test_DeleteFlow_RevertIf_NoActiveFlow() public {
        router.registerExpert(expert1);
        router.registerClient(client1);
        
        vm.prank(client1);
        vm.expectRevert(ExpertClientMoneyRouter.NoActiveFlow.selector);
        router.deleteFlow(expert1);
    }

    // ============ View Function Tests ============

    function test_GetFlowRate() public {
        router.registerExpert(expert1);
        router.registerClient(client1);
        
        int96 flowRate = 1000;
        
        assertEq(router.getFlowRate(client1, expert1), 0);
        
        vm.prank(client1);
        router.createFlow(expert1, flowRate);
        
        assertEq(router.getFlowRate(client1, expert1), flowRate);
    }

    function test_GetExpertTotalFlowRate() public {
        router.registerExpert(expert1);
        router.registerClient(client1);
        router.registerClient(client2);
        
        int96 flowRate1 = 1000;
        int96 flowRate2 = 2000;
        
        vm.prank(client1);
        router.createFlow(expert1, flowRate1);
        
        assertEq(router.getExpertTotalFlowRate(expert1), flowRate1);
        
        vm.prank(client2);
        router.createFlow(expert1, flowRate2);
        
        assertEq(router.getExpertTotalFlowRate(expert1), flowRate1 + flowRate2);
    }

    function test_GetClientTotalFlowRate() public {
        router.registerExpert(expert1);
        router.registerExpert(expert2);
        router.registerClient(client1);
        
        int96 flowRate1 = 1000;
        int96 flowRate2 = 2000;
        
        vm.startPrank(client1);
        router.createFlow(expert1, flowRate1);
        
        assertEq(router.getClientTotalFlowRate(client1), flowRate1);
        
        router.createFlow(expert2, flowRate2);
        vm.stopPrank();
        
        assertEq(router.getClientTotalFlowRate(client1), flowRate1 + flowRate2);
    }

    // ============ Fuzz Tests ============

    function testFuzz_RegisterExpert(address expert) public {
        vm.assume(expert != address(0));
        vm.assume(!router.isExpert(expert));
        
        router.registerExpert(expert);
        assertTrue(router.isExpert(expert));
    }

    function testFuzz_RegisterClient(address client) public {
        vm.assume(client != address(0));
        vm.assume(!router.isClient(client));
        
        router.registerClient(client);
        assertTrue(router.isClient(client));
    }

    function testFuzz_CreateFlow(int96 flowRate) public {
        vm.assume(flowRate > 0);
        vm.assume(flowRate < type(int96).max / 2); // Prevent overflow
        
        router.registerExpert(expert1);
        router.registerClient(client1);
        
        vm.prank(client1);
        router.createFlow(expert1, flowRate);
        
        assertEq(router.getFlowRate(client1, expert1), flowRate);
        assertEq(router.getExpertTotalFlowRate(expert1), flowRate);
        assertEq(router.getClientTotalFlowRate(client1), flowRate);
    }

    function testFuzz_UpdateFlow(int96 initialFlowRate, int96 newFlowRate) public {
        vm.assume(initialFlowRate > 0);
        vm.assume(newFlowRate > 0);
        vm.assume(initialFlowRate < type(int96).max / 2);
        vm.assume(newFlowRate < type(int96).max / 2);
        
        router.registerExpert(expert1);
        router.registerClient(client1);
        
        vm.startPrank(client1);
        router.createFlow(expert1, initialFlowRate);
        router.updateFlow(expert1, newFlowRate);
        vm.stopPrank();
        
        assertEq(router.getFlowRate(client1, expert1), newFlowRate);
        assertEq(router.getExpertTotalFlowRate(expert1), newFlowRate);
        assertEq(router.getClientTotalFlowRate(client1), newFlowRate);
    }

    function testFuzz_MultipleFlows(
        address client,
        address expert,
        int96 flowRate
    ) public {
        vm.assume(client != address(0));
        vm.assume(expert != address(0));
        vm.assume(client != expert);
        vm.assume(flowRate > 0);
        vm.assume(flowRate < type(int96).max / 10);
        
        router.registerExpert(expert);
        router.registerClient(client);
        
        vm.prank(client);
        router.createFlow(expert, flowRate);
        
        assertEq(router.getFlowRate(client, expert), flowRate);
        assertEq(router.getExpertTotalFlowRate(expert), flowRate);
        assertEq(router.getClientTotalFlowRate(client), flowRate);
    }

    function testFuzz_FlowRateCalculations(
        int96 flowRate1,
        int96 flowRate2
    ) public {
        vm.assume(flowRate1 > 0);
        vm.assume(flowRate2 > 0);
        vm.assume(flowRate1 < type(int96).max / 2);
        vm.assume(flowRate2 < type(int96).max / 2);
        
        router.registerExpert(expert1);
        router.registerClient(client1);
        router.registerClient(client2);
        
        vm.prank(client1);
        router.createFlow(expert1, flowRate1);
        
        vm.prank(client2);
        router.createFlow(expert1, flowRate2);
        
        assertEq(router.getExpertTotalFlowRate(expert1), flowRate1 + flowRate2);
        assertEq(router.getClientTotalFlowRate(client1), flowRate1);
        assertEq(router.getClientTotalFlowRate(client2), flowRate2);
    }

    // ============ Edge Cases ============

    function test_FlowRate_ZeroAfterDeletion() public {
        router.registerExpert(expert1);
        router.registerClient(client1);
        
        int96 flowRate = 1000;
        
        vm.startPrank(client1);
        router.createFlow(expert1, flowRate);
        router.deleteFlow(expert1);
        vm.stopPrank();
        
        assertEq(router.getFlowRate(client1, expert1), 0);
        assertEq(router.getExpertTotalFlowRate(expert1), 0);
        assertEq(router.getClientTotalFlowRate(client1), 0);
    }

    function test_MultipleExpertsMultipleClients() public {
        router.registerExpert(expert1);
        router.registerExpert(expert2);
        router.registerClient(client1);
        router.registerClient(client2);
        
        int96 rate1 = 1000;
        int96 rate2 = 2000;
        int96 rate3 = 3000;
        int96 rate4 = 4000;
        
        vm.startPrank(client1);
        router.createFlow(expert1, rate1);
        router.createFlow(expert2, rate2);
        vm.stopPrank();
        
        vm.startPrank(client2);
        router.createFlow(expert1, rate3);
        router.createFlow(expert2, rate4);
        vm.stopPrank();
        
        assertEq(router.getExpertTotalFlowRate(expert1), rate1 + rate3);
        assertEq(router.getExpertTotalFlowRate(expert2), rate2 + rate4);
        assertEq(router.getClientTotalFlowRate(client1), rate1 + rate2);
        assertEq(router.getClientTotalFlowRate(client2), rate3 + rate4);
    }

    function test_ReRegisterAfterUnregister() public {
        router.registerExpert(expert1);
        router.unregisterExpert(expert1);
        
        router.registerExpert(expert1);
        assertTrue(router.isExpert(expert1));
    }
}

// ============ Mock Contracts ============

/**
 * @notice Simplified mock for ISuperfluid - only implements functions used by the contract
 */
contract MockSuperfluid {
    address public cfa;
    
    function setCFA(address _cfa) external {
        cfa = _cfa;
    }
    
    function getAgreementClass(bytes32 agreementType) external view returns (address) {
        if (agreementType == keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1")) {
            return cfa;
        }
        return address(0);
    }
    
    function callAgreement(
        address /* agreementClass */,
        bytes calldata /* callData */,
        bytes calldata /* userData */
    ) external pure returns (bytes memory) {
        // Mock implementation - just return empty bytes
        return "";
    }
}

/**
 * @notice Simplified mock for ISuperToken - empty implementation
 */
contract MockSuperToken {
    // Empty implementation - not used directly in tests
}

/**
 * @notice Simplified mock for IConstantFlowAgreementV1 - empty implementation
 * @dev Functions are called through host.callAgreement which we mock
 */
contract MockCFA {
    // Empty implementation - not used directly in tests
}

