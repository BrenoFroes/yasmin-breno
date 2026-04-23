import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// TODO: Substitua com as credenciais do seu projeto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBlgppWLCP9aqd3nggj3kaumM75aAIgT_c",
    authDomain: "yasmin-e-breno.firebaseapp.com",
    projectId: "yasmin-e-breno",
    storageBucket: "yasmin-e-breno.firebasestorage.app",
    messagingSenderId: "32532442369",
    appId: "1:32532442369:web:3dedb56f6a2512a8243f00"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById('rsvp-form');
const feedback = document.getElementById('rsvp-feedback');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('.rsvp-btn');
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    feedback.textContent = '';
    feedback.className = 'rsvp-feedback';

    const data = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        guests: parseInt(form.guests.value),
        message: form.message.value.trim(),
        confirmedAt: serverTimestamp()
    };

    try {
        await addDoc(collection(db, 'rsvp'), data);
        feedback.textContent = 'Presença confirmada com sucesso! Nos vemos lá ♥';
        feedback.classList.add('success');
        form.reset();
    } catch (error) {
        console.error('Erro ao confirmar presença:', error);
        feedback.textContent = 'Ocorreu um erro. Tente novamente.';
        feedback.classList.add('error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Confirmar presença';
    }
});
