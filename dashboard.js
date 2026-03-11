function getData(){
return JSON.parse(localStorage.getItem("aptData")||"{}")
}

function dashboard(){

const root=document.getElementById("dashboard")

const data=getData()

let total=0
let done=0
let progressCount=0
let notstarted=0

Object.values(buildings).flat(2).forEach(num=>{

if(num===null)return

total++

const acts=data[num]?.activities||{}

let finished=Object.values(acts).filter(v=>v==="klar").length

if(finished>0 && finished<allActivities().length)progressCount++
else if(finished===allActivities().length)done++
else notstarted++

})

root.innerHTML=`

<div class="dashboard">

<div class="card total">
<h2>${total}</h2>
<p>Totalt</p>
</div>

<div class="card done">
<h2>${done}</h2>
<p>Klara</p>
</div>

<div class="card progress">
<h2>${progressCount}</h2>
<p>Pågår</p>
</div>

<div class="card notstarted">
<h2>${notstarted}</h2>
<p>Ej startade</p>
</div>

</div>

`

}

dashboard()
