function dashboard(){

const root=document.getElementById("dashboard")

const data=JSON.parse(localStorage.getItem("aptData")||"{}")

let total=172
let done=0
let progressing=0
let notstarted=0

Object.values(buildings).flat(2).forEach(num=>{

if(num===null)return

const acts=data[num]?.activities||{}

const all=allActivities()

let d=0

all.forEach(a=>{
if(acts[a]==="klar")d++
})

const p=Math.round(d/all.length*100)||0

if(p===100)done++
else if(p>0)progressing++
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
<h2>${progressing}</h2>
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
