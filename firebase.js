
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyDZY6BJsd1MkzHIY6gUkwFFXz43ACv1NAk",
authDomain: "stamrenovering-kaveros.firebaseapp.com",
projectId: "stamrenovering-kaveros"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function firebaseSave(data){
setDoc(doc(db,"project","kaveros"),{data:data})
}

onSnapshot(doc(db,"project","kaveros"),(snap)=>{

if(!snap.exists()) return

let remote = snap.data().data
localStorage.setItem("kaveros_data",JSON.stringify(remote))

})
