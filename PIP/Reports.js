import React, { useState, useEffect } from "react";
import { Student } from "@/entities/Student";
import { InterventionRecord } from "@/entities/InterventionRecord";
import { Intervention } from "@/entities/Intervention";
import { BehavioralState } from "@/entities/BehavioralState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [records, setRecords] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [states, setStates] = useState([]);
  const [stats, setStats] = useState({
    totalRecords: 0,
    successRate: 0,
    avgDuration: 0,
    trend: "stable"
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      loadStudentData();
    }
  }, [selectedStudent]);

  const loadInitialData = async () => {
    const studentsData = await Student.filter({ active: true });
    const interventionsData = await Intervention.list();
    const statesData = await BehavioralState.list();
    
    setStudents(studentsData);
    setInterventions(interventionsData);
    setStates(statesData);
    
    if (studentsData.length > 0) {
      setSelectedStudent(studentsData[0].id);
    }
  };

  const loadStudentData = async () => {
    const recordsData = await InterventionRecord.filter(
      { student_id: selectedStudent },
      "-created_date"
    );
    
    setRecords(recordsData);
    calculateStats(recordsData);
  };

  const calculateStats = (recordsData) => {
    const total = recordsData.length;
    const successful = recordsData.filter(r => r.was_successful).length;
    const successRate = total > 0 ? (successful / total * 100).toFixed(1) : 0;
    
    const durations = recordsData
      .filter(r => r.crisis_duration_minutes)
      .map(r => r.crisis_duration_minutes);
    const avgDuration = durations.length > 0 
      ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1)
      : 0;

    setStats({
      totalRecords: total,
      successRate,
      avgDuration,
      trend: successRate > 70 ? "up" : successRate < 50 ? "down" : "stable"
    });
  };

  const getInterventionEffectiveness = () => {
    const interventionStats = {};
    
    records.forEach(record => {
      const intId = record.applied_intervention_id;
      if (!interventionStats[intId]) {
        interventionStats[intId] = { total: 0, successful: 0 };
      }
      interventionStats[intId].total++;
      if (record.was_successful) {
        interventionStats[intId].successful++;
      }
    });

    return Object.keys(interventionStats).map(intId => {
      const intervention = interventions.find(i => i.id === intId);
      const stats = interventionStats[intId];
      return {
        name: intervention?.name || "Desconhecida",
        successRate: ((stats.successful / stats.total) * 100).toFixed(1),
        total: stats.total
      };
    }).sort((a, b) => b.successRate - a.successRate).slice(0, 5);
  };

  const getStateDistribution = () => {
    const stateCounts = {};
    
    records.forEach(record => {
      const stateId = record.behavioral_state_id;
      stateCounts[stateId] = (stateCounts[stateId] || 0) + 1;
    });

    return Object.keys(stateCounts).map(stateId => {
      const state = states.find(s => s.id === stateId);
      return {
        name: state?.name || "Desconhecido",
        value: stateCounts[stateId]
      };
    });
  };

  const getWeeklyTrend = () => {
    const weeklyData = {};
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      weeklyData[dateStr] = { total: 0, successful: 0 };
    }

    records.forEach(record => {
      const date = new Date(record.created_date);
      const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (weeklyData[dateStr]) {
        weeklyData[dateStr].total++;
        if (record.was_successful) {
          weeklyData[dateStr].successful++;
        }
      }
    });

    return Object.keys(weeklyData).map(date => ({
      date,
      intervenções: weeklyData[date].total,
      sucesso: weeklyData[date].successful
    }));
  };

  const currentStudent = students.find(s => s.id === selectedStudent);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Relatórios e Análises
          </h1>
          <p className="text-gray-600">Acompanhe o progresso e efetividade das intervenções</p>
        </div>

        {/* Student Selector */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Selecione o Aluno
                </label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentStudent && records.length > 0 ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total de Registros</p>
                      <p className="text-3xl font-bold text-purple-600 mt-1">
                        {stats.totalRecords}
                      </p>
                    </div>
                    <Activity className="w-12 h-12 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                      <p className="text-3xl font-bold text-green-600 mt-1">
                        {stats.successRate}%
                      </p>
                    </div>
                    {stats.trend === "up" && <TrendingUp className="w-12 h-12 text-green-400" />}
                    {stats.trend === "down" && <TrendingDown className="w-12 h-12 text-red-400" />}
                    {stats.trend === "stable" && <Minus className="w-12 h-12 text-yellow-400" />}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <div>
                    <p className="text-sm text-gray-600">Duração Média</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">
                      {stats.avgDuration} min
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <div>
                    <p className="text-sm text-gray-600">Esta Semana</p>
                    <p className="text-3xl font-bold text-orange-600 mt-1">
                      {records.filter(r => {
                        const date = new Date(r.created_date);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return date >= weekAgo;
                      }).length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle>Tendência Semanal</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getWeeklyTrend()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="intervenções" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="sucesso" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle>Distribuição de Estados</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getStateDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getStateDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Interventions */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle>Intervenções Mais Efetivas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getInterventionEffectiveness()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="successRate" fill="#8b5cf6" name="Taxa de Sucesso (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-12 text-center">
              <Activity className="w-16 h-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Nenhum dado disponível
              </h3>
              <p className="text-gray-500">
                {currentStudent 
                  ? "Ainda não há registros de intervenção para este aluno."
                  : "Selecione um aluno para visualizar os relatórios."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}