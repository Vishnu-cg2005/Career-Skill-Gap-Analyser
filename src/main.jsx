import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext';
import './i18n';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Suspense fallback={<div>Loading...</div>}>
            <LanguageProvider>
                <App />
            </LanguageProvider>
        </Suspense>
    </React.StrictMode>,
)
