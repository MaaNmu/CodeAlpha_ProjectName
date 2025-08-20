
        document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const taskInput = document.getElementById('task-input');
            const addBtn = document.getElementById('add-btn');
            const tasksList = document.getElementById('tasks-list');
            
            // Load tasks from localStorage
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
            // Initialize the app
            function init() {
                renderTasks();
                addBtn.addEventListener('click', addTask);
                taskInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') addTask();
                });
            }
            
            // Add a new task
            function addTask() {
                const taskText = taskInput.value.trim();
                if (taskText === '') return;
                
                const newTask = {
                    id: Date.now(),
                    text: taskText,
                    completed: false
                };
                
                tasks.push(newTask);
                saveTasks();
                renderTasks();
                
                // Clear input
                taskInput.value = '';
                taskInput.focus();
            }
            
            // Render all tasks
            function renderTasks() {
                // Clear the list
                tasksList.innerHTML = '';
                
                if (tasks.length === 0) {
                    tasksList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-clipboard-list"></i>
                            <p>No tasks yet. Add a task to get started!</p>
                        </div>
                    `;
                    return;
                }
                
                // Add each task to the list
                tasks.forEach(task => {
                    const taskItem = document.createElement('li');
                    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                    taskItem.dataset.id = task.id;
                    
                    taskItem.innerHTML = `
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                        <span class="task-text">${task.text}</span>
                        <div class="task-actions">
                            <button class="edit-btn"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                    
                    tasksList.appendChild(taskItem);
                });
                
                // Add event listeners to the new elements
                document.querySelectorAll('.task-checkbox').forEach(checkbox => {
                    checkbox.addEventListener('change', toggleTask);
                });
                
                document.querySelectorAll('.edit-btn').forEach(btn => {
                    btn.addEventListener('click', editTask);
                });
                
                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', deleteTask);
                });
            }
            
            // Toggle task completion
            function toggleTask(e) {
                const taskId = Number(e.target.closest('.task-item').dataset.id);
                const task = tasks.find(task => task.id === taskId);
                
                if (task) {
                    task.completed = !task.completed;
                    saveTasks();
                    renderTasks();
                }
            }
            
            // Edit a task
            function editTask(e) {
                const taskItem = e.target.closest('.task-item');
                const taskId = Number(taskItem.dataset.id);
                const task = tasks.find(task => task.id === taskId);
                const taskText = taskItem.querySelector('.task-text');
                
                if (!task) return;
                
                // Create input field for editing
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.className = 'edit-input';
                editInput.value = task.text;
                
                // Replace text with input field
                taskText.replaceWith(editInput);
                editInput.focus();
                
                // Save edited task on blur or Enter key
                function saveEdit() {
                    const newText = editInput.value.trim();
                    if (newText !== '') {
                        task.text = newText;
                        saveTasks();
                    }
                    renderTasks();
                }
                
                editInput.addEventListener('blur', saveEdit);
                editInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        saveEdit();
                    }
                });
            }
            
            // Delete a task
            function deleteTask(e) {
                const taskId = Number(e.target.closest('.task-item').dataset.id);
                tasks = tasks.filter(task => task.id !== taskId);
                saveTasks();
                renderTasks();
            }
            
            // Save tasks to localStorage
            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
            
            // Initialize the application
            init();
        });
