
let storage = JSON.parse(localStorage.getItem("kaveros_data")||"{}")
function calcStatus(apt){

let delay=false
let progress=false
let done=true

Object.keys(storage).forEach(k=>{

if(!k.startsWith(apt+"|")) return

if(storage[k]=="delay") delay=true
if(storage[k]=="pagar") progress=true
if(storage[k]!="klar") done=false

})

if(done && Object.keys(storage).length>0) return "done"
if(delay) return "delay"
if(progress) return "progress"

return "none"

}
let currentApartment=null

function saveUser(){
let name=document.getElementById("usernameInput").value
if(!name) return
localStorage.setItem("kaveros_user",name)
document.getElementById("currentUser").innerText="Inloggad: "+name
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
currentApartment=num

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
currentApartment=null
}
