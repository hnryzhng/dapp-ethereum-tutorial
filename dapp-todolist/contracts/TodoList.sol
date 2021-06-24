pragma solidity ^0.5.0;

contract TodoList {
    uint public taskCount = 0;  // state keeps track of total number of tasks

    struct Task {
        uint id;
        string content;
        bool completed;
    }
    
    mapping(uint => Task) public tasks;

    // creates event listener to broadcast to subscribed nodes in network to notify and log when task was created
    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    constructor() public {
        // constructor only runs once upon deployment to blockchain
        
        createTask("This is the initial item"); // set a single list item for testing
    }

    function createTask(string memory _content) public {
        // create new task and add to tasks mapping
        taskCount ++;   // increase task count by 1 
        tasks[taskCount] = Task(taskCount, _content, false); // assigns index as key and Task struct as value with input params

        emit TaskCreated(taskCount, _content, false);    // emits event to subscribed nodes in network
    }
}