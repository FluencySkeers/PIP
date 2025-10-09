import React, { useState, useEffect } from "react";
import { Student } from "@/entities/Student";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, TrendingUp, Users, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import StudentCard from "../components/home/StudentCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const data = await Student.filter({ active: true }, "-created_date");
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    }
    setIsLoading(false);
  };

  const handleStudentClick = (student) => {
    navigate(createPageUrl("StudentIntervention") + `?studentId=${student.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">Sistema PIP

            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Plataforma de Intervenção Imediata Personalizada
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Selecione um aluno para iniciar o registro rápido de intervenção
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alunos Ativos</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{students.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Intervenções Hoje</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">0</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                <p className="text-3xl font-bold text-green-600 mt-1">--</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar aluno por nome ou turma..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-purple-200 focus:border-purple-400" />

          </div>
          <Link to={createPageUrl("Students")}>
            <Button className="h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Aluno
            </Button>
          </Link>
        </div>

        {/* Students Grid */}
        {isLoading ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) =>
          <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-20 h-20 rounded-2xl" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
          )}
          </div> :
        filteredStudents.length === 0 ?
        <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ?
            "Tente buscar por outro nome ou turma" :
            "Comece adicionando alunos ao sistema"}
            </p>
            {!searchTerm &&
          <Link to={createPageUrl("Students")}>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Aluno
                </Button>
              </Link>
          }
          </div> :

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) =>
          <StudentCard
            key={student.id}
            student={student}
            onClick={() => handleStudentClick(student)} />

          )}
          </div>
        }
      </div>
    </div>);

}
import { Student } from "@/entities/Student"; // ALTERE ISTO
import { Student } from "@/entities"; // PARA ISTO

import React, { useState, useEffect } from "react";
import { Student, InterventionRecord } from "@/entities"; // Importação atualizada
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, TrendingUp, Users, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import StudentCard from "../components/home/StudentCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // NOVO ESTADO: para guardar as estatísticas do dashboard
  const [stats, setStats] = useState({
    interventionsToday: 0,
    successRate: 0,
  });

  useEffect(() => {
    // Agora carregamos tanto os alunos como as estatísticas
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.grade?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  // FUNÇÃO ATUALIZADA: agora carrega todos os dados necessários para a página inicial
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Carrega os alunos e os registos de intervenção em paralelo
      const [studentData, recordsData] = await Promise.all([
        Student.filter({ active: true }, "-created_date"),
        InterventionRecord.list()
      ]);

      setStudents(studentData);
      setFilteredStudents(studentData);
      
      // *** LÓGICA PARA CALCULAR AS ESTATÍSTICAS ***
      const today = new Date().toISOString().slice(0, 10);
      const interventionsToday = recordsData.filter(r => r.created_date.slice(0, 10) === today).length;
      
      const successfulRecords = recordsData.filter(r => r.was_successful).length;
      const successRate = recordsData.length > 0 ? ((successfulRecords / recordsData.length) * 100).toFixed(0) : 0;

      setStats({ interventionsToday, successRate });

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
    setIsLoading(false);
  };

  const handleStudentClick = (student) => {
    navigate(createPageUrl("StudentIntervention") + `?studentId=${student.id}`);
  };

  // O resto do ficheiro (return JSX) é modificado para usar o novo estado 'stats'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          {/* ... (sem alterações aqui) ... */}
        </div>

        {/* Stats Cards - AGORA DINÂMICOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alunos Ativos</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{students.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Intervenções Hoje</p>
                {/* DADO ATUALIZADO */}
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.interventionsToday}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Sucesso (Geral)</p>
                 {/* DADO ATUALIZADO */}
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.successRate}%</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        {/* ... (sem alterações aqui) ... */}

        {/* Students Grid */}
        {/* ... (sem alterações aqui) ... */}
      </div>
    </div>);
}
