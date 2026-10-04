import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreatePetition from './pages/CreatePetition'
import PetitionDetail from './pages/PetitionDetail'
import AdminPetitions from './pages/AdminPetitions'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          <Route
            path="/peticiones/:id"
            element={<PetitionDetail />}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/peticiones/nueva"
              element={<CreatePetition />}
            />
          </Route>

          <Route
            path="/admin/peticiones"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminPetitions />
              </RoleRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App