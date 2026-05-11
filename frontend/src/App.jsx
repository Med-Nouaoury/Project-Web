import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <a
            href="#main-content"
            className="visually-hidden-focusable"
            style={{ position: 'absolute', top: 8, left: 8, zIndex: 9999, padding: '.5rem 1rem', background: 'var(--terracotta)', color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}
          >
            Aller au contenu principal
          </a>

          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/catalogue" element={<Layout><CataloguePage /></Layout>} />
            <Route path="/livre/:id" element={<Layout><ProductPage /></Layout>} />
            <Route path="/panier" element={<Layout><CartPage /></Layout>} />
            <Route path="/login" element={<Layout><LoginPage /></Layout>} />
            <Route path="/register" element={<Layout><RegisterPage /></Layout>} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={
              <Layout>
                <div className="container py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '6rem', fontWeight: 900, color: 'var(--border)', lineHeight: 1 }}>404</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--espresso)', marginTop: '1rem' }}>Page introuvable</h2>
                  <p style={{ color: 'var(--muted)' }}>La page que vous cherchez n'existe pas.</p>
                  <a href="/" className="btn btn-terra mt-3"><i className="bi bi-arrow-left me-2"></i>Retour à l'accueil</a>
                </div>
              </Layout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
