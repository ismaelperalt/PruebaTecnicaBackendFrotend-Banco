import ClienteList from "./components/ClienteList";

import Layout from "./layout/Layout";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CuentaPage from './page/CuentaPage'
import CuentaList from "./components/CuentaList";
import ReporteView from "./components/ReporteView";
import './App.css'


import MovimientoList from './components/MovimientoList'

function App() {
  

  return (
    <>
    <Router>
    <Layout>
      <Routes>
    <Route path="/clientes" element={<ClienteList />} />
     <Route path="/cuentas/:clienteId" element={<CuentaPage />} />
    <Route path="/cuentas" element={<CuentaList clienteId={0} />} /> {/* 0 para todas las cuentas */}
    <Route path="/movimientos" element={<MovimientoList />} />
<Route path="/reportes" element={<ReporteView />} />
    </Routes>
    </Layout>
    </Router>
     
    </>
  )
}

export default App
