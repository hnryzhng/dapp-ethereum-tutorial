const { assert } = require("chai")

const TodoList = artifacts.require('./TodoList.sol') // import file to be tested

// Run tests on command-line: $ truffle test

contract('TodoList', (accounts) => {
    before(async () => {
        // before running tests
        this.todoList = await TodoList.deployed()   // load and shallow copy a deployed copy of smart contract
    })

    it('deploys successfully', async () => {
        const address = await this.todoList.address // load and assert if address is valid to see if smart contract exists
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
        assert.notEqual(address, 0x0)   // not an empty address
        assert.notEqual(address, '')    // not an empty string
    })

    it('lists tasks', async () => {
        // lists tasks by asserting that task count is equal to key id of last task item 
        const taskCount = await this.todoList.taskCount()
        const task = await this.todoList.tasks(taskCount)   // gets last task item
        assert.equal(task.id.toNumber(), taskCount.toNumber())  // assert id of last task is equal to total task count, convert BigNumber to JavaScript Number 
        
        // assert first task item is dummy item
        const taskOne = await this.todoList.tasks(1)
        assert.equal(taskOne.id.toNumber(), 1)
        assert.equal(taskOne.content, 'This is the initial item')
        assert.equal(taskOne.completed, false)
    })

    it('creates tasks', async () => {
        // test whether event for TaskCreated has desired outputs

        const result = await this.todoList.createTask('new task')

        const taskCount = await this.todoList.taskCount()
        
        const event = result.logs[0].args
        console.log(result) // prints transaction event for TaskCreated in CLI

        // assert that the most recently added that the TaskCreated event has desired attribute values, as proxy for created task
        assert.equal(event.id.toNumber(), taskCount)    // latest task id should be equal to total task count
        assert.equal(event.content, 'new task')
        assert.equal(event.completed, false)

        // Alt method: get latest task item and assert that it has desired attributes 
        // const newestTask = await this.todoList.tasks(taskCount) 
        // assert.equal(newestTask.content, 'new task')    // assert that the most recently added task item has the desired content string

    })
    


})