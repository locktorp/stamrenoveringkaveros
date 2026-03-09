
const activities={
"RIVNING":["Asbestsanering","Rivning","Håltagning","Städning"],
"VVS":["Kassettmontage","Rör i badrum","Rör till kök/WC"],
"BYGG":["Formning Genomföringar","Fönstermontage","Torkutrustning utställd","Torkutrustning bortplockad"],
"KAKEL":["Golvavjämning","Tätskikt","Plattsättning","Fogning"]
}

const addresses={
"Dirigentgatan 3":{
"Stam 5":["492","497","502"]
}
}

let storage=JSON.parse(localStorage.getItem("kaveros_data")||"{}")

function calcProgress(apt){
let total=0,done=0
Object.keys(activities).forEach(cat=>{
activities[cat].forEach(act=>{
total++
if(storage[apt+"|"+cat+"|"+act]=="klar") done++
})
})
return Math.round(done/total*100)
}

function calcStatus(apt){
let progress=calcProgress(apt)
let delay=false

Object.keys(storage).forEach(k=>{
if(k.startsWith(apt+"|") && storage[k]=="delay") delay=true
})

if(progress===100) return "done"
if(delay) return "delay"
if(progress>0) return "progress"
return "none"
}

function setStatus(key,val){
if(storage[key]==val) delete storage[key]
else storage[key]=val
localStorage.setItem("kaveros_data",JSON.stringify(storage))
renderHouse()
let apt=key.split("|")[0]
openApartment(apt)
}

function openApartment(num){

let html=`<div style="display:flex;justify-content:space-between;">
<h2>LGH ${num}</h2>
<button onclick="closeModal()">Stäng</button>
</div>`

Object.keys(activities).forEach(cat=>{
html+=`<h3>${cat}</h3>`
activities[cat].forEach(act=>{

let key=num+"|"+cat+"|"+act
let val=storage[key]||""

html+=`
<div class="activity">
<span>${act}</span>
<span>
<button class="btn-klar ${val==='klar'?'active':''}" onclick="setStatus('${key}','klar')">Klar</button>
<button class="btn-pagar ${val==='pagar'?'active':''}" onclick="setStatus('${key}','pagar')">Pågår</button>
<button class="btn-delay ${val==='delay'?'active':''}" onclick="setStatus('${key}','delay')">Försenad</button>
</span>
</div>`
})
})

document.getElementById("apartmentContent").innerHTML=html
document.getElementById("modal").style.display="flex"
}

function closeModal(){
document.getElementById("modal").style.display="none"
}

function renderHouse(){

let html=""

Object.keys(addresses).forEach(addr=>{

html+=`<h3>${addr}</h3>`
html+=`<div class="houseWrapper">`
html+=`<div class="floors"><div class="floor">3</div><div class="floor">2</div><div class="floor">1</div><div class="floor">0</div></div>`
html+=`<div class="house">`

Object.keys(addresses[addr]).forEach(stam=>{

html+=`<div class="stem"><b>${stam}</b>`

addresses[addr][stam].forEach(apt=>{

let status=calcStatus(apt)
let percent=calcProgress(apt)

html+=`
<div class="apt ${status}" onclick="openApartment('${apt}')">
${apt}<br>${percent}%
</div>`

})

html+=`</div>`
})

html+=`</div></div>`
})

document.getElementById("house").innerHTML=html
}

renderHouse()
