
let storage=JSON.parse(localStorage.getItem("kaveros_data")||"{}")

const activities={
RIVNING:["Rivning","Slipning av väggar"],
EL:["Kanalisation","Dragning av IMD-kanalisation"],
BYGG:["Täckning av golv"]
}

const addresses={
"Hus":{
"Stam 1":["101","102","103","104"],
"Stam 2":["201","202","203","204"]
}
}

function save(){
localStorage.setItem("kaveros_data",JSON.stringify(storage))
}

function calcProgress(apt){

let total=0
let done=0

Object.keys(activities).forEach(cat=>{

activities[cat].forEach(act=>{

total++
if(storage[apt+"|"+cat+"|"+act]=="klar")done++

})

})

return Math.round(done/total*100)||0
}

function calcStatus(apt){

let progress=calcProgress(apt)
let delay=false

Object.keys(storage).forEach(k=>{

if(k.startsWith(apt+"|")&&storage[k]=="delay")delay=true

})

if(progress==100)return"done"
if(delay)return"delay"
if(progress>0)return"progress"
return"none"
}

function setStatus(key,val){

if(storage[key]==val)delete storage[key]
else storage[key]=val

save()
renderHouse()

let apt=key.split("|")[0]
openApartment(apt)
}

function openApartment(num){

let html=`<h2>LGH ${num}</h2>`

Object.keys(activities).forEach(cat=>{

html+=`<h3>${cat}</h3>`

activities[cat].forEach(act=>{

let key=num+"|"+cat+"|"+act
let val=storage[key]||""

html+=`
<div>
${act}
<button class="${val==='klar'?'active':''}" onclick="setStatus('${key}','klar')">Klar</button>
<button class="${val==='pagar'?'active':''}" onclick="setStatus('${key}','pagar')">Pågår</button>
<button class="${val==='delay'?'active':''}" onclick="setStatus('${key}','delay')">Försenad</button>
</div>
`

})

})

document.getElementById("apartmentContent").innerHTML=html
document.getElementById("modal").style.display="flex"
}

function renderHouse(){

if(!document.getElementById("house"))return

let html=""

Object.keys(addresses["Hus"]).forEach(stam=>{

html+=`<div class="stem"><b>${stam}</b>`

addresses["Hus"][stam].forEach(apt=>{

let status=calcStatus(apt)
let percent=calcProgress(apt)

html+=`<div class="apt ${status}" onclick="openApartment('${apt}')">${apt}<br>${percent}%</div>`

})

html+=`</div>`

})

document.getElementById("house").innerHTML=html
}

function renderDashboard(){

if(!document.getElementById("total"))return

storage=JSON.parse(localStorage.getItem("kaveros_data")||"{}")

let total=0
let done=0
let progress=0

Object.values(addresses["Hus"]).forEach(apts=>{

apts.forEach(a=>{

total++
let p=calcProgress(a)

if(p==100)done++
else if(p>0)progress++

})

})

document.getElementById("total").innerHTML="Totalt<br>"+total
document.getElementById("done").innerHTML="Klara<br>"+done
document.getElementById("progress").innerHTML="Pågår<br>"+progress
document.getElementById("notStarted").innerHTML="Ej startade<br>"+(total-done-progress)

}

window.addEventListener("load",()=>{

renderHouse()
renderDashboard()

})
