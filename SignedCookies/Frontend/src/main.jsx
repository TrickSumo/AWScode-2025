import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Auth from './Auth.jsx'
import { AuthProvider } from "react-oidc-context";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_...Y",
  client_id: "....",
  redirect_uri: "http://localhost:5173/auth",//"https://....cloudfront.net/auth",
  response_type: "code",
  scope: "phone openid email",
};


createRoot(document.getElementById('root')).render(
  <AuthProvider {...cognitoAuthConfig}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  </AuthProvider>

)
