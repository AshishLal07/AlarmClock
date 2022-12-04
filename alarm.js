var alarms = [];
var addAlarm = document.getElementById("addalarm");
var currentData = new Date();
var cancel = document.getElementById('cancel')
var hour = document.getElementById('hour');
var minute = document.getElementById('minute');
var meridiem = document.getElementById('meridiem');
var alarmBox = document.getElementById('alarmBox');
var setAlarm = document.getElementById('setAlarm')
var currentTime = document.getElementById('current-time');
var alarmAudio = document.getElementById('alarm-audio')
var set;
// setting alarm audio when current Time is equal to the alarm time

const checkAlarm = (time)=>{
    var alarmactive = alarms.filter((alarm)=>{
        return alarm.active === true;
    });
    
    if(alarmactive.length > 0){
        var alarmring = alarmactive.filter((alarm)=>{
            return alarm.alarmString === time;
        })
        if(alarmring.length > 0){
            document.getElementById('alarm-ring').style.display ='block';
            var content = alarmring[0].alarmString
            document.getElementById('ringTime').innerHTML = content + "";
            set = setInterval( ()=>{
                alarmAudio.play();
            },1000);
        }
    }
    
}

var stop = document.getElementById('stop');
stop.addEventListener('click',()=>{
    clearInterval(set);
    document.getElementById('alarm-ring').style.display = 'none';
})

// create current time

const timeDisplay = (hour,minute,second,meridiem)=>{
    if(minute/10 < 1){
        minute = '0'+minute;
    }else if(second/10 <1){
        second = '0'+second;
    }
    return `${hour}:${minute}:${second}:${meridiem}`
}

function renderTime(){
    const newTime = new Date();
    var hour = newTime.getHours();
    var minute = newTime.getMinutes();
    var second = newTime.getSeconds();
    var merid = hour >= 12 ? 'PM':'AM';

    var getString = timeDisplay(hour,minute,second,merid);
    checkAlarm(getString);
    currentTime.innerHTML = getString;
}

setInterval(renderTime,1000);

// event listener on set Time

addAlarm.addEventListener('click',function(){
    document.getElementById('setTime').style.display = 'block';
    hour.value = currentData.getHours() ;
   
    if(currentData.getMinutes() >= 30){
        if(currentData.getMinutes() - 30 < 10){
            minute.value = '0'+currentData.getMinutes() - 30;
        }else if(currentData.getMinutes() == 30){
            minute.value = '00';
        }else{
            minute.value =  currentData.getMinutes() - 30  ;
        }
       hour.value = Number(hour.value) + 1 ;
    }else{
        minute.value = currentData.getMinutes() + 30 ;
    }
    
})

cancel.addEventListener('click',function(){
    document.getElementById('setTime').style.display = 'none';
})

// add alarm to array of alarms;
function addalarm(alarm){
    alarms.push(alarm);
    renderlist();
    
    
    
}

// render the list when item is added to the list

function renderlist(){
    alarmBox.innerHTML = "";
    for(let i = 0 ; i< alarms.length ; i++){
        createAlarm(alarms[i]);
    }
}

// delete functionality

function deleteAlarm(alarmId){
    const newAlarm = alarms.filter((alrm)=>{
        return alrm.id != Number(alarmId);
    });
    alarms = newAlarm;
    renderlist();
}

// function toggle which pause the alarm of respective day





// setting days for same alarm rather than today






// angle down functionality
var toggleTask = (alarmId)=>{
    const toggle =  alarms.filter((alarm)=>{
        return alarm.id === Number(alarmId);
    }) 
    
    if(toggle.length > 0){

        var alrm = toggle[0];
        alrm.active = !alrm.active;
        // renderlist();
        
    }
   
   
   
}

function handleEvent(event){
    var target = event.target;
    
    if(target.classList.contains('time')){
        target.classList.toggle('Setting');
        target.parentElement.classList.toggle('height');
    }else if(target.classList.contains('toggle')){
        
        target.classList.toggle('bcg-skyblue');
        target.firstElementChild.classList.toggle('left');
        toggleTask(target.dataset.id);
        var parentelem = target.parentElement.firstElementChild;
        if(parentelem.textContent === "Not scheduled"){
            parentelem.innerHTML = 'Active';
        }else{
            parentelem.innerHTML = "Not scheduled"
        }
    }else if(target.classList.contains('silent')){
        document.getElementById("alarmSound").style.display = "block";

    }else if(target.classList.contains('delete')){
        console.log(target);
        const alarmID = target.dataset.id;
        deleteAlarm(alarmID);
    }

}
alarmBox.addEventListener('click',handleEvent )


// add a element which contains detail of alarm clock submit

function createAlarm(alarm){

    const newAlarm = document.createElement('li');
    newAlarm.id = alarm.id;

    newAlarm.innerHTML = `
	            <div  class="time fn-lg">${alarm.hour} : ${alarm.minute} <span class="fn-md">${alarm.meridiem}</span></div>
	            <div  class="day-alarm fn-s"><span id="days">Not scheduled</span>  <div class="toggle" data-id = ${alarm.id}> <div class="ball circle"></div></div></div>
	            <div class="days"> 
	            	<div class="day circle">S</div>
	            	<div class="day circle">M</div>
	            	<div class="day circle">T</div>
	            	<div class="day circle">W</div>
	            	<div class="day circle">T</div>
	            	<div class="day circle">F</div>
	            	<div class="day circle">S</div>
	            </div>
	            <div class="silent" data-id = ${alarm.id}><span class="fn-s">Silent</span></div>
	            <div class="delete fn-s" data-id = ${alarm.id}>delete</div>
          
    `;
    newAlarm.setAttribute('class','alarm bcg-overlay ')
    alarmBox.append(newAlarm);

}

function handleinputAlarm(){
    var min = minute.value;
    if(min < 10){
        min = '0'+min;
    }
    if(hour.value > 23){
        document.getElementById('setTime').style.display = 'none';
        return
    }else if(minute.value > 59){
        document.getElementById('setTime').style.display = 'none';
        return
    }
   
    const alarm = {
        active:false,
        id : Date.now(),
        hour: hour.value,
        minute:min,
        meridiem:meridiem.value,
        alarmString: timeDisplay(hour.value,min,00,meridiem.value)
    }
    document.getElementById('setTime').style.display = 'none';
    addalarm(alarm);
    
}

hour.addEventListener('keyup', function(){
    if(this.value > 23){
        this.value = 23;
    }else if(this.value < 0){
        this.value = 0;
    }
})
minute.addEventListener('keyup', function(){
    
    if(this.value > 59){
        this.value = 59;
    }else if(this.value < 0){
        this.value = 0;
    }
})

setAlarm.addEventListener('click', handleinputAlarm);







