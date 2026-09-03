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
const nameSelect = document.getElementById('name');
const guestsContainer = document.getElementById('guests-container');

async function loadGuests() {
    try {
        const res = await fetch('assets/data/guests.json');
        const guests = await res.json();
        guests.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            nameSelect.appendChild(option);

            const label = document.createElement('label');
            label.classList.add('guest-checkbox');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'guests';
            checkbox.value = name;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(name));
            guestsContainer.appendChild(label);
        });
        nameSelect.selectedIndex = 0;
    } catch (error) {
        console.error('Erro ao carregar lista de convidados:', error);
    }
}

loadGuests();

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
        guests: Array.from(guestsContainer.querySelectorAll('input:checked')).map(cb => cb.value),
        message: form.message.value.trim(),
        confirmedAt: serverTimestamp()
    };

    try {
        await addDoc(collection(db, 'rsvp'), data);
        feedback.textContent = 'Agradecemos de coração a retribuição de carinho. Você, de fato, é alguém muito especial para nós. Cada presença foi escolhida com muito amor e estamos felizes que faz parte dessa lista, não só por isso, mas também por compartilhar um pouco da nossa história com você. Nos vemos lá ♥';
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
