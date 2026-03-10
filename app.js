
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZY6BJsd1MkzHIY6gUkwFFXz43ACv1NAk",
  authDomain: "stamrenovering-kaveros.firebaseapp.com",
  projectId: "stamrenovering-kaveros",
  storageBucket: "stamrenovering-kaveros.firebasestorage.app",
  messagingSenderId: "974224372973",
  appId: "1:974224372973:web:009e07621ecf4cbe5f88e4",
  measurementId: "G-DBMWLVR20L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let aptData = {};

const ACTIVITY_GROUPS={
"RIVNING":["Asbestsanering","Rivning","Slipning väggar","Håltagning","Städning"],
"VVS":["Kassettmontage","Rör i badrum","Rör till kök/WC","Avloppstam kök","Blandare diskbänk","Gummi kassettbotten","Kassettfront monterad","Städning"],
"BYGG":["Formning Genomföringar","Fönstermontage","Torkutrustning utställd","LP50 tak","Gjutning Genomföringar","Stomme väggar","Gipsning slitsar","Stomme tak","Gipsning köksschakt","Ny dörromfattning","Torkutrustning bortplockad","Kylskåp tillbakaställt","Städning"],
"KÖKSFÖRNYELSE":["Demontering","Målning stommar","Målning väggar","Montering stommar","Golvläggning","Kakel våtdel","Köksfläkt","Vitvaror","Belysning"],
"EL":["Omtrådning","Kanalisation vägg och tak","IMD-Kanalisation i kassett","Installation IMD"],
"MÅLNING":["Spackling tak","Spackling slitsar"],
"KAKEL":["Golvavjämning","Tätskikt","Plattsättning","Fogning","Städning"],
"KOMPLETTERING":["Montering dörr","Montering skåp","Montering sakvaror","Installation belysning","Mjukfogning","Montering porslin","Vatten på"]
};

function allActivities(){
let list=[]
Object.entries(ACTIVITY_GROUPS).forEach(([g,acts])=>{
acts.forEach(a=>list.push(g+"|"+a))
})
return list
}

async function saveApartment(id,data){
await setDoc(doc(db,"apartments",String(id)),data);
}

onSnapshot(collection(db,"apartments"),(snapshot)=>{
snapshot.docChanges().forEach(change=>{
aptData[change.doc.id]=change.doc.data();
});
renderPlan();
});

function progress(num){
const d=aptData[num]||{}
const acts=d.activities||{}
const all=allActivities()
let done=0
all.forEach(a=>{if(acts[a]==="klar")done++})
return Math.round(done/all.length*100)||0
}

function colorStatus(num){
const d=aptData[num]||{}
const acts=d.activities||{}
if(Object.values(acts).includes("försenad"))return "red"
const p=progress(num)
if(p==100)return "green"
if(p>0)return "orange"
return ""
}

const buildings={
"Dirigentgatan 6":[[456,450,444,439],[457,451,445,440],[458,452,446,441],[459,453,447,442],[460,454,448,443],[461,455,449,null],[478,472,466,463],[479,473,467,464],[480,474,468,465],[481,475,469,null],[482,476,470,null],[483,477,471,462]],
"Dirigentgatan 3":[[498,493,488,484],[499,494,489,485],[500,495,490,486],[501,496,491,487],[502,497,492,null],[523,517,511,null],[524,518,512,503],[519,513,507,504],[520,514,508,505],[521,515,509,506],[522,516,510,null]],
"Dirigentgatan 1":[[539,534,529,525],[540,535,530,526],[541,536,531,527],[542,537,532,528],[543,538,533,null],[564,558,552,null],[565,559,553,544],[560,554,548,545],[561,555,549,546],[562,556,550,547],[563,557,551,null]],
"Dirigentgatan 4":[[411,405,399,394],[412,406,400,395],[413,407,401,396],[414,408,402,397],[415,409,403,398],[416,410,404,null],[433,427,421,418],[434,428,422,419],[435,429,423,420],[436,430,424,null],[437,431,425,null],[438,432,426,417]]
};

window.renderPlan = function() {

const root=document.getElementById("content")
if(!root)return
root.innerHTML=""

Object.entries(buildings).forEach(([name,stams])=>{

const block=document.createElement("div")
block.className="house-block"
block.innerHTML="<h2>"+name+"</h2>"

const wrap=document.createElement("div")
wrap.className="stams"

stams.forEach((stam,i)=>{

const col=document.createElement("div")
col.className="stam"
col.innerHTML="<div class='stam-title'>Stam "+(i+1)+"</div>"

stam.forEach(num=>{

const apt=document.createElement("div")
apt.className="apt "+colorStatus(num)

if(num!==null){

const data=aptData[num]||{}
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

col.appendChild(apt)

})

wrap.appendChild(col)

})

block.appendChild(wrap)
root.appendChild(block)

})

}

function openModal(num){

const modal=document.getElementById("modal")
modal.style.display="block"
document.getElementById("aptTitle").innerText="LGH "+num

const data=aptData[num]||{activities:{},kitchen:false,towel:false,evak:false,tom:false,note:""}

document.getElementById("kitchen").checked=data.kitchen||false
document.getElementById("towel").checked=data.towel||false
document.getElementById("evak").checked=data.evak||false
document.getElementById("tom").checked=data.tom||false
document.getElementById("note").value=data.note||""

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
const status=(data.activities||{})[key]

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

window.toggleStatus=async function(num,act,status){

const data=aptData[num]||{activities:{}}

const current=data.activities?.[act]

if(current===status){
delete data.activities[act]
}else{
data.activities=data.activities||{}
data.activities[act]=status
}

await saveApartment(num,data)
}

window.markAllDone=async function(){

const num=document.getElementById("aptTitle").innerText.split(" ")[1]
const data=aptData[num]||{activities:{}}
const all=allActivities()

const allDone=all.every(a=>data.activities?.[a]==="klar")

if(allDone){
data.activities={}
}else{
data.activities={}
all.forEach(a=>data.activities[a]="klar")
}

await saveApartment(num,data)
}

window.closeModal=function(){
document.getElementById("modal").style.display="none"
}

window.dashboard = function () {

const root = document.getElementById("content")

root.innerHTML = `
<div class="section">
<h2>Dashboard</h2>

<p>Dashboarden laddas här.</p>

<p>Här kommer:</p>

<ul>
<li>Projektstatus</li>
<li>Tillval</li>
<li>Framdrift per hus</li>
<li>Försenade aktiviteter</li>
</ul>

</div>
`

}
