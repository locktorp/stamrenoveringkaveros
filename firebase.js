
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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

function firebaseSave(data){
setDoc(doc(db,"project","kaveros"),{data:data})
}

onSnapshot(doc(db,"project","kaveros"),(snap)=>{

if(snap.exists()){
let remote=snap.data().data
window.storage=remote
localStorage.setItem("kaveros_data",JSON.stringify(remote))
}

})

const oldSetItem = localStorage.setItem
localStorage.setItem = function(key,value){

oldSetItem.apply(this,arguments)

if(key==="kaveros_data"){
try{ firebaseSave(JSON.parse(value)) }catch(e){}
}

}
