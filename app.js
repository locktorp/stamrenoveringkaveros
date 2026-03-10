
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZY6BJsd1MkzHIY6gUkwFFXz43ACv1NAk",
  authDomain: "stamrenovering-kaveros.firebaseapp.com",
  projectId: "stamrenovering-kaveros",
  storageBucket: "stamrenovering-kaveros.firebasestorage.app",
  messagingSenderId: "974224372973",
  appId: "1:974224372973:web:009e07621ecf4cbe5f88e4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let aptData = {}

function progress(id){
const data = aptData[id] || {}
const acts = data.activities || {}
const total = Object.keys(acts).length
const done = Object.values(acts).filter(v=>v==="klar").length
if(total===0) return 0
return Math.round(done/total*100)
}

onSnapshot(collection(db,"apartments"),snap=>{
snap.forEach(doc=>{
aptData[doc.id]=doc.data()
})
renderPlan()
})

async function saveApartment(id,data){
await setDoc(doc(db,"apartments",String(id)),data)
}

const apartments=[456,450,444,439]

window.renderPlan=function(){

const root=document.getElementById("content")
root.innerHTML=""

apartments.forEach(id=>{

const box=document.createElement("div")
box.className="apt"
box.innerHTML="<strong>"+id+"</strong><div>"+progress(id)+"%</div>"
box.onclick=()=>openModal(id)

root.appendChild(box)

})
}

window.dashboard=function(){

let done=0
let progressing=0
let notstarted=0

Object.keys(aptData).forEach(id=>{
const p=progress(id)
if(p===100) done++
else if(p>0) progressing++
else notstarted++
})

const root=document.getElementById("content")

root.innerHTML=`
<div class="dashboard">
<div class="card total"><h2>172</h2></div>
<div class="card done"><h2>${done}</h2></div>
<div class="card progress"><h2>${progressing}</h2></div>
<div class="card notstarted"><h2>${notstarted}</h2></div>
</div>
`
}

function openModal(id){
document.getElementById("modal").style.display="block"
document.getElementById("aptTitle").innerText="LGH "+id
}

window.markAllDone=async function(){
const id=document.getElementById("aptTitle").innerText.split(" ")[1]
const data={activities:{done:"klar"}}
await saveApartment(id,data)
}

window.closeModal=function(){
document.getElementById("modal").style.display="none"
}
