//import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import UploadButton from "./pages/UploadButton";
import NoPage from "./pages/NoPage";
import Tabla from './pages/Tabla';
import React from "react"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<UploadButton />} />
          <Route path="Tabla" element={<Tabla />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}