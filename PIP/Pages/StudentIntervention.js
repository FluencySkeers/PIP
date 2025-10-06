import React, { useState, useEffect } from "react";
import { Student } from "@/entities/Student";
import { BehavioralState } from "@/entities/BehavioralState";
import { Intervention } from "@/entities/Intervention";
import { InterventionRecord } from "@/entities/InterventionRecord";
import { User } from "@/entities/User";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User as UserIcon, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StateSelector from "../components/intervention/StateSelector";
import InterventionSuggestion from "../components/intervention/InterventionSuggestion";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentIntervention() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [suggestedIntervention, setSuggestedIntervention] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const studentId = urlParams.get('studentId');
      
      if (!studentId) {
        navigate(createPageUrl("Home"));
        return;
      }

      const [studentData, statesData, user] = await Promise.all([
        Student.filter({ id: studentId }),
        BehavioralState.filter({ active: true }, "severity_level"),
        User.me()
      ]);

      if (studentData.length === 0) {
        navigate(createPageUrl("Home"));
        return;
      }

      setStudent(studentData[0]);
      setStates(statesData);
      setCurrentUser(user);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const handleStateSelection = async (state) => {
    setSelectedState(state);

    if (state.requires_immediate_action || student.emergency_protocol) {
      const emergencyInterventions = await Intervention.filter({ 
        type: "emergencia", 
        active: true 
      });
      
      if (emergencyInterventions.length > 0) {
        setSuggestedIntervention(emergencyInterventions[0]);
        return;
      }
    }

    const records = await InterventionRecord.filter({
      student_id: student.id,
      behavioral_state_id: state.id,
      was_successful: true
    });

    if (records.length > 0) {
      const interventionCounts = {};
      
      for (const record of records) {
        const intId = record.applied_intervention_id;
        if (!interventionCounts[intId]) {
          interventionCounts[intId] = { count: 0, totalDuration: 0 };
        }
        interventionCounts[intId].count++;
        interventionCounts[intId].totalDuration += record.crisis_duration_minutes || 0;
      }

      const bestInterventionId = Object.keys(interventionCounts).reduce((a, b) => 
        interventionCounts[a].count > interventionCounts[b].count ? a : b
      );

      const interventions = await Intervention.filter({ 
        id: bestInterventionId,
        active: true 
      });
      
      if (interventions.length > 0) {
        setSuggestedIntervention(interventions[0]);
        return;
      }
    }

    const stateTypeMap = {
      baixo: "sensorial",
      medio: "cognitiva",
      alto: "social",
      critico: "emergencia"
    };

    const interventionType = stateTypeMap[state.severity_level] || "sensorial";
    const defaultInterventions = await Intervention.filter({ 
      type: interventionType,
      active: true 
    });

    if (defaultInterventions.length > 0) {
      setSuggestedIntervention(defaultInterventions[0]);
    }
  };

  const handleConfirmIntervention = async (wasSuccessful, durationMinutes, notes) => {
    try {
      await InterventionRecord.create({
        student_id: student.id,
        behavioral_state_id: selectedState.id,
        suggested_intervention_id: suggestedIntervention.id,
        applied_intervention_id: suggestedIntervention.id,
        was_successful: wasSuccessful,
        crisis_duration_minutes: durationMinutes,
        notes: notes,
        timestamp: new Date().toISOString(),
        recorded_by: currentUser?.email || "desconhecido"
      });

      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
    }
  };

  const handleCancel = () => {
    if (suggestedIntervention) {
      setSuggestedIntervention(null);
      setSelectedState(null);
    } else {
      navigate(createPageUrl("Home"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-48 mb-6" />
          <Skeleton className="h-32 w-full mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={handleCancel}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        {/* Student Header */}
        {student && !suggestedIntervention && (
          <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-100">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center gap-4">
                {student.photo_url ? (
                  <img 
                    src={student.photo_url} 
                    alt={student.name}
                    className="w-16 h-16 rounded-2xl object-cover shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md">
                    <UserIcon className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{student.grade}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {student.emergency_protocol && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-red-900 mb-1">Protocolo de Emergência</h4>
                      <p className="text-sm text-red-700">{student.emergency_protocol}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {student.diagnoses && student.diagnoses.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Diagnósticos:</p>
                  <div className="flex flex-wrap gap-2">
                    {student.diagnoses.map((diagnosis, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-700">
                        {diagnosis}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {!suggestedIntervention ? (
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-100">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="text-xl">
                Qual o estado comportamental do aluno agora?
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Selecione o estado que melhor descreve o comportamento atual
              </p>
            </CardHeader>
            <StateSelector 
              states={states}
              onSelectState={handleStateSelection}
            />
          </Card>
        ) : (
          <InterventionSuggestion
            intervention={suggestedIntervention}
            student={student}
            isEmergency={selectedState?.requires_immediate_action || !!student.emergency_protocol}
            onConfirm={handleConfirmIntervention}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}