const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
let currentLi = null;
let tasksData = {};

function addTask(){
    if(inputBox.value === ''){
        alert("You must write something!");
    }
    else{
        let li = document.createElement("li");
        let taskId = 'task_' + Date.now();
        li.setAttribute('data-id', taskId);
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        
        let span = document.createElement("span");
        span.innerHTML = '\u00d7';
        li.appendChild(span);
        
        tasksData[taskId] = {
            text: inputBox.value,
            date: '',
            checklist: []
        };
        saveData();
    }
    inputBox.value = '';
}

listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        let rect = e.target.getBoundingClientRect();
        let clickX = e.clientX - rect.left;
        
        if(clickX < 45){
            e.target.classList.toggle("checked");
            saveData();
        } else {
            currentLi = e.target;
            openModal(e.target);
        }
    }    
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
}, false);

function openModal(li){
    let taskId = li.getAttribute('data-id');
    let taskData = tasksData[taskId] || {date: '', checklist: []};
    
    document.getElementById('task-date').value = taskData.date;
    
    let checklistDiv = document.getElementById('checklist-list');
    checklistDiv.innerHTML = '';
    taskData.checklist.forEach(item => {
        checklistDiv.innerHTML += `<div class="checklist-item">✓ ${item}</div>`;
    });
    
    document.getElementById('myModal').style.display = 'block';
}

function closeModal(){
    if(currentLi){
        let taskId = currentLi.getAttribute('data-id');
        tasksData[taskId].date = document.getElementById('task-date').value;
        saveData();
    }
    document.getElementById('myModal').style.display = 'none';
}

function addChecklist() {
    let input = document.getElementById('checklist-input');
    if (input.value && currentLi) {
        let taskId = currentLi.getAttribute('data-id');
        tasksData[taskId].checklist.push(input.value);

        let checklistDiv = document.getElementById('checklist-list');
        let item = document.createElement("div");
        item.className = "checklist-item";
        item.textContent = `✓ ${input.value}`;
        checklistDiv.appendChild(item);

        input.value = '';
        saveData();
    }
}

function saveData() {
    localStorage.setItem("tasksData", JSON.stringify(tasksData));
}

function renderTasks() {
    listContainer.innerHTML = '';
    for (let taskId in tasksData) {
        let li = document.createElement("li");
        li.setAttribute("data-id", taskId);
        li.textContent = tasksData[taskId].text;

        if (tasksData[taskId].checked) {
            li.classList.add("checked");
        }

        let span = document.createElement("span");
        span.innerHTML = '\u00d7';
        li.appendChild(span);
        listContainer.appendChild(li);
    }
}

function showTask() {
    let savedData = localStorage.getItem("tasksData");
    if (savedData) {
        tasksData = JSON.parse(savedData);
        renderTasks();
    }
}
showTask();

document.getElementById('myModal').addEventListener("click", function(e) {
    if (e.target === this) {
        closeModal();
    }
});

document.querySelector(".modal-content").addEventListener("click", function(e) {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
});