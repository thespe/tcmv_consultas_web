import React from "react";
import { /*BrowserRouter, Route,*/ Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/Tabla">Tabla</Link>
        </li>
      </ul>
    </nav>
  );
}