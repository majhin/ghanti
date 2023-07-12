import { updateDiv, renderOneAlarm } from "./editDiv.js";

let time;
let hr = document.getElementById('hr');
let minute = document.getElementById('minute');
let am_pm = document.getElementById('am-pm');
let day = document.getElementById('day');
let date = document.getElementById('date');
const form = document.getElementById('alarm');
let alarmsDiv = document.getElementById("alarms");
export const alarms = [];
let clocktype = "am_pm";


//gets the Day
function getDay (dateString) {
    const arr = dateString.split(" ");
    return arr[0];
}

//gets the Date
function getDate (dateString) {
    const arr = dateString.split(" ");
    return arr.slice(1);
}

//gets hours in am/pm or hrs format
function getHours (hours , minutes) {
    
    let ampm = hours >= 12 ? 'PM' : 'AM';
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours < 10 ? '0' + hours : hours;
    return {
        hours,
        ampm,
        minutes
    }
}

//toggles the status back to 'ON' if alarm set to repeat
function repeated (alarmToggle, alarm) {
    setTimeout(()=>{
        if(alarm.manualTurnedOff == false && alarm.status == "off") {
            alarmToggle.checked = true;
            alarm.status = 'on';
            renderAlarms();
        }
    },60000)
}

//checks the alarm and rings if matches current time
function checkAlarm () {
    var currentTimeString = time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0");
    for (let i=0; i<alarms.length; i++) {
        if (alarms[i].time == currentTimeString && alarms[i].status == 'on') {
            window.alert("DING DING DONG");
            alarms[i].status = 'off';
            let toggle = document.getElementById(`${i}checkBox`);
            toggle.checked = false;
            if (alarms[i].repeated == 'on'){
                repeated(toggle, alarms[i]);
            }                
        }
    }
}

//updates the time in realtime with per second accuracy
function getCurrentTime () {
    setInterval(() =>{
        time = new Date();
        
        if (clocktype == "am_pm") {
            hr.innerText = getHours(time.getHours()).hours;
            am_pm.innerText = getHours(time.getHours()).ampm;
        } else {
            hr.innerText = `${time.getHours()}`;
            am_pm.innerText = "Hrs";
        }
        minute.innerText = getHours(time.getHours(),time.getMinutes()).minutes;
        day.innerText = `${getDay(time.toDateString())}`;
        date.innerText = `${getDate(time.toDateString())}`;
        checkAlarm();
    },1000)
};

//Renders all alarms present in the array and borrows renderOneAlarm (f) from editDiv.js
function renderAlarms () {
    const list = document.getElementById("alarmsList");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
    //renders all alarms with their respective delete and status toggle buttons
    for (let i=0; i<alarms.length; i++) {
        let newAlarmDiv = renderOneAlarm(i);
        let para = newAlarmDiv.para;
        if (clocktype == "am_pm") {
            para.innerText = `${getHours(Number(alarms[i].time.split(':')[0])).hours}:${getHours(Number(alarms[i].time.split(':')[1]),Number(alarms[i].time.split(':')[1])).minutes}${getHours(Number(alarms[i].time.split(':')[0])).ampm} Repeat:${alarms[i].repeated}`;
        } else {
            para.innerText = `${alarms[i].time}Hrs Repeat:${alarms[i].repeated}`;
        }
    }
}
/*Adds the alarm and sorts all alarms by ascending order(duplicate alarms are allowed)
alarm with no time value not allowed
by default status of each alarm is 'ON' meaning its active
*/
function addAlarm (alarm) {
    let time = alarm.time;
    if (!time) {
        window.alert('Please enter time')
        return;
    }
    let repeated = alarm.repeated;
    const arr = time.split(":");
    time = "";
    for (let i=0; i<arr.length; i++){
        time += arr[i];
    }
    if (!repeated) {
        repeated = 'off';
    } 
    let newAlarm = {
        numTime : Number(time),
        time : alarm.time,
        repeated : repeated,
        status: 'on',
        manualTurnedOff: false,
    }
    alarms.push(newAlarm);
    alarms.sort(
        (p1, p2) => (p1.numTime > p2.numTime) ? 1 : (p1.numTime < p2.numTime) ? -1 : 0);
        renderAlarms();
}
    
//gets the input value for alarm and adds it to alarm array
function getFormContent(event) {
    event.preventDefault();
    const myFormData = new FormData(event.target);
    
    const formDataObj = {};
    myFormData.forEach((value, key) => (formDataObj[key] = value));
    addAlarm(formDataObj);
}

form.addEventListener('submit', getFormContent);

//toggles the status of alarm
function toggleStatus(index) {
    let id = index;
    const arr = index.split("c");
    index = arr[0];
    try {
        if (alarms[Number(index)].status == "on") {
            alarms[Number(index)].manualTurnedOff = true;
            alarms[Number(index)].status = "off";
            document.getElementById(`${id}`).checked = false;
        } else {
            alarms[Number(index)].status = "on";
            alarms[Number(index)].manualTurnedOff = false;
            document.getElementById(`${id}`).checked = true;
        }
    } catch (error) {
        //using try catch since upon click two events are fired
    }
}

//deletes the selected alarm and re-renders the alarms list
function deleteAlarm(index) {
    if (alarms.length == 1) {
        alarmsDiv.style.height = 43.5 + 'px'
    }
    alarms.splice(index, 1);
    renderAlarms();
}

//allows to edit the alarm(borrows (f)updateDiv from editDiv.js) 
// status is turned 'ON' upon update
function editAlarm(index) {        
    let newUpdateDiv = updateDiv(index);
    let div = newUpdateDiv.div;
    let image = newUpdateDiv.image;
    let updateForm = newUpdateDiv.updateForm;
    let inputTime = newUpdateDiv.inputTime;
    let updateCheckbox = newUpdateDiv.updateCheckbox;
    if (alarms[index].repeated == 'on') {
        updateCheckbox.checked = true;
    }
    updateForm.addEventListener('submit', (event) =>{
        deleteAlarm(index);
        getFormContent(event);
    });
}

//Event Listener for delete, toggle and toggling AM/PM / HRS
window.addEventListener('click', (e)=>{
    if (e.target.className === "delete-button"){
        deleteAlarm(Number(e.target.id.split('d')[0]));
    }
    
    if (e.target.tagName === "INPUT"){
        toggleStatus(e.target.id);
    }
    
    if (e.target.id == "am-pm") {
        if (clocktype == "hrs") {
            clocktype = "am_pm";
        } else {
            clocktype = "hrs";
        }
        renderAlarms();
    }
    if (e.target.className == "close") {
        renderAlarms();
        document.getElementById(`${e.target.id}`).classList.add('arrow');
        document.getElementById(`${e.target.id}`).classList.remove('close');
        
    }
    if (e.target.className == "arrow") {
        editAlarm(Number(e.target.id.split('e')[0]));
        document.getElementById(`${e.target.id}`).classList.add('close');
        document.getElementById(`${e.target.id}`).classList.remove('arrow');
    }
    
})
getCurrentTime();
    
    
