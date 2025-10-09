import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/Home";
import Students from "./Pages/Students";
import Interventions from "./Pages/Intervention";
import BehavioralStates from "./Pages/BehaviorialStates";
import StudentIntervention from "./Pages/StudentIntervention";
import Reports from "./Reports";

// Uma função auxiliar para criar URLs, caso você não a tenha em outro lugar
const createPageUrl = (pageName) => `/${pageName.toLowerCase()}`;

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path={createPageUrl("Home")} element={<Home />} />
          <Route path="/" element={<Home />} /> {/* Rota padrão */}
          <Route path={createPageUrl("Students")} element={<Students />} />
          <Route path={createPageUrl("Interventions")} element={<Interventions />} />
          <Route path={createPageUrl("BehavioralStates")} element={<BehavioralStates />} />
          <Route path={createPageUrl("StudentIntervention")} element={<StudentIntervention />} />
          <Route path={createPageUrl("Reports")} element={<Reports />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;