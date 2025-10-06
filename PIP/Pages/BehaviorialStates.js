import React, { useState, useEffect } from "react";
import { BehavioralState } from "@/entities/BehavioralState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const SEVERITY_LEVELS = [
  { value: "baixo", label: "Baixo", color: "bg-green-100 text-green-800" },
  { value: "medio", label: "Médio", color: "bg-yellow-100 text-yellow-800" },
  { value: "alto", label: "Alto", color: "bg-orange-100 text-orange-800" },
  { value: "critico", label: "Crítico", color: "bg-red-100 text-red-800" }
];

export default function BehavioralStates() {
  const [states, setStates] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingState, setEditingState] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    severity_level: "medio",
    description: "",
    requires_immediate_action: false,
    active: true
  });

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    const data = await BehavioralState.list("severity_level");
    setStates(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingState) {
      await BehavioralState.update(editingState.id, formData);
    } else {
      await BehavioralState.create(formData);
    }

    setIsDialogOpen(false);
    resetForm();
    loadStates();
  };

  const handleEdit = (state) => {
    setEditingState(state);
    setFormData({
      name: state.name || "",
      severity_level: state.severity_level || "medio",
      description: state.description || "",
      requires_immediate_action: state.requires_immediate_action || false,
      active: state.active !== false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir este estado comportamental?")) {
      await BehavioralState.delete(id);
      loadStates();
    }
  };

  const resetForm = () => {
    setEditingState(null);
    setFormData({
      name: "",
      severity_level: "medio",
      description: "",
      requires_immediate_action: false,
      active: true
    });
  };

  const getSeverityInfo = (level) => {
    return SEVERITY_LEVELS.find(s => s.value === level) || SEVERITY_LEVELS[1];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Estados Comportamentais
            </h1>
            <p className="text-gray-600 mt-1">Gerencie os estados que podem ser identificados</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Estado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  {editingState ? "Editar Estado" : "Novo Estado Comportamental"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Estado *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Agitado, Choro, Autolesão"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="severity_level">Nível de Severidade *</Label>
                  <Select
                    value={formData.severity_level}
                    onValueChange={(value) => setFormData({ ...formData, severity_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SEVERITY_LEVELS.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o que caracteriza este estado comportamental"
                    className="min-h-24"
                  />
                </div>

                <div className="flex items-center space-x-2 p-4 bg-red-50 rounded-lg">
                  <Checkbox
                    id="requires_immediate_action"
                    checked={formData.requires_immediate_action}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, requires_immediate_action: checked })
                    }
                  />
                  <div>
                    <Label htmlFor="requires_immediate_action" className="text-sm font-medium text-red-900">
                      Requer Ação Imediata / Protocolo de Emergência
                    </Label>
                    <p className="text-xs text-red-700 mt-1">
                      Marque se este estado requer intervenção emergencial imediata
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {editingState ? "Salvar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {states.map((state) => {
            const severityInfo = getSeverityInfo(state.severity_level);
            return (
              <Card key={state.id} className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={severityInfo.color}>
                      {severityInfo.label}
                    </Badge>
                    {state.requires_immediate_action && (
                      <Badge variant="destructive" className="animate-pulse">
                        Emergência
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{state.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {state.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {state.description}
                    </p>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(state)}
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(state.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {states.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum estado cadastrado
            </h3>
            <p className="text-gray-500">
              Comece criando os estados comportamentais
            </p>
          </div>
        )}
      </div>
    </div>
  );
}