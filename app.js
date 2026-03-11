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
if(window.innerWidth<768){
mobileAddresses()
}else{
desktopPlan()
}
}

function mobileAddresses(){

const root=document.getElementById("content")
root.innerHTML=""

const order=[
"Dirigentgatan 6",
"Dirigentgatan 3",
"Dirigentgatan 1",
"Dirigentgatan 4"
]

order.forEach(addr=>{

const btn=document.createElement("button")
btn.className="address-btn"
btn.innerText=addr
btn.onclick=()=>mobileStams(addr)

root.appendChild(btn)

})

const searchBtn=document.createElement("button")
searchBtn.className="address-btn search-btn"
searchBtn.innerText="🔎 Sök lägenhet"
searchBtn.onclick=mobileSearch

root.appendChild(searchBtn)

}

function mobileStams(address){

const root=document.getElementById("content")
root.innerHTML=""

backButton(mobileAddresses)

buildings[address].forEach((stam,i)=>{

const btn=document.createElement("button")
btn.className="address-btn"
btn.innerText="Stam "+(i+1)

btn.onclick=()=>mobileApartments(address,i)

root.appendChild(btn)

})

}

function mobileSearch(){

const root=document.getElementById("content")
root.innerHTML=""

backButton(mobileAddresses)

const input=document.createElement("input")
input.placeholder="Ange lägenhetsnummer"
input.className="search-input"

const btn=document.createElement("button")
btn.innerText="Sök"
btn.className="address-btn"

btn.onclick=function(){

const num=input.value.trim()

if(!num)return

openModal(num)

}

root.appendChild(input)
root.appendChild(btn)

}

function mobileApartments(address,stamIndex){

lastMobileView = ()=>mobileApartments(address,stamIndex)

const root=document.getElementById("content")
root.innerHTML=""

backButton(()=>mobileStams(address))

const stam=buildings[address][stamIndex]

stam.forEach(num=>{

if(num===null)return

const p=progress(num)
const btn=document.createElement("button")

btn.className="address-btn "+colorStatus(num)

const data=getData()[num]||{}

let left=""
let right=""

if(data.towel)left+="HT "
if(data.kitchen)left+="KÖK "

if(data.tom)right+="TOM "
if(data.evak)right+="EVAK"

btn.innerHTML=`
<span class="apt-left">${left}</span>
<span class="apt-center">LGH ${num} – ${p}%</span>
<span class="apt-right">${right}</span>
`

btn.onclick=()=>openModal(num)

root.appendChild(btn)

})

}

function backButton(callback){

const root=document.getElementById("content")

const btn=document.createElement("button")
btn.className="address-btn back-btn"
btn.innerText="← Tillbaka"
btn.onclick=callback

root.appendChild(btn)

}

let lastMobileView=null

function closeModal(){

document.getElementById("modal").style.display="none"

if(window.innerWidth<768 && lastMobileView){
lastMobileView()
}else{
renderPlan()
}

}

window.onload=function(){
renderPlan()
}
