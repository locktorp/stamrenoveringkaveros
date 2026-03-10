
const activities={
"RIVNING":["Asbestsanering","Rivning","Håltagning","Slipning av väggar","Städning"],
"EL":["Kanalisation vägg och tak","Dragning av IMD-kanalisation"],
"BYGG":["Formning Genomföringar","Täckning av golv","Stomme väggar"],
"KAKEL":["Golvavjämning","Tätskikt","Plattsättning"]
}

const addresses={
"Dirigentgatan 6":{
"Stam 1":["439","444","450","456"],
"Stam 2":["440","445","451","457"]
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
if(progress==100) return "done"
if(progress>0) return "progress"
return "none"
}

function renderHouse(){

if(!document.getElementById("house")) return

let html=""

Object.keys(addresses).forEach(addr=>{

html+=`<h3>${addr}</h3>`
html+=`<div class="houseWrapper">`

html+=`
<div class="floors">
<div class="floor">3</div>
<div class="floor">2</div>
<div class="floor">1</div>
<div class="floor">0</div>
</div>
`

html+=`<div class="house">`

Object.keys(addresses[addr]).forEach(stam=>{

html+=`<div class="stem"><b>${stam}</b>`

addresses[addr][stam].forEach(apt=>{

let status=calcStatus(apt)
let percent=calcProgress(apt)

html+=`
<div class="apt ${status}" onclick="alert('Lägenhet '+${apt})">
${apt}<br>${percent}%
</div>
`
})

html+=`</div>`
})

html+=`</div></div>`
})

document.getElementById("house").innerHTML=html
}

function renderDashboard(){

if(!document.getElementById("total")) return

let total=0,done=0,progress=0,notStarted=0

Object.values(addresses).forEach(stams=>{
Object.values(stams).forEach(apts=>{
apts.forEach(a=>{

total++
let p=calcProgress(a)

if(p==100) done++
else if(p>0) progress++
else notStarted++

})
})
})

document.getElementById("total").innerHTML="Totalt<br>"+total
document.getElementById("done").innerHTML="Klara<br>"+done
document.getElementById("progress").innerHTML="Pågår<br>"+progress
document.getElementById("notStarted").innerHTML="Ej startade<br>"+notStarted

}

renderHouse()
renderDashboard()
