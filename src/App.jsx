import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom' // Importing React Router components for client-side navigation
import Navbar from './Components/Navbar'
import Cart from './Components/Cart'
import Home from './Pages/Home'
import Products from './Pages/Products'
import Profile from './Pages/Profile'
import Feedback from './Pages/Feedback'
import Routine from './Pages/Routine'
import Login from './Components/auth/login'
import ProtectedRoute from './Components/auth/ProtectedRoute'
import { useAuth } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { RoutineProvider } from './contexts/RoutineContext'
import ProductPairing from './Components/ProductPairing'
import DatabaseAdmin from './Pages/DatabaseAdmin'

function App() {
  return (
    <Router> {/* to provide routing context to entire app */}
      <CartProvider>
        <RoutineProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar appears on all pages */}
            <Navbar />
            <Cart />
            <main className="flex-1 w-full overflow-x-hidden"> {/* main is the main content area - flex-1 makes it fill remaining space */}
              <Routes> {/* Routes defines all possible URL paths in the app */}
                {/* Public routes - accessible to everyone */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/pairing" element={<ProductPairing />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/routine" element={<Routine />} />
            
            {/* Protected routes - require authentication */}
            {/* ProtectedRoute wrapper checks if user is logged in */}
            <Route 
              path="/products" 
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <DatabaseAdmin />
                </ProtectedRoute>
              } 
            />
            {/* Catch-all route - redirects any unknown URL to home page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
        </RoutineProvider>
      </CartProvider>
    </Router>
  )
}

export default App