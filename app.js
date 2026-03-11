const ACTIVITY_GROUPS={
"RIVNING":["Asbestsanering","Rivning","Slipning väggar","Håltagning","Städning"],
"VVS":["Kassettmontage","Rör i badrum","Rör till kök/WC","Avloppstam kök","Blandare diskbänk","Gummi kassettbotten","Kassettfront monterad","Städning"],
"BYGG":["Formning Genomföringar","Fönstermontage","Torkutrustning utställd","LP50 tak","Gjutning Genomföringar","Stomme väggar","Gipsning slitsar","Stomme tak","Gipsning köksschakt","Ny dörromfattning","Torkutrustning bortplockad","Kylskåp tillbakaställt","Städning"],
"KÖKSFÖRNYELSE":["Demontering","Målning stommar","Målning väggar","Montering stommar","Golvläggning","Kakel våtdel","Köksfläkt","Vitvaror","Belysning"],
"EL":["Omtrådning","Kanalisation vägg och tak","IMD-Kanalisation i kassett","Installation IMD"],
"MÅLNING":["Spackling tak","Spackling slitsar"],
"KAKEL":["Golvavjämning","Tätskikt","Plattsättning","Fogning","Städning"],
"KOMPLETTERING":["Montering dörr","Montering skåp","Montering sakvaror","Installation belysning","Mjukfogning","Montering porslin","Vatten på"]
}

const buildings={
"Dirigentgatan 6":[[456,450,444,439],[457,451,445,440],[458,452,446,441],[459,453,447,442],[460,454,448,443],[461,455,449,null],[478,472,466,463],[479,473,467,464],[480,474,468,465],[481,475,469,null],[482,476,470,null],[483,477,471,462]],
"Dirigentgatan 3":[[498,493,488,484],[499,494,489,485],[500,495,490,486],[501,496,491,487],[502,497,492,null],[523,517,511,null],[524,518,512,503],[519,513,507,504],[520,514,508,505],[521,515,509,506],[522,516,510,null]],
"Dirigentgatan 1":[[539,534,529,525],[540,535,530,526],[541,536,531,527],[542,537,532,528],[543,538,533,null],[564,558,552,null],[565,559,553,544],[560,554,548,545],[561,555,549,546],[562,556,550,547],[563,557,551,null]],
"Dirigentgatan 4":[[411,405,399,394],[412,406,400,395],[413,407,401,396],[414,408,402,397],[415,409,403,398],[416,410,404,null],[433,427,421,418],[434,428,422,419],[435,429,423,420],[436,430,424,null],[437,431,425,null],[438,432,426,417]]
}

const ADDRESS_ORDER=[
"Dirigentgatan 6",
"Dirigentgatan 3",
"Dirigentgatan 1",
"Dirigentgatan 4"
]

let currentAddress=null

function getData(){return JSON.parse(localStorage.getItem("aptData")||"{}")}
function saveData(d){localStorage.setItem("aptData",JSON.stringify(d))}

function allActivities(){
let list=[]
Object.entries(ACTIVITY_GROUPS).forEach(([g,acts])=>{
acts.forEach(a=>list.push(g+"|"+a))
})
return list
}

function progress(num){
const d=getData()[num]||{}
const acts=d.activities||{}
const all=allActivities()
let done=0
all.forEach(a=>{if(acts[a]==="klar")done++})
return Math.round(done/all.length*100)||0
}

function colorStatus(num){
const d=getData()[num]||{}
const acts=d.activities||{}
if(Object.values(acts).includes("försenad"))return "red"
const p=progress(num)
if(p==100)return "green"
if(p>0)return "orange"
return ""
}

function renderPlan(){

const root=document.getElementById("content")
root.innerHTML=""

const grid=document.createElement("div")
grid.className="address-grid"

ADDRESS_ORDER.forEach(addr=>{

const btn=document.createElement("button")
btn.className="address-btn"
btn.innerText=addr

btn.onclick=()=>{
currentAddress=addr
renderStams(addr)
}

grid.appendChild(btn)

})

root.appendChild(grid)

}

function renderStams(address){

const root=document.getElementById("content")
root.innerHTML=""

const stams=buildings[address]

stams.forEach((stam,i)=>{

const btn=document.createElement("button")
btn.className="address-btn"
btn.innerText="Stam "+(i+1)

btn.onclick=()=>renderApartments(address,i)

root.appendChild(btn)

})

}

function renderApartments(address,stamIndex){

const root=document.getElementById("content")
root.innerHTML=""

const stam=buildings[address][stamIndex]

const wrap=document.createElement("div")
wrap.className="stam"

stam.forEach(num=>{

const apt=document.createElement("div")
apt.className="apt "+colorStatus(num)

if(num!==null){

const data=getData()[num]||{}
const p=progress(num)

apt.innerHTML=`
${data.kitchen?'<div class="corner kok">KÖK</div>':''}
${data.towel?'<div class="corner ht">HT</div>':''}
${data.evak?'<div class="corner evak">EVAK</div>':''}
${data.tom?'<div class="corner tom">TOM</div>':''}

<div><strong>${num}</strong></div>
<div>${p}%</div>
`

apt.onclick=()=>openModal(num)

}else{

apt.style.visibility="hidden"

}

wrap.appendChild(apt)

})

root.appendChild(wrap)

}

function openModal(num){

const modal=document.getElementById("modal")
modal.style.display="block"

document.getElementById("aptTitle").innerText="LGH "+num

const data=getData()
const apt=data[num]||{activities:{},kitchen:false,towel:false,evak:false,tom:false,note:""}

document.getElementById("kitchen").checked=apt.kitchen
document.getElementById("towel").checked=apt.towel
document.getElementById("evak").checked=apt.evak
document.getElementById("tom").checked=apt.tom
document.getElementById("note").value=apt.note||""

const list=document.getElementById("activities")
list.innerHTML=""

Object.entries(ACTIVITY_GROUPS).forEach(([group,acts])=>{

const g=document.createElement("h4")
g.innerText=group
list.appendChild(g)

acts.forEach(a=>{

const key=group+"|"+a
const row=document.createElement("div")
row.className="activity"

const status=(apt.activities||{})[key]

row.innerHTML=`
${a}

<div>
<button class="btn green ${status==='klar'?'active':''}" onclick="toggleStatus('${num}','${key}','klar')">Klar</button>
<button class="btn orange ${status==='pågår'?'active':''}" onclick="toggleStatus('${num}','${key}','pågår')">Pågår</button>
<button class="btn red ${status==='försenad'?'active':''}" onclick="toggleStatus('${num}','${key}','försenad')">Försenad</button>
</div>
`

list.appendChild(row)

})

})

}

function toggleStatus(num,act,status){

const data=getData()
data[num]=data[num]||{activities:{}}

const current=data[num].activities?.[act]

if(current===status){
delete data[num].activities[act]
}else{
data[num].activities=data[num].activities||{}
data[num].activities[act]=status
}

saveData(data)
openModal(num)

}

function markAllDone(){

const num=document.getElementById("aptTitle").innerText.split(" ")[1]

const data=getData()
data[num]=data[num]||{activities:{}}

const all=allActivities()

const allDone=all.every(a=>data[num].activities?.[a]==="klar")

if(allDone){
data[num].activities={}
}else{
data[num].activities={}
all.forEach(a=>data[num].activities[a]="klar")
}

saveData(data)
openModal(num)

}

function saveOptions(num){

const data=getData()
data[num]=data[num]||{activities:{}}

data[num].kitchen=document.getElementById("kitchen").checked
data[num].towel=document.getElementById("towel").checked
data[num].evak=document.getElementById("evak").checked
data[num].tom=document.getElementById("tom").checked
data[num].note=document.getElementById("note").value

saveData(data)

}

function dashboard(){

/* DIN DASHBOARD FUNKTION ÄR OFÖRÄNDRAD */
location.reload()

}

function closeModal(){
document.getElementById("modal").style.display="none"
}

window.onload=renderPlan
