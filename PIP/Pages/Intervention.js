import React, { useState, useEffect } from "react";
import { Intervention } from "@/entities/Intervention";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const INTERVENTION_TYPES = [
  { value: "sensorial", label: "Sensorial", color: "bg-blue-100 text-blue-800" },
  { value: "cognitiva", label: "Cognitiva", color: "bg-purple-100 text-purple-800" },
  { value: "social", label: "Social", color: "bg-green-100 text-green-800" },
  { value: "emergencia", label: "Emergência", color: "bg-red-100 text-red-800" }
];

export default function Interventions() {
  const [interventions, setInterventions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIntervention, setEditingIntervention] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "sensorial",
    short_description: "",
    detailed_instructions: "",
    estimated_duration: "",
    materials_needed: [],
    active: true
  });
  const [materialInput, setMaterialInput] = useState("");

  useEffect(() => {
    loadInterventions();
  }, []);

  const loadInterventions = async () => {
    const data = await Intervention.list("-created_date");
    setInterventions(data);
  };

  const addMaterial = () => {
    if (materialInput.trim() && !formData.materials_needed.includes(materialInput.trim())) {
      setFormData({
        ...formData,
        materials_needed: [...formData.materials_needed, materialInput.trim()]
      });
      setMaterialInput("");
    }
  };

  const removeMaterial = (material) => {
    setFormData({
      ...formData,
      materials_needed: formData.materials_needed.filter(m => m !== material)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSave = {
      ...formData,
      estimated_duration: formData.estimated_duration ? parseInt(formData.estimated_duration) : undefined
    };

    if (editingIntervention) {
      await Intervention.update(editingIntervention.id, dataToSave);
    } else {
      await Intervention.create(dataToSave);
    }

    setIsDialogOpen(false);
    resetForm();
    loadInterventions();
  };

  const handleEdit = (intervention) => {
    setEditingIntervention(intervention);
    setFormData({
      name: intervention.name || "",
      type: intervention.type || "sensorial",
      short_description: intervention.short_description || "",
      detailed_instructions: intervention.detailed_instructions || "",
      estimated_duration: intervention.estimated_duration?.toString() || "",
      materials_needed: intervention.materials_needed || [],
      active: intervention.active !== false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir esta intervenção?")) {
      await Intervention.delete(id);
      loadInterventions();
    }
  };

  const resetForm = () => {
    setEditingIntervention(null);
    setFormData({
      name: "",
      type: "sensorial",
      short_description: "",
      detailed_instructions: "",
      estimated_duration: "",
      materials_needed: [],
      active: true
    });
    setMaterialInput("");
  };

  const getTypeInfo = (type) => {
    return INTERVENTION_TYPES.find(t => t.value === type) || INTERVENTION_TYPES[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Biblioteca de Intervenções
            </h1>
            <p className="text-gray-600 mt-1">Gerencie as intervenções disponíveis no sistema</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Intervenção
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingIntervention ? "Editar Intervenção" : "Nova Intervenção"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Intervenção *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Toque Profundo V3.0"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVENTION_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="short_description">Descrição Curta *</Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="Descrição resumida da intervenção (aparecerá na sugestão)"
                    className="min-h-20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="detailed_instructions">Instruções Detalhadas</Label>
                  <Textarea
                    id="detailed_instructions"
                    value={formData.detailed_instructions}
                    onChange={(e) => setFormData({ ...formData, detailed_instructions: e.target.value })}
                    placeholder="Passo a passo detalhado de como aplicar a intervenção"
                    className="min-h-32"
                  />
                </div>

                <div>
                  <Label htmlFor="estimated_duration">Duração Estimada (minutos)</Label>
                  <Input
                    id="estimated_duration"
                    type="number"
                    value={formData.estimated_duration}
                    onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                    placeholder="5"
                  />
                </div>

                <div>
                  <Label>Materiais Necessários</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={materialInput}
                      onChange={(e) => setMaterialInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
                      placeholder="Digite um material"
                    />
                    <Button type="button" onClick={addMaterial} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.materials_needed.map((material, idx) => (
                      <Badge key={idx} variant="secondary">
                        {material}
                        <button
                          type="button"
                          onClick={() => removeMaterial(material)}
                          className="ml-2"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
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
                    {editingIntervention ? "Salvar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Interventions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interventions.map((intervention) => {
            const typeInfo = getTypeInfo(intervention.type);
            return (
              <Card key={intervention.id} className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={typeInfo.color}>
                      {typeInfo.label}
                    </Badge>
                    {intervention.estimated_duration && (
                      <span className="text-sm text-gray-600">
                        ~{intervention.estimated_duration} min
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg">{intervention.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {intervention.short_description}
                  </p>
                  
                  {intervention.materials_needed && intervention.materials_needed.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Materiais:</p>
                      <div className="flex flex-wrap gap-1">
                        {intervention.materials_needed.slice(0, 3).map((material, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {material}
                          </Badge>
                        ))}
                        {intervention.materials_needed.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{intervention.materials_needed.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(intervention)}
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(intervention.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {interventions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma intervenção cadastrada
            </h3>
            <p className="text-gray-500">
              Comece criando a primeira intervenção
            </p>
          </div>
        )}
      </div>
    </div>
  );
}