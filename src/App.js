import * as React from "react";
import { Routes, Route } from "react-router-dom";

import HomeLayout from './layout/HomeLayout';

import Profile from './pages/Profile';

import './App.css';

export default function App() {
  return (
    <div>
      {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
      <Routes>
            <Route path="/" element={<HomeLayout />}>
                <Route index element={<Profile />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<Profile />} />
            </Route>
      </Routes>
    </div>
  );
}