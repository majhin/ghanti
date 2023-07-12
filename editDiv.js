import { alarms } from "./script.js";
var desiredHeight = 43.5;
const list = document.getElementById("alarmsList");
let alarmsDiv = document.getElementById("alarms");

export function updateDiv(index) {
    let alarmDiv = document.getElementById(index + "alarm");
    alarmDiv.children[0].remove();
    alarmDiv.children[0].remove();
    alarmDiv.children[0].remove();
    alarmDiv.style.height = 60 + 'px'
    alarmsDiv.style.height = (Number(alarmsDiv.style.height.split('p')[0])+73.6-43.5) + 'px';
    var image = document.getElementById(index+"edit");
    image.src = "Assets/close.png";
    
    let div = document.createElement("div");
    div.classList.add("pos")
    let updateForm = document.createElement("form");
    updateForm.style.minWidth = 270 + 'px'
    updateForm.classList.add("pos")
    let labelTime = document.createElement('label');
    labelTime.setAttribute('for', 'time');
    labelTime.classList.add("font");
    labelTime.innerText = "Time";
    updateForm.appendChild(labelTime);
    let inputTime = document.createElement('input');
    inputTime.setAttribute('id', 'time');
    inputTime.classList.add("font");
    inputTime.setAttribute('name', 'time');
    inputTime.setAttribute('type', 'time');
    inputTime.setAttribute('value', `${alarms[index].time}`);
    updateForm.appendChild(inputTime);
    let labelRepeated = document.createElement("label");
    labelRepeated.setAttribute('for', 'repeated');
    labelRepeated.classList.add("font");
    labelRepeated.innerText = "Repeat";
    updateForm.appendChild(labelRepeated);
    let updateCheckbox = document.createElement("input");
    updateCheckbox.setAttribute('type', 'checkbox');
    updateCheckbox.setAttribute('name', 'repeated');
    updateCheckbox.setAttribute('id', 'repeated');
    updateForm.appendChild(updateCheckbox);
    let updateButton = document.createElement("button");
    updateButton.classList.add("submit-button");
    updateButton.setAttribute('type', 'submit');
    updateButton.innerText = "Update";
    updateForm.appendChild(updateButton);
    div.appendChild(updateForm);
    alarmDiv.appendChild(div);
    return {
        div,
        updateForm,
        inputTime,
        updateCheckbox,
        updateButton,
        image
    }
}

export function renderOneAlarm (i) {
    var listItem = document.createElement("div");
    listItem.setAttribute('id',`${i}alarm`);
    listItem.classList.add("listItem", "font", "pos");
    var para = document.createElement("p");
    listItem.appendChild(para);
    alarmsDiv.style.height = (desiredHeight*(i+1)) + "px";
    list.appendChild(listItem);
    var label = document.createElement("label");
    label.classList.add("toggle-btn");
    label.setAttribute('for',`${i}checkBox`);
    var input = document.createElement("input");
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id',`${i}checkBox`);
    label.appendChild(input);        
    var span  = document.createElement("span");
    span.classList.add("slider");
    label.appendChild(span);
    listItem.appendChild(label);
    if (alarms[i].status == 'off') {
        input.checked = false;
    } else {
        input.checked = true;
    }
    var button = document.createElement("button");
    button.innerText = "Delete";
    button.classList.add("delete-button");
    button.setAttribute('id',`${i}delete`);
    listItem.appendChild(button);
    var image = document.createElement("img");
    image.setAttribute('id',`${i}edit`);
    image.src = "Assets/arrow.png";
    image.classList.add("arrow")
    listItem.appendChild(image);
    return {
        para
    }
}
