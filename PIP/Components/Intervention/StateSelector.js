
import React from "react";
import { motion } from "framer-motion";
import { createReactComponent } from "lucide-react";
import * as allIcons from "lucide-react/dist/esm/icons";

export default function StateSelector({ states, onSelectState }) {
  const getIcon = (iconName) => {
    const defaultIcon = allIcons['alert-circle'];
    // Lucide icons in 'allIcons' are typically kebab-case (e.g., 'alert-circle')
    // Convert PascalCase (e.g., 'AlertCircle') to kebab-case
    const formattedIconName = iconName?.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const iconNode = allIcons[formattedIconName] || defaultIcon;
    return createReactComponent(iconName, iconNode);
  };

  const getSeverityBg = (severity) => {
    const colors = {
      baixo: "from-green-400 to-emerald-500",
      medio: "from-yellow-400 to-orange-500",
      alto: "from-orange-500 to-red-500",
      critico: "from-red-600 to-pink-600"
    };
    return colors[severity] || colors.medio;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
      {states.map((state, index) => {
        const Icon = getIcon(state.icon);
        return (
          <motion.button
            key={state.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectState(state)}
            className={`relative p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${getSeverityBg(state.severity_level)} overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors" />
            <div className="relative flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-white/90 rounded-2xl flex items-center justify-center shadow-md">
                <Icon className="w-8 h-8 text-gray-800" />
              </div>
              <span className="font-bold text-white text-center text-lg drop-shadow-lg">
                {state.name}
              </span>
              {state.requires_immediate_action && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
