import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

function Home() {
  return (
    <div className="container py-5">
      <h1>Everyone Needs To Smile</h1>

      <p className="lead">
        Plataforma de peticiones ciudadanas
        con análisis y medición de impacto.
      </p>
    </div>
  )
}

function Login() {
  return <h1>Login</h1>
}

function Registro() {
  return <h1>Registro</h1>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App