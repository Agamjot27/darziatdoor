import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import FabricLibrary from "./pages/FabricLibrary";
import TailorProfile from "./pages/TailorProfile";
import OrderTracking from "./pages/OrderTracking";
import ExpressBooking from "./pages/ExpressBooking";
import Services from "./pages/Services";
import TailorShowcase from "./pages/TailorShowcase";
import Pricing from "./pages/Pricing";
import Process from "./pages/Process";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/fabrics" element={<FabricLibrary />} />
          <Route path="/tailors" element={<TailorProfile />} />
          <Route path="/express" element={<ExpressBooking />} />
          <Route 
            path="/track/:id" 
            element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            } 
          />
          <Route path="/services" element={<Services />} />
        <Route path="/tailors" element={<TailorShowcase />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/process" element={<Process />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;