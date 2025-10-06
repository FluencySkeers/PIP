import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentCard({ student, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-300 bg-white/90 backdrop-blur-sm overflow-hidden"
        onClick={onClick}
      >
        <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-600" />
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {student.photo_url ? (
                <img 
                  src={student.photo_url} 
                  alt={student.name}
                  className="w-20 h-20 rounded-2xl object-cover shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-md">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              {student.emergency_protocol && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-gray-900 truncate">{student.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{student.grade || 'Série não informada'}</p>
              
              {student.diagnoses && student.diagnoses.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {student.diagnoses.slice(0, 2).map((diagnosis, idx) => (
                    <Badge 
                      key={idx} 
                      variant="secondary"
                      className="text-xs bg-purple-100 text-purple-700"
                    >
                      {diagnosis}
                    </Badge>
                  ))}
                  {student.diagnoses.length > 2 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                      +{student.diagnoses.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}