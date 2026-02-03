import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AnalyzePage from './pages/AnalyzePage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';
import SignUpPage from './pages/SignUpPage'; // Import SignUpPage

function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="signup" element={<SignUpPage />} /> {/* New Route */}
                    <Route path="analyze" element={<AnalyzePage />} />
                    <Route path="results" element={<ResultsPage />} />
                    <Route path="about" element={<AboutPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
