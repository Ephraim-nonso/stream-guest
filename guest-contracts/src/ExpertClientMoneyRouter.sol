// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {
    ISuperfluid,
    ISuperToken,
    IConstantFlowAgreementV1
} from "../lib/protocol-monorepo/packages/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

/**
 * @title ExpertClientMoneyRouter
 * @author KonsultPay
 * @notice A contract that tracks experts and clients and enables seamless token streaming
 *         from clients to experts using Superfluid's Money Router pattern.
 * @dev This contract uses the CFA's operator functions (createFlowByOperator, etc.) to allow
 *      clients to stream tokens to experts. Clients must authorize this contract as an operator
 *      before creating flows. Use the CFA's `authorizeFlowOperatorWithFullControl` function
 *      to authorize this contract.
 */
contract ExpertClientMoneyRouter {

    /// @notice The Superfluid host contract
    ISuperfluid public immutable HOST;
    
    /// @notice The accepted SuperToken for streaming
    ISuperToken public immutable ACCEPTED_TOKEN;

    /// @notice Mapping to track registered experts
    mapping(address => bool) public experts;
    
    /// @notice Mapping to track registered clients
    mapping(address => bool) public clients;
    
    /// @notice Mapping to track active flows from client to expert
    /// @dev client => expert => flowRate
    mapping(address => mapping(address => int96)) public activeFlows;
    
    /// @notice Mapping to track total flow rate per expert (sum of all incoming flows)
    mapping(address => int96) public expertTotalFlowRate;
    
    /// @notice Mapping to track total flow rate per client (sum of all outgoing flows)
    mapping(address => int96) public clientTotalFlowRate;

    /// @notice Event emitted when an expert is registered
    event ExpertRegistered(address indexed expert);
    
    /// @notice Event emitted when an expert is unregistered
    event ExpertUnregistered(address indexed expert);
    
    /// @notice Event emitted when a client is registered
    event ClientRegistered(address indexed client);
    
    /// @notice Event emitted when a client is unregistered
    event ClientUnregistered(address indexed client);
    
    /// @notice Event emitted when a flow is created
    event FlowCreated(
        address indexed client,
        address indexed expert,
        int96 flowRate
    );
    
    /// @notice Event emitted when a flow is updated
    event FlowUpdated(
        address indexed client,
        address indexed expert,
        int96 oldFlowRate,
        int96 newFlowRate
    );
    
    /// @notice Event emitted when a flow is deleted
    event FlowDeleted(
        address indexed client,
        address indexed expert
    );

    /// @notice Error thrown when caller is not a registered client
    error NotAClient();
    
    /// @notice Error thrown when recipient is not a registered expert
    error NotAnExpert();
    
    /// @notice Error thrown when expert is already registered
    error ExpertAlreadyRegistered();
    
    /// @notice Error thrown when client is already registered
    error ClientAlreadyRegistered();
    
    /// @notice Error thrown when expert is not registered
    error ExpertNotRegistered();
    
    /// @notice Error thrown when client is not registered
    error ClientNotRegistered();
    
    /// @notice Error thrown when flow rate is invalid (must be positive)
    error InvalidFlowRate();
    
    /// @notice Error thrown when no active flow exists
    error NoActiveFlow();

    /**
     * @notice Constructor to initialize the contract
     * @param _host The Superfluid host contract address
     * @param _acceptedToken The SuperToken address to be used for streaming
     */
    constructor(ISuperfluid _host, ISuperToken _acceptedToken) {
        HOST = _host;
        ACCEPTED_TOKEN = _acceptedToken;
    }

    /**
     * @notice Register an expert
     * @param expert The address of the expert to register
     */
    function registerExpert(address expert) external {
        if (experts[expert]) {
            revert ExpertAlreadyRegistered();
        }
        experts[expert] = true;
        emit ExpertRegistered(expert);
    }

    /**
     * @notice Unregister an expert
     * @param expert The address of the expert to unregister
     */
    function unregisterExpert(address expert) external {
        if (!experts[expert]) {
            revert ExpertNotRegistered();
        }
        experts[expert] = false;
        emit ExpertUnregistered(expert);
    }

    /**
     * @notice Register a client
     * @param client The address of the client to register
     */
    function registerClient(address client) external {
        if (clients[client]) {
            revert ClientAlreadyRegistered();
        }
        clients[client] = true;
        emit ClientRegistered(client);
    }

    /**
     * @notice Unregister a client
     * @param client The address of the client to unregister
     */
    function unregisterClient(address client) external {
        if (!clients[client]) {
            revert ClientNotRegistered();
        }
        clients[client] = false;
        emit ClientUnregistered(client);
    }

    /**
     * @notice Create or update a flow from the caller (client) to an expert
     * @dev This function uses CFA's createFlowByOperator/updateFlowByOperator to create flows
     *      where the client is the sender. The client must authorize this contract as an operator
     *      using CFA's authorizeFlowOperatorWithFullControl function first.
     * @param expert The address of the expert to stream tokens to
     * @param flowRate The flow rate in wei per second (must be positive)
     */
    function createFlow(address expert, int96 flowRate) external {
        if (!clients[msg.sender]) {
            revert NotAClient();
        }
        if (!experts[expert]) {
            revert NotAnExpert();
        }
        if (flowRate <= 0) {
            revert InvalidFlowRate();
        }

        int96 oldFlowRate = activeFlows[msg.sender][expert];
        
        // Get CFA from host
        IConstantFlowAgreementV1 cfa = IConstantFlowAgreementV1(
            address(HOST.getAgreementClass(keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1")))
        );
        
        // Use CFA's operator functions to create/update flow with client as sender
        if (oldFlowRate == 0) {
            // Create new flow
            HOST.callAgreement(
                cfa,
                abi.encodeCall(
                    cfa.createFlowByOperator,
                    (ACCEPTED_TOKEN, msg.sender, expert, flowRate, new bytes(0))
                ),
                new bytes(0)
            );
            expertTotalFlowRate[expert] += flowRate;
            clientTotalFlowRate[msg.sender] += flowRate;
            emit FlowCreated(msg.sender, expert, flowRate);
        } else {
            // Update existing flow
            HOST.callAgreement(
                cfa,
                abi.encodeCall(
                    cfa.updateFlowByOperator,
                    (ACCEPTED_TOKEN, msg.sender, expert, flowRate, new bytes(0))
                ),
                new bytes(0)
            );
            expertTotalFlowRate[expert] = expertTotalFlowRate[expert] - oldFlowRate + flowRate;
            clientTotalFlowRate[msg.sender] = clientTotalFlowRate[msg.sender] - oldFlowRate + flowRate;
            emit FlowUpdated(msg.sender, expert, oldFlowRate, flowRate);
        }
        
        // Update tracking mappings
        activeFlows[msg.sender][expert] = flowRate;
    }

    /**
     * @notice Update an existing flow from the caller (client) to an expert
     * @param expert The address of the expert receiving the stream
     * @param newFlowRate The new flow rate in wei per second (must be positive)
     */
    function updateFlow(address expert, int96 newFlowRate) external {
        if (!clients[msg.sender]) {
            revert NotAClient();
        }
        if (!experts[expert]) {
            revert NotAnExpert();
        }
        if (newFlowRate <= 0) {
            revert InvalidFlowRate();
        }
        
        int96 oldFlowRate = activeFlows[msg.sender][expert];
        if (oldFlowRate == 0) {
            revert NoActiveFlow();
        }

        // Get CFA from host
        IConstantFlowAgreementV1 cfa = IConstantFlowAgreementV1(
            address(HOST.getAgreementClass(keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1")))
        );
        
        // Use CFA's updateFlowByOperator to update flow with client as sender
        HOST.callAgreement(
            cfa,
            abi.encodeCall(
                cfa.updateFlowByOperator,
                (ACCEPTED_TOKEN, msg.sender, expert, newFlowRate, new bytes(0))
            ),
            new bytes(0)
        );
        
        // Update tracking mappings
        activeFlows[msg.sender][expert] = newFlowRate;
        expertTotalFlowRate[expert] = expertTotalFlowRate[expert] - oldFlowRate + newFlowRate;
        clientTotalFlowRate[msg.sender] = clientTotalFlowRate[msg.sender] - oldFlowRate + newFlowRate;
        
        emit FlowUpdated(msg.sender, expert, oldFlowRate, newFlowRate);
    }

    /**
     * @notice Delete a flow from the caller (client) to an expert
     * @param expert The address of the expert to stop streaming to
     */
    function deleteFlow(address expert) external {
        if (!clients[msg.sender]) {
            revert NotAClient();
        }
        if (!experts[expert]) {
            revert NotAnExpert();
        }
        
        int96 oldFlowRate = activeFlows[msg.sender][expert];
        if (oldFlowRate == 0) {
            revert NoActiveFlow();
        }

        // Get CFA from host
        IConstantFlowAgreementV1 cfa = IConstantFlowAgreementV1(
            address(HOST.getAgreementClass(keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1")))
        );
        
        // Use CFA's deleteFlowByOperator to delete flow with client as sender
        HOST.callAgreement(
            cfa,
            abi.encodeCall(
                cfa.deleteFlowByOperator,
                (ACCEPTED_TOKEN, msg.sender, expert, new bytes(0))
            ),
            new bytes(0)
        );
        
        // Update tracking mappings
        activeFlows[msg.sender][expert] = 0;
        expertTotalFlowRate[expert] -= oldFlowRate;
        clientTotalFlowRate[msg.sender] -= oldFlowRate;
        
        emit FlowDeleted(msg.sender, expert);
    }

    /**
     * @notice Get the current flow rate from a client to an expert
     * @param client The address of the client
     * @param expert The address of the expert
     * @return flowRate The current flow rate (0 if no flow exists)
     */
    function getFlowRate(address client, address expert) external view returns (int96 flowRate) {
        return activeFlows[client][expert];
    }

    /**
     * @notice Get the total flow rate for an expert (sum of all incoming flows)
     * @param expert The address of the expert
     * @return totalFlowRate The total flow rate the expert is receiving
     */
    function getExpertTotalFlowRate(address expert) external view returns (int96 totalFlowRate) {
        return expertTotalFlowRate[expert];
    }

    /**
     * @notice Get the total flow rate for a client (sum of all outgoing flows)
     * @param client The address of the client
     * @return totalFlowRate The total flow rate the client is sending
     */
    function getClientTotalFlowRate(address client) external view returns (int96 totalFlowRate) {
        return clientTotalFlowRate[client];
    }

    /**
     * @notice Check if an address is a registered expert
     * @param account The address to check
     * @return True if the address is a registered expert
     */
    function isExpert(address account) external view returns (bool) {
        return experts[account];
    }

    /**
     * @notice Check if an address is a registered client
     * @param account The address to check
     * @return True if the address is a registered client
     */
    function isClient(address account) external view returns (bool) {
        return clients[account];
    }
}

