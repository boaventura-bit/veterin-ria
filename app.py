import tkinter as tk
from tkinter import messagebox
import json
import os

# Função para carregar dados de um arquivo JSON
def load_json(filename, default_data):
    if os.path.exists(filename):
        with open(filename, "r") as f:
            return json.load(f)
    else:
        return default_data

# Função para salvar dados em um arquivo JSON
def save_json(filename, data):
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)

# Carregar dados de doenças, histórico e animais
diseases_database = load_json("diseases.json", [])
diagnosis_history = load_json("diagnosis_history.json", [])
animals_data = load_json("animals.json", [])

def open_diagnosis_window():
    # Janela de Diagnóstico
    diagnosis_window = tk.Toplevel(root)
    diagnosis_window.title("Diagnóstico de Doenças")
    
    # Nome do Animal
    tk.Label(diagnosis_window, text="Nome do Animal:").grid(row=0, column=0, padx=10, pady=5, sticky="w")
    animal_name_entry = tk.Entry(diagnosis_window)
    animal_name_entry.grid(row=0, column=1, padx=10, pady=5, sticky="ew")

    # Peso
    tk.Label(diagnosis_window, text="Peso (kg):").grid(row=1, column=0, padx=10, pady=5, sticky="w")
    weight_entry = tk.Entry(diagnosis_window)
    weight_entry.grid(row=1, column=1, padx=10, pady=5, sticky="ew")

    # Espécie (cão/gato)
    tk.Label(diagnosis_window, text="Espécie (cão/gato):").grid(row=2, column=0, padx=10, pady=5, sticky="w")
    species_entry = tk.Entry(diagnosis_window)
    species_entry.grid(row=2, column=1, padx=10, pady=5, sticky="ew")

    # Raça
    tk.Label(diagnosis_window, text="Raça:").grid(row=3, column=0, padx=10, pady=5, sticky="w")
    breed_entry = tk.Entry(diagnosis_window)
    breed_entry.grid(row=3, column=1, padx=10, pady=5, sticky="ew")

    # Sintomas
    tk.Label(diagnosis_window, text="Sintomas (separe por vírgulas):").grid(row=4, column=0, padx=10, pady=5, sticky="w")
    symptoms_entry = tk.Entry(diagnosis_window)
    symptoms_entry.grid(row=4, column=1, padx=10, pady=5, sticky="ew")

    def diagnose():
        # Realiza o diagnóstico e exibe os resultados
        species = species_entry.get().strip().lower()
        symptoms = symptoms_entry.get().strip().lower().split(", ")
        diagnoses = diagnose_animal(symptoms, species)

        if diagnoses:
            result_text = "\n".join(diagnoses)
            messagebox.showinfo("Diagnóstico Sugerido", f"Nome do Animal: {animal_name_entry.get()}\nPeso: {weight_entry.get()} kg\nRaça: {breed_entry.get()}\nDiagnóstico(s):\n{result_text}")
            
            # Salvar diagnóstico no histórico e dados do animal
            diagnosis_data = {
                "animal_name": animal_name_entry.get(),
                "weight": weight_entry.get(),
                "species": species,
                "breed": breed_entry.get(),
                "symptoms": symptoms,
                "diagnosis": diagnoses
            }
            diagnosis_history.append(diagnosis_data)
            save_json("diagnosis_history.json", diagnosis_history)
            
            # Salvar dados do animal
            animal_data = {
                "name": animal_name_entry.get(),
                "weight": weight_entry.get(),
                "species": species,
                "breed": breed_entry.get()
            }
            animals_data.append(animal_data)
            save_json("animals.json", animals_data)

        else:
            messagebox.showwarning("Nenhum Diagnóstico", "Nenhum diagnóstico encontrado. Consulte um especialista.")

    def print_diagnosis():
        # Função para imprimir o diagnóstico (simulação de impressão na tela)
        species = species_entry.get().strip().lower()
        symptoms = symptoms_entry.get().strip().lower().split(", ")
        diagnoses = diagnose_animal(symptoms, species)

        if diagnoses:
            result_text = "\n".join(diagnoses)
            print(f"Nome do Animal: {animal_name_entry.get()}")
            print(f"Peso: {weight_entry.get()} kg")
            print(f"Raça: {breed_entry.get()}")
            print(f"Diagnóstico(s):\n{result_text}")
        else:
            print("Nenhum diagnóstico encontrado.")

    # Adicionando os botões de Diagnosticar e Imprimir
    tk.Button(diagnosis_window, text="Diagnosticar", command=diagnose).grid(row=5, column=0, columnspan=2, pady=10, sticky="ew")
    tk.Button(diagnosis_window, text="Imprimir", command=print_diagnosis).grid(row=6, column=0, columnspan=2, pady=10, sticky="ew")

def open_add_disease_window():
    # Janela de Cadastro de Doenças
    add_disease_window = tk.Toplevel(root)
    add_disease_window.title("Cadastro de Nova Doença")
    
    tk.Label(add_disease_window, text="Nome da Doença:").grid(row=0, column=0, padx=10, pady=5, sticky="w")
    disease_name_entry = tk.Entry(add_disease_window)
    disease_name_entry.grid(row=0, column=1, padx=10, pady=5, sticky="ew")

    tk.Label(add_disease_window, text="Espécie (cão/gato):").grid(row=1, column=0, padx=10, pady=5, sticky="w")
    disease_species_entry = tk.Entry(add_disease_window)
    disease_species_entry.grid(row=1, column=1, padx=10, pady=5, sticky="ew")

    tk.Label(add_disease_window, text="Sintomas (separe por vírgulas):").grid(row=2, column=0, padx=10, pady=5, sticky="w")
    disease_symptoms_entry = tk.Entry(add_disease_window)
    disease_symptoms_entry.grid(row=2, column=1, padx=10, pady=5, sticky="ew")

    def add_disease():
        # Adiciona a nova doença ao banco de dados
        name = disease_name_entry.get().strip()
        species = disease_species_entry.get().strip().lower()
        symptoms = disease_symptoms_entry.get().strip().lower().split(", ")

        if name and species and symptoms:
            diseases_database.append({"name": name, "symptoms": symptoms, "species": species})
            save_json("diseases.json", diseases_database)
            messagebox.showinfo("Sucesso", f"Doença '{name}' adicionada com sucesso!")
            disease_name_entry.delete(0, tk.END)
            disease_species_entry.delete(0, tk.END)
            disease_symptoms_entry.delete(0, tk.END)
        else:
            messagebox.showwarning("Erro", "Por favor, preencha todos os campos para cadastrar a doença.")

    tk.Button(add_disease_window, text="Cadastrar Doença", command=add_disease).grid(row=3, column=0, columnspan=2, pady=10, sticky="ew")

def open_history_window():
    # Janela de Histórico de Diagnósticos
    history_window = tk.Toplevel(root)
    history_window.title("Histórico de Diagnósticos")

    if diagnosis_history:
        for i, entry in enumerate(diagnosis_history):
            species = entry["species"]
            symptoms = ", ".join(entry["symptoms"])
            diagnosis = ", ".join(entry["diagnosis"])
            tk.Label(history_window, text=f"{i+1}. {entry['animal_name']} ({entry['weight']} kg, {entry['breed']}) - Espécie: {species}, Sintomas: {symptoms}, Diagnóstico: {diagnosis}").pack(anchor="w", padx=10, pady=5)
    else:
        tk.Label(history_window, text="Nenhum histórico disponível.").pack(padx=10, pady=10)

def diagnose_animal(symptoms, species):
    # Filtra as doenças com base nos sintomas e na espécie
    diagnoses = []
    for disease in diseases_database:
        if disease["species"] == species and all(symptom in disease["symptoms"] for symptom in symptoms):
            diagnoses.append(disease["name"])
    return diagnoses

# Configuração da interface gráfica do Menu Principal
root = tk.Tk()
root.title("Menu Principal - Diagnóstico Veterinário")

# Ajustando o layout com grid responsivo
root.grid_rowconfigure(0, weight=1)
root.grid_rowconfigure(1, weight=1)
root.grid_rowconfigure(2, weight=1)
root.grid_rowconfigure(3, weight=1)
root.grid_columnconfigure(0, weight=1)

# Botões de Menu
button_width = 30

diagnose_button = tk.Button(root, text="DIAGNOSTICAR", width=button_width, command=open_diagnosis_window)
diagnose_button.grid(row=0, column=0, padx=10, pady=10, sticky="ew")

add_disease_button = tk.Button(root, text="CADASTRAR DOENÇAS", width=button_width, command=open_add_disease_window)
add_disease_button.grid(row=1, column=0, padx=10, pady=10, sticky="ew")

history_button = tk.Button(root, text="HISTÓRICO", width=button_width, command=open_history_window)
history_button.grid(row=2, column=0, padx=10, pady=10, sticky="ew")

exit_button = tk.Button(root, text="SAIR", width=button_width, command=root.quit)
exit_button.grid(row=3, column=0, padx=10, pady=10, sticky="ew")

# Executa a interface gráfica
root.mainloop()
