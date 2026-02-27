import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './frontend/context/AuthContext';
import ProtectedRoute from './frontend/components/ProtectedRoute';
import Navbar from './frontend/components/Navbar';
import Login from './frontend/pages/Login';
import Dashboard from './frontend/pages/Dashboard';
import Analytics from './frontend/pages/Analytics';
import BoothList from './frontend/pages/BoothList';
import BoothForm from './frontend/pages/BoothForm';
import AgentList from './frontend/pages/AgentList';
import AgentForm from './frontend/pages/AgentForm';
import FamilyList from './frontend/pages/FamilyList';
import FamilyForm from './frontend/pages/FamilyForm';
import IssueList from './frontend/pages/IssueList';
import IssueForm from './frontend/pages/IssueForm';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <main>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/booths" element={<BoothList />} />
                      <Route path="/booths/new" element={<BoothForm />} />
                      <Route path="/booths/:id/edit" element={<BoothForm />} />
                      <Route path="/agents" element={<AgentList />} />
                      <Route path="/agents/new" element={<AgentForm />} />
                      <Route path="/agents/:id/edit" element={<AgentForm />} />
                      <Route path="/families" element={<FamilyList />} />
                      <Route path="/families/new" element={<FamilyForm />} />
                      <Route path="/families/:id/edit" element={<FamilyForm />} />
                      <Route path="/issues" element={<IssueList />} />
                      <Route path="/issues/new" element={<IssueForm />} />
                      <Route path="/issues/:id/edit" element={<IssueForm />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;