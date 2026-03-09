
const activitiesKey="kaveros_data"
let storage=JSON.parse(localStorage.getItem(activitiesKey)||"{}")

function calcProgress(apt){
let total=0,done=0
Object.keys(storage).forEach(k=>{
if(k.startsWith(apt+"|")){
total++
if(storage[k]=="klar") done++
}
})
if(total===0) return 0
return Math.round(done/total*100)
}

function load(){

let total=0,done=0,progress=0,notStarted=0
let delays=""

Object.keys(storage).forEach(k=>{

if(storage[k]=="delay"){
let parts=k.split("|")
delays+=`LGH ${parts[0]}: ${parts[2]}<br>`
}

})

let apartments=["492","497","502"]

apartments.forEach(a=>{

total++

let p=calcProgress(a)

if(p===100) done++
else if(p>0) progress++
else notStarted++

})

document.getElementById("total").innerHTML="Totalt<br>"+total
document.getElementById("done").innerHTML="Klara<br>"+done
document.getElementById("progress").innerHTML="Pågår<br>"+progress
document.getElementById("notStarted").innerHTML="Ej startade<br>"+notStarted

if(delays==="") delays="Inga förseningar registrerade"

document.getElementById("delays").innerHTML=delays

}

load()
