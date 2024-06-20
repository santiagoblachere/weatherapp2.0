import toDos from './toDos';
import project from './project';
import { compareAsc, format } from "date-fns";
import './style.css';

const { ToDo, createTodo } = toDos();
let { allProjects, createProject, deleteProject } = project();
const tasksSection = document.getElementById('tasks');
let allTasks = [];
const DEFAULT_PROJECT = 'DEFAULTPROJECT';

// LOCAL STORAGE PROJECTS
function getProjectsLS() {
    let projectsJSON = localStorage.getItem('projects');
    let parsedProjects = JSON.parse(projectsJSON) || [[DEFAULT_PROJECT]];
    allProjects = parsedProjects;
}

function setProjectLS(projects) {
    let JSONprojects = JSON.stringify(projects);
    localStorage.setItem('projects', JSONprojects);
}

function getTasksLS() {
    let tasksJSON = localStorage.getItem('tasks');
    let parsedTasks = JSON.parse(tasksJSON) || [];
    console.log(parsedTasks);
    allTasks = [];

    allTasks = parsedTasks.map((taskData) => {
        return createTodo(
            taskData.title,
            taskData.description,
            taskData.dueDate,
            taskData.priority,
            taskData.project
        );
    });
    console.log(allTasks)
    allProjects.forEach(project => project.length = 1);
    allTasks.forEach((task) => {
        if (task.project) {
            let projectIndex = allProjects.findIndex(project => project[0].toUpperCase() === task.project.toUpperCase());
            if (projectIndex !== -1) {
                task.projectSelect(allProjects[projectIndex]);
            }
        }
    });

    console.log(allProjects);
    setProjectLS(allProjects);
}

getProjectsLS();

function createProjectsOptions() {
    projectSelect.innerHTML = '';
    allProjects.forEach(project => {
        const option = document.createElement('option');
        option.value = project[0].toLowerCase().replace(/\s+/g, '-');
        option.textContent = project[0] === DEFAULT_PROJECT ? 'NONE' : project[0].toUpperCase();
        projectSelect.appendChild(option);
    });
}

function drawToDos(project) {
    cardContainer.innerHTML = '';
    project.slice(1).forEach(task => {
        const card = document.createElement('div');
        card.className = 'todo-card';

        const titleElement = document.createElement('h2');
        titleElement.textContent = task.title;
        card.appendChild(titleElement);

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = task.description;
        card.appendChild(descriptionElement);

        const dueDateElement = document.createElement('p');
        dueDateElement.textContent = `Due Date: ${task.dueDate}`;
        card.appendChild(dueDateElement);

        const priorityElement = document.createElement('p');
        priorityElement.textContent = `Priority: ${task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'N/A'}`;
        card.appendChild(priorityElement);

        const projectElement = document.createElement('p');
        projectElement.textContent = `Project: ${task.project ? task.project.charAt(0).toUpperCase() + task.project.slice(1) : 'N/A'}`;
        card.appendChild(projectElement);

        const deleteTaskButton = document.createElement('button');
        deleteTaskButton.textContent = "X";
        deleteTaskButton.addEventListener('click', () => {
            if (task.project) {
                const projectIndex = allProjects.findIndex(proj => proj[0].toUpperCase() === task.project.toUpperCase());
                if (projectIndex !== -1) {
                    task.deleteTask(allProjects[projectIndex]);
                    drawToDos(allProjects[projectIndex]);
                    allTasks = allTasks.filter(t => t.project !== task.project || t.title !== task.title);
                    localStorage.setItem('tasks', JSON.stringify(allTasks));
                }
            }
        });
        card.appendChild(deleteTaskButton);

        cardContainer.appendChild(card);
    });
}

// TASKS FORM
const taskForm = document.createElement('form');
taskForm.classList.add('task-form');

// Title
const titleLabel = document.createElement('label');
titleLabel.textContent = 'Title: ';
const titleInput = document.createElement('input');
titleInput.type = 'text';
titleInput.name = 'title';
titleInput.id = 'title';
titleInput.required = true;
taskForm.appendChild(titleLabel);
taskForm.appendChild(titleInput);
taskForm.appendChild(document.createElement('br'));

// Description
const descriptionLabel = document.createElement('label');
descriptionLabel.textContent = 'Description: ';
const descriptionInput = document.createElement('textarea');
descriptionInput.name = 'description';
descriptionInput.id = 'description';
taskForm.appendChild(descriptionLabel);
taskForm.appendChild(descriptionInput);
taskForm.appendChild(document.createElement('br'));

// Due Date
const dueDateLabel = document.createElement('label');
dueDateLabel.textContent = 'Due Date: ';
const dueDateInput = document.createElement('input');
dueDateInput.type = 'date';
dueDateInput.name = 'dueDate';
dueDateInput.id = 'dueDate';
dueDateInput.required = true;
taskForm.appendChild(dueDateLabel);
taskForm.appendChild(dueDateInput);
taskForm.appendChild(document.createElement('br'));

// Priority
const priorityLabel = document.createElement('label');
priorityLabel.textContent = 'Priority: ';
const prioritySelect = document.createElement('select');
prioritySelect.name = 'priority';
prioritySelect.id = 'priority';
['High', 'Medium', 'Low'].forEach(level => {
    const option = document.createElement('option');
    option.value = level.toLowerCase();
    option.textContent = level;
    prioritySelect.appendChild(option);
});
taskForm.appendChild(priorityLabel);
taskForm.appendChild(prioritySelect);
taskForm.appendChild(document.createElement('br'));

// Project
const projectLabel = document.createElement('label');
projectLabel.textContent = 'Project: ';
const projectSelect = document.createElement('select');
projectSelect.name = 'project';
projectSelect.id = 'project';
createProjectsOptions();
taskForm.appendChild(projectLabel);
taskForm.appendChild(projectSelect);
taskForm.appendChild(document.createElement('br'));

tasksSection.appendChild(taskForm);

const addTaskButton = document.createElement('button');
addTaskButton.setAttribute('type', 'submit');
addTaskButton.innerText = 'ADD TASK';
taskForm.appendChild(addTaskButton);

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;
    const project = document.getElementById('project').value.toUpperCase();
    
    const formattedDate = format(new Date(dueDate), 'MM/dd/yyyy');
    const newTask = createTodo(
        title,
        description,
        formattedDate,
        priority,
        project
    );

    const projectIndex = allProjects.findIndex(proj => proj[0].toUpperCase() === project);
    if (projectIndex !== -1) {
        newTask.projectSelect(allProjects[projectIndex]);
        allTasks.push(newTask);

        localStorage.setItem('tasks', JSON.stringify(allTasks));
        drawToDos(allProjects[projectIndex]);
    }
});

const cardContainer = document.createElement('div');
cardContainer.id = 'cardContainer';
tasksSection.appendChild(cardContainer);

// PROJECT section
const sidebar = document.getElementById('sidebar');

const createProjectInput = document.createElement('input');
createProjectInput.type = 'text';
createProjectInput.name = 'newProject';
createProjectInput.id = 'newProject';

const createProjectLabel = document.createElement('label');
createProjectLabel.textContent = 'New Project';
createProjectLabel.setAttribute('for', 'newProject');

const createProjectButton = document.createElement('button');
createProjectButton.textContent = 'ADD';

createProjectButton.addEventListener('click', (e) => {
    e.preventDefault();
    const projectName = document.getElementById('newProject').value;
    createProject(projectName, allProjects);
    setProjectLS(allProjects);
    createProjectsOptions();
    createNavSection();
});

sidebar.appendChild(createProjectLabel);
sidebar.appendChild(createProjectInput);
sidebar.appendChild(createProjectButton);

const nav = document.createElement('nav');
sidebar.appendChild(nav);

function createNavSection() {
    getTasksLS();
    nav.innerHTML = '';
    allProjects.forEach(project => {
        const navProjectContainer = document.createElement('div');
        const deleteProjectButton = document.createElement('button');
        deleteProjectButton.textContent = 'X';
        deleteProjectButton.classList.add('deleteProjectButton');
        const projectNavButton = document.createElement('button');
        projectNavButton.classList.add('projectNavButton');
        navProjectContainer.appendChild(projectNavButton);
        navProjectContainer.appendChild(deleteProjectButton);

        deleteProjectButton.addEventListener('click', () => {
            deleteProject(project[0], allProjects);
            setProjectLS(allProjects);
            createProjectsOptions();
            createNavSection();
        });

        if (project[0] === DEFAULT_PROJECT) {
            projectNavButton.textContent = 'NO PROJECT';
            navProjectContainer.removeChild(deleteProjectButton);
        } else {
            projectNavButton.textContent = project[0];
        }

        projectNavButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(project);
            drawToDos(project);
        });

        nav.appendChild(navProjectContainer);
    });
}

createNavSection();
createProjectsOptions();
