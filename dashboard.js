
let storage=JSON.parse(localStorage.getItem("kaveros_data")||"{}")

const apartments=["492","497","502"]

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
let delayHTML=""
let ht=0
let kok=0

apartments.forEach(a=>{

total++

let p=calcProgress(a)

if(p===100) done++
else if(p>0) progress++
else notStarted++

Object.keys(storage).forEach(k=>{
if(k.startsWith(a+"|") && storage[k]=="delay"){
delayHTML+=`LGH ${a}: ${k.split("|")[2]}<br>`
}

if(k==a+"|OPT|HT") ht++
if(k==a+"|OPT|KOK") kok++
})

})

document.getElementById("total").innerHTML="Totalt<br>"+total
document.getElementById("done").innerHTML="Klara<br>"+done
document.getElementById("progress").innerHTML="Pågår<br>"+progress
document.getElementById("notStarted").innerHTML="Ej startade<br>"+notStarted

document.getElementById("tillval").innerHTML=
`Handdukstork: ${ht}<br>Kök: ${kok}`

if(delayHTML==="") delayHTML="Inga förseningar registrerade"

document.getElementById("delays").innerHTML=delayHTML

}

load()
