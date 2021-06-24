// Define JS for App and its methods inside JS object
App = {
    loading: false,
    contracts: {},

    load: async () => {
        // Loads app

        // await App.loadWeb3()   // DEPRECATED: uses Web3.JS to have front-end connect to blockchain
        await App.loadAccount()
        await App.loadContract()
        await App.render()  // calls render method to hydrate HTML elements with data
    },

    loadWeb3: async () => {
        // DEPRECATED: no need for this method to load Web3 provider since window.ethereum is already loaded by default

        // if (typeof web3 !== 'undefined') {
        //     App.web3Provider = web3.currentProvider
        //     web3 = new Web3(web3.currentProvider)
        // } else {
        //     window.alert("Please connect to Metamask.")
        // }
        // // Modern dapp browsers...
        // if (window.ethereum) {
        //     window.web3 = new Web3(ethereum)
        //     try {
        //     // Request account access if needed
        //     await ethereum.enable()
        //     // Acccounts now exposed
        //     web3.eth.sendTransaction({/* ... */})
        //     } catch (error) {
        //     // User denied account access...
        //     }
        // }
        // // Legacy dapp browsers...
        // else if (window.web3) {
        //     App.web3Provider = web3.currentProvider
        //     window.web3 = new Web3(web3.currentProvider)
        //     // Acccounts always exposed
        //     web3.eth.sendTransaction({/* ... */})
        // }
        // // Non-dapp browsers...
        // else {
        //     console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        // }
    },

    loadAccount: async () => {
        App.account = await ethereum.request({ method: 'eth_accounts' })    // updated: loads MetaMask account from Web3's connection obj
        console.log("MetaMask account:", App.account);

        // ethereum
        // .request({
        //   method: 'eth_sendTransaction',
        //   params: [
        //     {
        //       from: App.account[0],
        //       to: App.account[0]
        //     },
        //   ],
        // })
        // .then((txHash) => console.log(txHash))
        // .catch((error) => console.error);
    },

    loadContract: async () => {
        // Create JavaScript representation of smart contract for front-end manipulation
        const todoList = await $.getJSON('TodoList.json');  // loads smart contract TodoList from JSON in build dir 

        App.contracts.TodoList = TruffleContract(todoList); // stores the contracts from particular user account as Truffle object for further processing and interaction in contracts attribute
        App.contracts.TodoList.setProvider(window.ethereum); // updated: sets Ethereum Web3 as provider so we can access smart contract and its methods on blockchain
        App.todoList = await App.contracts.TodoList.deployed(); // get deployed live copy of contract with data
    },

    setLoading: (boolean) => {
        // shows loading icon and hides content if state is true
        // else, opposite

        App.loading = boolean

        const loader = $('#loader');
        const content = $('#content');

        if (boolean) {
            loader.show()
            content.hide()
        } else {
            loader.hide()
            content.show()
        }

    },

    createTask: async() => {
        // on submit of form with text input for search bar calls this method
        App.setLoading(true)

        const content = $('#newTask').val() // gets content from text input

        await App.todoList.createTask(content, { from: App.account[0] })  // calls createTask for deployed smart contract, { from } param is particular to how MetaMask operates, found answer on SO

        window.location.reload()    // refreshes page to load updated tasks list
    },

    renderTasks: async() => {
        // Load total task count from smart contract deployed on blockchain
        const taskCount = await App.todoList.taskCount()    // get the taskCount data from deployed smart contract TodoList
        const $taskTemplate = $('.taskTemplate')    // get task template from index.html

        // Fetch task data from deployed smart contract
        for (var i=1; i<taskCount; i++) {
            const task = await App.todoList.tasks(i)    // get particular task data from deployed smart contract TodoList
            const taskId = task[0].toNumber()   // get's task attribute id + convert Big number to number  (first attribute is at index 0)
            const taskContent = task[1] // get task string content (second attribute is at index 1)
            const taskCompleted = task[2]   // get task completed boolean (third attribute at index 2)
            console.log("TASK:", taskId, taskContent, taskCompleted)
        

            // Create HTML elements for task and hydrate with fetched data
            const $newTaskTemplate = $taskTemplate.clone()  // clone the HTML element
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate.find('input')  // selects the input element within .taskTemplate
                            .prop('name', taskId)   // assigns task id to prop name of input element
                            .prop('checked', taskCompleted) // assigns taskCompleted boolean to checked prop of input element
                            .on('click', App.toggledCompleted)  // handler for click event trigged toggledCompleted method

                    
            // Extra: Put task in correct list (either regular taskList or completedTaskList grouping)
            if (taskCompleted) {
                $('#completedTaskList').append($newTaskTemplate)
            } else {
                $('#taskList').append($newTaskTemplate)
            }

            // Show the task in index.html after its creation
            $newTaskTemplate.show()
            
        }

    },
        
    render: async () => {

        // Prevent double render by not rendering when app state is in loading
        if (App.loading) {
            return
        }

        // If app is not already loading, then proceed to render account
        App.setLoading(true);

        // Render Account
        $('#account').html(App.account);

        // Render Tasks
        await App.renderTasks();

        App.setLoading(false);  // set loading state to false after finished rendering account
    }
}

// Call function to load app
$(() => {
    $(window).load(() => {
        App.load()
    })
})
