// src/entities/index.js

// --- DADOS MOCADOS (SIMULAÇÃO DE BASE DE DADOS) ---
// Em um projeto real, estes dados viriam de uma API.

let students = [
    { id: '1', name: 'João Silva', grade: '3º Ano A', diagnoses: ['Autismo Nível 1'], photo_url: 'https://i.pravatar.cc/150?u=joao', emergency_protocol: 'Risco de crise sensorial. Levar para a sala de acalmia.', active: true, created_date: new Date().toISOString() },
    { id: '2', name: 'Maria Oliveira', grade: '2º Ano B', diagnoses: ['TDAH'], photo_url: 'https://i.pravatar.cc/150?u=maria', active: true, created_date: new Date().toISOString() },
  ];
  
  let behavioralStates = [
      { id: '101', name: 'Agitado', severity_level: 'medio', icon: 'Wind', description: 'Movimentação excessiva, dificuldade em permanecer sentado.', requires_immediate_action: false, active: true },
      { id: '102', name: 'Choro Intenso', severity_level: 'alto', icon: 'Frown', description: 'Choro alto e contínuo, difícil de consolar.', requires_immediate_action: true, active: true },
      { id: '103', name: 'Foco e Calma', severity_level: 'baixo', icon: 'Smile', description: 'Engajado na atividade, tranquilo.', requires_immediate_action: false, active: true },
      { id: '104', name: 'Crítico', severity_level: 'critico', icon: 'AlertTriangle', description: 'Comportamento de risco para si ou para outros.', requires_immediate_action: true, active: true },
  ];
  
  let interventions = [
    { id: '201', name: 'Abraço de Urso', type: 'sensorial', short_description: 'Aplicar pressão profunda e firme nos ombros e costas.', materials_needed: ['Nenhum'], estimated_duration: 5, active: true },
    { id: '202', name: 'Respiração Guiada', type: 'cognitiva', short_description: 'Conduzir a criança a respirar fundo contando até 4.', materials_needed: ['Nenhum'], estimated_duration: 3, active: true },
    { id: '203', name: 'Protocolo de Emergência V1', type: 'emergencia', short_description: 'Acionar a coordenação imediatamente e seguir o protocolo do aluno.', materials_needed: ['Rádio comunicador'], estimated_duration: 15, active: true },
  ];
  
  let interventionRecords = [];
  let users = [{ email: 'auxiliar@escola.com' }];
  
  // --- FUNÇÕES GENÉRICAS DE MANIPULAÇÃO DE DADOS ---
  
  const mockApi = (data) => ({
    list: async (sort) => [...data],
    filter: async (filters) => {
      return data.filter(item => 
        Object.keys(filters).every(key => item[key] === filters[key])
      );
    },
    create: async (newItem) => {
      const item = { ...newItem, id: Date.now().toString(), created_date: new Date().toISOString() };
      data.push(item);
      return item;
    },
    update: async (id, updates) => {
      const index = data.findIndex(item => item.id === id);
      if (index === -1) return null;
      data[index] = { ...data[index], ...updates };
      return data[index];
    },
    delete: async (id) => {
      const index = data.findIndex(item => item.id === id);
      if (index > -1) {
        data.splice(index, 1);
      }
      return true;
    },
  });
  
  // --- EXPORTAÇÃO DAS "ENTIDADES" ---
  
  export const Student = mockApi(students);
  export const BehavioralState = mockApi(behavioralStates);
  export const Intervention = mockApi(interventions);
  export const InterventionRecord = mockApi(interventionRecords);
  
  // Mock para a entidade User, que é um pouco diferente
  export const User = {
      me: async () => users[0]
  };