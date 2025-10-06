import React, { useState, useEffect } from "react";
import { Student } from "@/entities/Student";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, User as UserIcon, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UploadFile } from "@/integrations/Core";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    photo_url: "",
    diagnoses: [],
    emergency_protocol: "",
    age: "",
    grade: "",
    special_notes: "",
    active: true
  });
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const data = await Student.list("-created_date");
    setStudents(data);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData({ ...formData, photo_url: file_url });
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
    }
    setUploadingPhoto(false);
  };

  const addDiagnosis = () => {
    if (diagnosisInput.trim() && !formData.diagnoses.includes(diagnosisInput.trim())) {
      setFormData({
        ...formData,
        diagnoses: [...formData.diagnoses, diagnosisInput.trim()]
      });
      setDiagnosisInput("");
    }
  };

  const removeDiagnosis = (diagnosis) => {
    setFormData({
      ...formData,
      diagnoses: formData.diagnoses.filter(d => d !== diagnosis)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSave = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined
    };

    if (editingStudent) {
      await Student.update(editingStudent.id, dataToSave);
    } else {
      await Student.create(dataToSave);
    }

    setIsDialogOpen(false);
    resetForm();
    loadStudents();
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || "",
      photo_url: student.photo_url || "",
      diagnoses: student.diagnoses || [],
      emergency_protocol: student.emergency_protocol || "",
      age: student.age?.toString() || "",
      grade: student.grade || "",
      special_notes: student.special_notes || "",
      active: student.active !== false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
      await Student.delete(id);
      loadStudents();
    }
  };

  const resetForm = () => {
    setEditingStudent(null);
    setFormData({
      name: "",
      photo_url: "",
      diagnoses: [],
      emergency_protocol: "",
      age: "",
      grade: "",
      special_notes: "",
      active: true
    });
    setDiagnosisInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Gerenciar Alunos
            </h1>
            <p className="text-gray-600 mt-1">Cadastre e gerencie os alunos do sistema</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Aluno
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingStudent ? "Editar Aluno" : "Adicionar Novo Aluno"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Foto do Aluno</Label>
                    <div className="flex items-center gap-4 mt-2">
                      {formData.photo_url ? (
                        <img 
                          src={formData.photo_url} 
                          alt="Preview"
                          className="w-24 h-24 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                          <UserIcon className="w-12 h-12 text-purple-600" />
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label htmlFor="photo-upload">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={uploadingPhoto}
                            onClick={() => document.getElementById('photo-upload').click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingPhoto ? "Enviando..." : "Escolher Foto"}
                          </Button>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Idade</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="grade">Série/Turma</Label>
                    <Input
                      id="grade"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      placeholder="Ex: 3º Ano A"
                    />
                  </div>

                  <div>
                    <Label>Diagnósticos</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={diagnosisInput}
                        onChange={(e) => setDiagnosisInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDiagnosis())}
                        placeholder="Digite um diagnóstico"
                      />
                      <Button type="button" onClick={addDiagnosis} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.diagnoses.map((diagnosis, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-700">
                          {diagnosis}
                          <button
                            type="button"
                            onClick={() => removeDiagnosis(diagnosis)}
                            className="ml-2 text-purple-900 hover:text-purple-700"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="emergency_protocol">Protocolo de Emergência</Label>
                    <Textarea
                      id="emergency_protocol"
                      value={formData.emergency_protocol}
                      onChange={(e) => setFormData({ ...formData, emergency_protocol: e.target.value })}
                      placeholder="Ex: Risco de crise epiléptica - acionar coordenação imediatamente"
                      className="min-h-20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="special_notes">Observações Especiais</Label>
                    <Textarea
                      id="special_notes"
                      value={formData.special_notes}
                      onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })}
                      placeholder="Outras informações relevantes sobre o aluno"
                      className="min-h-20"
                    />
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
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {editingStudent ? "Salvar Alterações" : "Adicionar Aluno"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Students List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card key={student.id} className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {student.photo_url ? (
                      <img 
                        src={student.photo_url} 
                        alt={student.name}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center">
                        <UserIcon className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      {student.grade && (
                        <p className="text-sm text-gray-600">{student.grade}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {student.diagnoses && student.diagnoses.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {student.diagnoses.map((diagnosis, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                        {diagnosis}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(student)}
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(student.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {students.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum aluno cadastrado
            </h3>
            <p className="text-gray-500">
              Comece adicionando o primeiro aluno ao sistema
            </p>
          </div>
        )}
      </div>
    </div>
  );
}