const API_URL = "http://localhost:3000"; // URL da API

// Função para abrir modais
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';

    // Marca explicitamente que o modal está aberto
    modal.dataset.isOpen = 'true';
}

// Função para fechar modais
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';

    // Atualiza o estado de aberto
    modal.dataset.isOpen = 'false';
}

// Função para abrir o formulário de diagnóstico
function openDiagnosisForm() {
    openModal('diagnosis-modal');
}

// Função para abrir o formulário de cadastro de doenças
function openAddDiseaseForm() {
    openModal('disease-modal');
}

// Função para abrir o formulário de cadastro de veterinárias
function openAddVeterinarianForm() {
    openModal('veterinarian-modal');
}

// Função para abrir o modal de exibição do diagnóstico
function openDiagnosisResult(diagnosisData) {
    const resultModal = document.getElementById('diagnosis-result-modal');

    // Preenche os dados no modal de resultado
    resultModal.querySelector('#result-animal-name').textContent = `Nome: ${diagnosisData.name}`;
    resultModal.querySelector('#result-animal-weight').textContent = `Peso: ${diagnosisData.weight} kg`;
    resultModal.querySelector('#result-animal-species').textContent = `Espécie: ${diagnosisData.species}`;
    resultModal.querySelector('#result-animal-breed').textContent = `Raça: ${diagnosisData.breed}`;
    resultModal.querySelector('#result-animal-symptoms').textContent = `Sintomas: ${diagnosisData.symptoms.join(', ')}`;
    resultModal.querySelector('#result-diagnosis').textContent = `Diagnóstico: ${diagnosisData.diagnosis}`;

    // Exibe o modal de resultado e previne fechamento automático
    openModal('diagnosis-result-modal');
}

// Função para buscar o histórico e exibir no modal
async function openHistory() {
    try {
        const response = await fetch(`${API_URL}/historico`);
        if (response.ok) {
            const historyData = await response.json();

            const historyModal = document.getElementById('history-modal');
            const historyList = historyModal.querySelector('#history-list');

            // Limpa o conteúdo existente
            historyList.innerHTML = '';

            // Preenche a lista de histórico
            historyData.forEach(entry => {
                const listItem = document.createElement('li');
                listItem.textContent = `Nome: ${entry.name}, Diagnóstico: ${entry.diagnosis}`;
                historyList.appendChild(listItem);
            });

            // Abre o modal de histórico
            openModal('history-modal');
        } else {
            const errorData = await response.json();
            console.error("Erro ao carregar o histórico:", errorData);
            alert('Erro ao carregar o histórico. Tente novamente.');
        }
    } catch (error) {
        console.error("Erro ao buscar o histórico:", error);
        alert("Erro ao buscar o histórico.");
    }
}

// Função para realizar diagnóstico
async function diagnose() {
    const name = document.getElementById('animal-name').value.trim();
    const weight = document.getElementById('animal-weight').value.trim();
    const species = document.getElementById('animal-species').value;
    const breed = document.getElementById('animal-breed').value.trim();
    const symptoms = document.getElementById('animal-symptoms').value.trim().split(',');

    if (name && weight && species && breed && symptoms.length > 0) {
        const diagnosisData = {
            name,
            weight,
            species,
            breed,
            symptoms: symptoms.map(s => s.trim())
        };

        // Simulação de diagnóstico (pode ser feito pela API, se necessário)
        diagnosisData.diagnosis = "Doença X"; // Aqui você pode adicionar a lógica real para determinar o diagnóstico baseado nos sintomas

        try {
            const response = await fetch(`${API_URL}/historico`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(diagnosisData)
            });

            if (response.ok) {
                closeModal('diagnosis-modal');
                document.getElementById('diagnosis-form').reset();

                // Exibir o resultado do diagnóstico
                openDiagnosisResult(diagnosisData); // Modal de resultado aberto sem fechamento automático
            } else {
                const data = await response.json();
                alert(`Erro ao salvar diagnóstico: ${data.error || 'Tente novamente.'}`);
            }
        } catch (error) {
            console.error("Erro ao realizar diagnóstico:", error);
            alert("Erro ao realizar diagnóstico.");
        }
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

// Função para cadastrar nova doença
async function addDisease() {
    const name = document.getElementById('disease-name').value.trim();
    const species = document.getElementById('disease-species').value;
    const symptoms = document.getElementById('disease-symptoms').value.trim().split(',');

    if (name && species && symptoms.length > 0) {
        const newDisease = {
            name,
            species,
            symptoms: symptoms.map(s => s.trim())
        };

        try {
            const response = await fetch(`${API_URL}/doencas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDisease)
            });

            if (response.ok) {
                alert("Doença cadastrada com sucesso!");
                closeModal('disease-modal');
                document.getElementById('disease-form').reset();
            } else {
                alert("Erro ao cadastrar a doença. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao cadastrar doença:", error);
            alert("Erro ao cadastrar doença.");
        }
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

// Função para cadastrar nova veterinária
async function addVeterinarian() {
    const name = document.getElementById('clinic-name').value.trim();
    const address = document.getElementById('clinic-address').value.trim();
    const phone = document.getElementById('clinic-phone').value.trim();
    const specialties = document.getElementById('clinic-specialties').value.trim().split(',');

    if (name && address && phone && specialties.length > 0) {
        const newVeterinarian = {
            name,
            address,
            phone,
            specialties: specialties.map(s => s.trim())
        };

        try {
            const response = await fetch(`${API_URL}/veterinarias`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVeterinarian)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Veterinária cadastrada com sucesso!");
                closeModal('veterinarian-modal');
                document.getElementById('veterinarian-form').reset();
            } else {
                alert(`Erro: ${data.error}`);
            }
        } catch (error) {
            console.error("Erro ao cadastrar veterinária:", error);
            alert("Erro ao cadastrar veterinária.");
        }
    } else {
        alert("Por favor, preencha todos os campos.");
    }
}

// Função para listar doenças e exibir no modal
async function openDiseases() {
    try {
        const response = await fetch(`${API_URL}/doencas`);
        if (response.ok) {
            const diseasesData = await response.json();

            const diseasesModal = document.getElementById('diseases-modal');
            const diseasesList = diseasesModal.querySelector('#diseases-list');

            // Limpa o conteúdo existente
            diseasesList.innerHTML = '';

            // Preenche a lista de doenças
            diseasesData.forEach(disease => {
                const listItem = document.createElement('li');
                listItem.textContent = `Doença: ${disease.name}, Espécie: ${disease.species}`;
                diseasesList.appendChild(listItem);
            });

            // Abre o modal de doenças
            openModal('diseases-modal');
        } else {
            const errorData = await response.json();
            console.error("Erro ao carregar doenças:", errorData);
            alert('Erro ao carregar doenças. Tente novamente.');
        }
    } catch (error) {
        console.error("Erro ao buscar doenças:", error);
        alert("Erro ao buscar doenças.");
    }
}

// Função para listar veterinárias e exibir no modal
async function openVeterinarians() {
    try {
        const response = await fetch(`${API_URL}/veterinarias`);
        if (response.ok) {
            const veterinariansData = await response.json();

            const veterinariansModal = document.getElementById('veterinarians-modal');
            const veterinariansList = veterinariansModal.querySelector('#veterinarians-list');

            // Limpa o conteúdo existente
            veterinariansList.innerHTML = '';

            // Preenche a lista de veterinárias
            veterinariansData.forEach(veterinarian => {
                const listItem = document.createElement('li');
                listItem.textContent = `Nome: ${veterinarian.name}, Endereço: ${veterinarian.address}`;
                veterinariansList.appendChild(listItem);
            });

            // Abre o modal de veterinárias
            openModal('veterinarians-modal');
        } else {
            const errorData = await response.json();
            console.error("Erro ao carregar veterinárias:", errorData);
            alert('Erro ao carregar veterinárias. Tente novamente.');
        }
    } catch (error) {
        console.error("Erro ao buscar veterinárias:", error);
        alert("Erro ao buscar veterinárias.");
    }
}
