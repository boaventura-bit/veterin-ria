let diseasesDatabase = [];
let diagnosisHistory = [];

// Abrir/Fechar Modais
function openDiagnosisForm() {
    document.getElementById('diagnosis-modal').style.display = 'flex';
}

function openAddDiseaseForm() {
    document.getElementById('disease-modal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Diagnosticar Doença
function diagnose() {
    const name = document.getElementById('animal-name').value;
    const weight = document.getElementById('animal-weight').value;
    const species = document.getElementById('animal-species').value;
    const breed = document.getElementById('animal-breed').value;
    const symptoms = document.getElementById('animal-symptoms').value.toLowerCase().split(', ');

    const matches = diseasesDatabase.filter(disease =>
        disease.species === species &&
        symptoms.every(symptom => disease.symptoms.includes(symptom))
    );

    if (matches.length > 0) {
        alert(`Diagnóstico(s): ${matches.map(d => d.name).join(', ')}`);
        diagnosisHistory.push({ name, weight, species, breed, symptoms, diagnosis: matches.map(d => d.name) });
    } else {
        alert('Nenhum diagnóstico encontrado.');
    }

    closeModal('diagnosis-modal');
}

// Adicionar Nova Doença
function addDisease() {
    const name = document.getElementById('disease-name').value;
    const species = document.getElementById('disease-species').value;
    const symptoms = document.getElementById('disease-symptoms').value.toLowerCase().split(', ');

    diseasesDatabase.push({ name, species, symptoms });
    alert(`Doença "${name}" adicionada com sucesso!`);
    closeModal('disease-modal');
}

// Exibir Histórico
function openHistory() {
    console.log('Histórico de Diagnósticos:', diagnosisHistory);
}

// Sair
function exitApp() {
    alert('Saindo...');
}
