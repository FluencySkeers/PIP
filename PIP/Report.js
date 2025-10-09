import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function Reports() {
  const [records, setRecords] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // *** NOVA FUNÇÃO PARA CALCULAR A DISTRIBUIÇÃO DOS TIPOS DE INTERVENÇÃO ***
  const getInterventionTypeDistribution = () => {
    const typeCounts = {};
    
    records.forEach(record => {
      const intervention = interventions.find(i => i.id === record.applied_intervention_id);
      if (intervention) {
        const type = intervention.type || "desconhecido";
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      }
    });

    return Object.keys(typeCounts).map(type => {
      return {
        name: type.charAt(0).toUpperCase() + type.slice(1), // Capitaliza o nome (ex: sensorial -> Sensorial)
        value: typeCounts[type]
      };
    });
  };

  const currentStudent = students.find(s => s.id === selectedStudent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ... (cabeçalho e seletor de aluno - sem alterações) ... */}

        {currentStudent && records.length > 0 ? (
          <>
            {/* ... (Cartões de estatísticas - sem alterações) ... */}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* ... (Gráfico de Tendência Semanal - sem alterações) ... */}
              {/* ... (Gráfico de Distribuição de Estados - sem alterações) ... */}
            </div>

            {/* *** NOVA LINHA DE GRÁFICOS *** */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle>Intervenções Mais Efetivas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    {/* ... (Gráfico de Barras existente) ... */}
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* *** NOVO GRÁFICO ADICIONADO AQUI *** */}
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle>Distribuição por Tipo de Intervenção</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getInterventionTypeDistribution()}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {getInterventionTypeDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          // ... (Mensagem de "Nenhum dado disponível" - sem alterações) ...
        )}
      </div>
    </div>
  );
}