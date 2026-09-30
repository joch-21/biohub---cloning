import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css';


import MainLayout from './MainLayout'

import Login from './Login'
import Dashboard from './Dashboard'
import Personnel from './Personnel'
import ViewPersonnel from './ViewPersonnel'
import CreateRecord from './CreateRecord';
import BioRecords from './BioRecords';
import ViewRecords from './ViewRecords';
import QRGenerator from './QRGenerator';
import Map from './map';
import Iot from './iot';
import Reports from './Reports';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard/>} />

          <Route path="/personnel" element={<Personnel/>} />
          <Route path="/personnel/view" element={<ViewPersonnel/>} />

          {/* added by jc */}
          <Route path="/records/create" element={<CreateRecord />} />
          <Route path="/CreateRecord" element={<CreateRecord />} />
          <Route path="/BioRecords" element={<BioRecords />} />
          <Route path="/records" element={<BioRecords />} />
          <Route path="/records/view/:id" element={<ViewRecords />} />
          <Route path="/ViewRecords/:id" element={<ViewRecords />} />
          <Route path="/ViewRecords" element={<ViewRecords />} />


          <Route path="/QRGenerator" element={<QRGenerator />} />
          <Route path="/Map" element={<Map/>} />
          <Route path="/Iot" element={<Iot/>} />
          
          <Route path="/Reports" element={<Reports/>} /> 
        </Route >

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
