import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import GymsList from "./pages/GymsList";
import PublicGyms from "./pages/PublicGyms";
import GymDetails from "./pages/GymDetails";
import PurchasePlan from "./pages/PurchasePlan";
import UserDashboard from "./pages/UserDashboard";
import UserGymVisit from "./pages/UserGymVisit";
import OwnerMyGyms from "./pages/OwnerMyGyms";
import OwnerAddGym from "./pages/OwnerAddGym";
import OwnerEditGym from "./pages/OwnerEditGym";
import GymFacilities from "./pages/GymFacilities";
import OwnerAddFacility from "./pages/OwnerAddFacility";
import OwnerEditFacility from "./pages/OwnerEditFacility";
import GymPlan from "./pages/GymPlan";
import AddGymPlan from "./pages/AddGymPlan";
import EditGymPlan from "./pages/EditGymPlan";





export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Public Gym Routes */}
        <Route path="/gyms" element={<PublicGyms />} />
        <Route path="/gyms/:gymId" element={<GymDetails />} />
        <Route path="/purchase-plan" element={<PurchasePlan />} />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/gym/:gymId/visit"
          element={
            <ProtectedRoute>
              <UserGymVisit />
            </ProtectedRoute>
          }
        />

        {/* Owner Gym Routes */}
        <Route
          path="/owner/gyms"
          element={
            <ProtectedRoute>
              <OwnerMyGyms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/gyms/add"
          element={
            <ProtectedRoute>
              <OwnerAddGym />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/gyms/edit/:gymId"
          element={
            <ProtectedRoute>
              <OwnerEditGym />
            </ProtectedRoute>
          }
        />

        <Route
  path="/owner/gym/:gymId/facilities"
  element={
    <ProtectedRoute>
      <GymFacilities />
    </ProtectedRoute>
  }
/>

<Route
  path="/owner/gym/:gymId/facilities/add"
  element={
    <ProtectedRoute>
      <OwnerAddFacility />
    </ProtectedRoute>
  }
/>

<Route
  path="/owner/facilities/edit/:facilityId"
  element={
    <ProtectedRoute>
      <OwnerEditFacility />
    </ProtectedRoute>
  }
/>
<Route
    path="/owner/gyms/:gymId/plans"
    element={
      <ProtectedRoute>
        <GymPlan />
      </ProtectedRoute>
    }
  />

  <Route
    path="/owner/gyms/:gymId/plans/add"
    element={
      <ProtectedRoute>
        <AddGymPlan />
      </ProtectedRoute>
    }
  />

  <Route
    path="/owner/plans/edit/:planId"
    element={
      <ProtectedRoute>
        <EditGymPlan />
      </ProtectedRoute>
    }
  />

      </Routes>
    </BrowserRouter>
  );
}
