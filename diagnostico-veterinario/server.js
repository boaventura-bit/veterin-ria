const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// Função auxiliar para ler e escrever arquivos JSON
function readJsonFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath));
}

function writeJsonFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Rota para cadastrar diagnóstico
app.post('/historico', (req, res) => {
    const { name, weight, species, breed, symptoms } = req.body;

    console.log('Recebendo diagnóstico:', req.body);

    if (!name || !weight || !species || !breed || !symptoms) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const diagnosis = { name, weight, species, breed, symptoms };
    const history = readJsonFile(path.join(__dirname, 'data/historico.json'));

    history.push(diagnosis);
    writeJsonFile(path.join(__dirname, 'data/historico.json'), history);

    return res.status(200).json(diagnosis);
});

// Rota para listar todos os diagnósticos
app.get('/historico', (req, res) => {
    const history = readJsonFile(path.join(__dirname, 'data/historico.json'));
    res.json(history);
});

// Rota para editar um diagnóstico
app.put('/historico/:id', (req, res) => {
    const { id } = req.params;
    const { name, weight, species, breed, symptoms } = req.body;

    if (!name || !weight || !species || !breed || !symptoms) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const history = readJsonFile(path.join(__dirname, 'data/historico.json'));
    const diagnosisIndex = history.findIndex(d => d.id === id);

    if (diagnosisIndex === -1) {
        return res.status(404).json({ error: 'Diagnóstico não encontrado.' });
    }

    const updatedDiagnosis = { id, name, weight, species, breed, symptoms };
    history[diagnosisIndex] = updatedDiagnosis;

    writeJsonFile(path.join(__dirname, 'data/historico.json'), history);

    res.json(updatedDiagnosis);
});

// Rota para cadastrar doenças
app.post('/doencas', (req, res) => {
    const { name, species, symptoms } = req.body;

    console.log('Recebendo dados de doença:', req.body);

    if (!name || !species || !symptoms) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const disease = { name, species, symptoms };
    const diseases = readJsonFile(path.join(__dirname, 'data/doencas.json'));

    diseases.push(disease);
    writeJsonFile(path.join(__dirname, 'data/doencas.json'), diseases);

    return res.status(200).json(disease);
});

// Rota para listar todas as doenças
app.get('/doencas', (req, res) => {
    const diseases = readJsonFile(path.join(__dirname, 'data/doencas.json'));
    res.json(diseases);
});

// Rota para cadastrar veterinária
app.post('/veterinarias', (req, res) => {
    const { name, address, phone, specialties } = req.body;

    console.log('Recebendo dados de veterinária:', req.body);

    if (!name || !address || !phone || !specialties) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const veterinarian = { name, address, phone, specialties };
    const veterinarians = readJsonFile(path.join(__dirname, 'data/veterinarias.json'));

    veterinarians.push(veterinarian);
    writeJsonFile(path.join(__dirname, 'data/veterinarias.json'), veterinarians);

    return res.status(200).json(veterinarian);
});

// Rota para listar todas as veterinárias
app.get('/veterinarias', (req, res) => {
    const veterinarians = readJsonFile(path.join(__dirname, 'data/veterinarias.json'));
    res.json(veterinarians);
});

// Servir o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
