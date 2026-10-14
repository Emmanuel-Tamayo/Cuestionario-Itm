console.log("Firebase script cargado");
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getFirestore, collection, addDoc, onSnapshot,
    query, orderBy , serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYbRLRgiN1iX8L1cFIEULhxgwpybN3gD0",
  authDomain: "cuestionario-itm.firebaseapp.com",
  projectId: "cuestionario-itm",
  storageBucket: "cuestionario-itm.firebasestorage.app",
  messagingSenderId: "555190930809",
  appId: "1:555190930809:web:2cf83aeb4aeb5a990873a8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const coleccion = collection(db, "respuestas");

const formulario = document.getElementById("formulario");
const tablaCuerpo = document.getElementById("tabla-cuerpo");
const contador = document.getElementById("Contador");

let respuestas = [];

function mostrar () { 
    tablaCuerpo.innerHTML = "";

    if (respuestas.length === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");
        celda.colSpan = 5;
        celda.textContent = "No hay respuestas registradas.";
        fila.appendChild(celda);
        tablaCuerpo.appendChild(fila);
    }

    respuestas.forEach(function (r) {
        const fila = document.createElement("tr");

        [r.nombre, r.correo, r.carrera, r.experiencia, r.materia].forEach(function (valor) { 
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        tablaCuerpo.appendChild(fila);
    });

    contador.textContent = respuestas.length + (respuestas.length ===1 ? " respuesta" : " respuestas");
}

const consulta = query(coleccion, orderBy("fecha", "asc"));

onSnapshot(
    consulta,
    function (snapshot) { 
        respuestas = snapshot.docs.map(function (doc) {
            return doc.data();
        });
        mostrar();
    },
    function (error) { 
        console.error("Error al leer", error);
    }
);

formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();
    console.log("se pulsó guardar");

  const nueva = {
    nombre: document.getElementById("nombre").value.trim(),
    correo: document.getElementById("correo").value.trim(),
    carrera: document.getElementById("Carrera").value.trim(),
    experiencia: document.getElementById("experiencia").value,
    materia: document.getElementById("materia").value,
    fecha: serverTimestamp()
  };

  try {
    await addDoc(coleccion, nueva);
    formulario.reset();
  } catch (error) { 
    console.error("Error al guardar:", error);
    alert("No se pudo guardar. Intente de nuevo.");
  }
});