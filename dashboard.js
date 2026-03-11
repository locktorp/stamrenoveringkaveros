function dashboard(){

const root=document.getElementById("content")

const data=getData()

let total=0
let done=0
let progressing=0
let notstarted=0

let kitchen=0
let towel=0

let delayed=[]

Object.values(buildings).flat(2).forEach(num=>{

if(num===null)return

total++

const p=progress(num)

if(p===100)done++
else if(p>0)progressing++
else notstarted++

const d=data[num]||{}

if(d.kitchen)kitchen++
if(d.towel)towel++

Object.entries(d.activities||{}).forEach(([act,status])=>{

if(status==="försenad"){
delayed.push("LGH "+num+" – "+act.split("|")[1])
}

})

})

let houseHTML=""

Object.entries(buildings).forEach(([house,stams])=>{

let sum=0
let count=0

stams.flat().forEach(num=>{

if(num!==null){
sum+=progress(num)
count++
}

})

const p=Math.round(sum/count)

houseHTML+=`

${house}

<div class="progressbar">
<div class="bar" style="width:${p}%"></div>
</div>

${p}%

<br><br>

`

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

<div class="dashboard">

<div class="card option">
<h2>${kitchen}</h2>
<p>Köksförnyelse</p>
</div>

<div class="card option">
<h2>${towel}</h2>
<p>Handdukstork</p>
</div>

</div>

<div class="section">

<h3>Framdrift per hus</h3>

${houseHTML}

</div>

<div class="section">

<h3>Försenade aktiviteter</h3>

<div class="delayed">

${delayed.length?delayed.join("<br>"):"Inga förseningar"}

</div>

</div>

`

}

dashboard()
