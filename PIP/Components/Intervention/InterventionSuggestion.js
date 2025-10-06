import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Timer, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function InterventionSuggestion({ 
  intervention, 
  student,
  isEmergency,
  onConfirm,
  onCancel 
}) {
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    setShowFeedback(true);
  };

  const handleFeedback = (wasSuccessful) => {
    const durationMinutes = Math.ceil(timerSeconds / 60);
    onConfirm(wasSuccessful, durationMinutes, notes);
  };

  const getTypeColor = (type) => {
    const colors = {
      sensorial: "bg-blue-100 text-blue-800 border-blue-300",
      cognitiva: "bg-purple-100 text-purple-800 border-purple-300",
      social: "bg-green-100 text-green-800 border-green-300",
      emergencia: "bg-red-100 text-red-800 border-red-300"
    };
    return colors[type] || colors.sensorial;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="border-2 shadow-2xl bg-white">
        {isEmergency && (
          <div className="h-3 bg-gradient-to-r from-red-600 to-pink-600 animate-pulse" />
        )}
        
        <CardHeader className={`${isEmergency ? 'bg-red-50' : 'bg-gradient-to-r from-purple-50 to-pink-50'} border-b`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                {isEmergency && <AlertTriangle className="w-6 h-6 text-red-600" />}
                {intervention.name}
              </CardTitle>
              <Badge className={`mt-2 ${getTypeColor(intervention.type)} border`}>
                {intervention.type.toUpperCase()}
              </Badge>
            </div>
            {!showFeedback && (
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 font-mono">
                  {formatTime(timerSeconds)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Tempo decorrido</p>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {isEmergency && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h4 className="font-bold text-red-900 mb-1">⚠️ PROTOCOLO DE EMERGÊNCIA</h4>
                  <p className="text-sm text-red-700">
                    Este aluno possui protocolo especial de emergência. Siga as instruções com atenção.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Instruções
            </h4>
            <p className="text-lg text-gray-700 leading-relaxed bg-purple-50 p-4 rounded-xl">
              {intervention.short_description}
            </p>
          </div>

          {intervention.detailed_instructions && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Passos Detalhados</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                {intervention.detailed_instructions}
              </p>
            </div>
          )}

          {intervention.materials_needed && intervention.materials_needed.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Materiais Necessários</h4>
              <div className="flex flex-wrap gap-2">
                {intervention.materials_needed.map((material, idx) => (
                  <Badge key={idx} variant="outline" className="bg-white">
                    {material}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {showFeedback && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicione observações sobre o que aconteceu..."
                  className="min-h-24"
                />
              </div>
              
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-3 text-center">
                  A intervenção funcionou?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleFeedback(true)}
                    className="h-16 text-lg bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-6 h-6 mr-2" />
                    Sim, funcionou!
                  </Button>
                  <Button
                    onClick={() => handleFeedback(false)}
                    variant="destructive"
                    className="h-16 text-lg"
                  >
                    <XCircle className="w-6 h-6 mr-2" />
                    Não funcionou
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {!showFeedback && (
          <CardFooter className="bg-gray-50 border-t p-6">
            <div className="w-full space-y-3">
              {!isTimerRunning ? (
                <Button
                  onClick={handleStartTimer}
                  className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Timer className="w-5 h-5 mr-2" />
                  Iniciar Cronômetro
                </Button>
              ) : (
                <Button
                  onClick={handleStopTimer}
                  className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Finalizar e Registrar
                </Button>
              )}
              
              <Button
                onClick={onCancel}
                variant="outline"
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}