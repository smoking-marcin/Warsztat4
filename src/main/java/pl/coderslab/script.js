const apikey = '9df58fa5-1aa3-4772-ab4a-ba55d29491e5';
const apihost = 'https://todo-api.coderslab.pl';

//----------------------------------------------------------
/* GET DATA */
function getTaskList() {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: { Authorization: apikey }
        }
    ).then(
        function(resp) {
            if(!resp.ok) {
                alert('Error in apiGetTasks()');
            }
            return resp.json();
        }
    )
}

function getTaskOperations(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
        { headers: { 'Authorization': apikey } }
    ).then(
        function (resp) { return resp.json(); }
    );
}

//----------------------------------------------------------
/* UPDATE DATA */
function addTask(title, description) {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, description: description, status: 'open' }),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if(!resp.ok) {
                alert('Error in addTask');
            }
            return resp.json();
        }
    );
}

function updateTask(taskId, title, description, status) {
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, description: description, status: status }),
            method: 'PUT'
        }
    ).then(
        function (resp) {
            if(!resp.ok) {
                alert('Error in updateTask');
            }
            return resp.json();
        }
    );
}

function deleteTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            headers: { Authorization: apikey },
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if(!resp.ok) {
                alert('Error in deleteTask');
            }
            return resp.json();
        }
    )
}

function updateOperation(id, description, timeSpent) {
    return fetch(
        apihost + '/api/operations/' + id,
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: description, timeSpent: timeSpent }),
            method: 'PUT'
        }
    ).then(
        function (resp) {
            if(!resp.ok) {
                alert('Error in updateOperation');
            }
            return resp.json();
        }
    );
}

function deleteOperation(id) {
    return fetch(
        apihost + '/api/operations/' + id,
        {
            headers: { Authorization: apikey },
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if(!resp.ok) {
                alert('Error in deleteOperation');
            }
            return resp.json();
        }
    )
}

function addOperation(id, description) {
    return fetch(
        apihost + '/api/tasks/' + id + '/operations',
        {
            headers: { Authorization: apikey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: description, timeSpent: 0 }),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if(!resp.ok) {
                alert('Error in apiCreateOperationForTask');
            }
            return resp.json();
        }
    );
}

//----------------------------------------------------------
/* PRINT DATA */
function printTask(taskId, title, description, status) {
    const task_container = document.createElement('div');
    task_container.setAttribute("id", "taskId"+taskId);
    document.querySelector('#task_list').appendChild(task_container);

    const task_title_container = document.createElement('div');
    task_container.appendChild(task_title_container);
    const task_title = document.createElement('h3');
    task_title_container.appendChild(task_title);
    task_title.innerText = "Title: "+title;
    const task_description = document.createElement('h4');
    task_title_container.appendChild(task_description);
    task_description.innerText = "Description: "+description;

    if(status == 'open') {
        const finishTask = document.createElement('button');
        task_title_container.appendChild(finishTask);
        finishTask.innerText = 'Finish';
        finishTask.addEventListener('click', function() {
            updateTask(taskId, title, description, 'closed');
            task_container.querySelectorAll('button').forEach(
                function(element) {
                    if (element.innerText != 'Delete Task') {
                        element.parentElement.removeChild(element);
                    }
                }
            );
            task_container.querySelectorAll('form').forEach(
                function(element) {
                    element.parentElement.removeChild(element);
                }
            );
        });
    }

    const removeTask = document.createElement('button');
    task_title_container.appendChild(removeTask);
    removeTask.innerText = 'Delete Task';
    removeTask.addEventListener('click', function() {
        deleteTask(taskId).then(function() { task_container.parentElement.removeChild(task_container); });
    });

    const task_operations_container = document.createElement('div');
    task_container.appendChild(task_operations_container);
    const operations_list = document.createElement('ul');
    task_operations_container.appendChild(operations_list);

    getTaskOperations(taskId).then(
        function(response) {
            response.data.forEach(
                function(operation) {
                    printOperation(operations_list, status, operation.id, operation.description, operation.timeSpent);
                }
            )
        })

    if(status == 'open') {
        const task_addOperation_container = document.createElement('div');
        task_container.appendChild(task_addOperation_container);

        const addOperationForm = document.createElement('form');
        task_addOperation_container.appendChild(addOperationForm);

        const addOperationFormDescription = document.createElement('input');
        addOperationFormDescription.setAttribute('type', 'text');
        addOperationFormDescription.setAttribute('name', 'operationDescription');
        addOperationFormDescription.setAttribute('placeholder', 'Operation description');
        addOperationFormDescription.setAttribute('minlength', '5');
        addOperationForm.appendChild(addOperationFormDescription);

        const addOperationFormDescriptionButton = document.createElement('button');
        addOperationFormDescriptionButton.innerText = 'Add';
        addOperationForm.appendChild(addOperationFormDescriptionButton);

        addOperationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            addOperation(taskId, addOperationFormDescription.value).then(
                function(response) {
                    printOperation(operations_list, status, response.data.id, response.data.description, response.data.timeSpent);
                }
            );
            event.target.operationDescription.value = "";
        });
    }
}

function printOperation(operations_list, status, id, description, timeSpent) {
    const operation = document.createElement('li');
    operations_list.appendChild(operation);

    const operationDescription = document.createElement('div');
    operation.appendChild(operationDescription);
    operationDescription.innerText = description;
    const operationTimeSpent= document.createElement('div');
    operation.appendChild(operationTimeSpent);
    operationTimeSpent.innerText = timeSpent;;
    const operationActions = document.createElement('div');
    operation.appendChild(operationActions);

    if(status == "open") {
        const add15 = document.createElement('button');
        operationActions.appendChild(add15);
        add15.innerText = '+15m';
        add15.addEventListener('click', function() {
            updateOperation(id, description, timeSpent + 15).then(
                function(response) {
                    operationTimeSpent.innerText = response.data.timeSpent;
                    timeSpent = response.data.timeSpent;
                }
            );
        });

        const add60 = document.createElement('button');
        operationActions.appendChild(add60);
        add60.innerText = '+1h';
        add60.addEventListener('click', function() {
            updateOperation(id, description, timeSpent + 60).then(
                function(response) {
                    operationTimeSpent.innerText = response.data.timeSpent;
                    timeSpent = response.data.timeSpent;
                }
            );
        });

        const deleteThisOperation = document.createElement('button');
        operationActions.appendChild(deleteThisOperation);
        deleteThisOperation.innerText = 'Delete';

        deleteThisOperation.addEventListener('click', function() {
            deleteOperation(id).then(
                function() { operation.parentElement.removeChild(operation); }
            );
        });
    }
}

//----------------------------------------------------------
/* RUN DATA */
document.addEventListener('DOMContentLoaded', function() {
    getTaskList().then(
        function(response) {
            response.data.forEach(
                function(task) {
                    printTask(task.id, task.title, task.description, task.status);
                }
            )
        }
    );
    document.querySelector('#new_task').querySelector("form").addEventListener('submit', function(event) {
        event.preventDefault();
        //console.log(event.target.description.value);
        addTask(event.target.title.value, event.target.description.value).then(
            function(response) {
                printTask(response.data.id, response.data.title, response.data.description, response.data.status)
                event.target.title.value = "";
                event.target.description.value = "";
            }
        )
    });
})