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
import FacilityPlans from "./pages/FacilityPlans";
import PurchaseFacilityPlan from "./pages/PurchaseFacilityPlan";
import OwnerFacilityPlans from "./pages/OwnerFacilityPlans";
import AddFacilityPlan from "./pages/AddFacilityPlan";
import OwnerMyGyms from "./pages/OwnerMyGyms";
import OwnerAddGym from "./pages/OwnerAddGym";
import OwnerEditGym from "./pages/OwnerEditGym";
import GymFacilities from "./pages/GymFacilities";
import OwnerAddFacility from "./pages/OwnerAddFacility";
import OwnerEditFacility from "./pages/OwnerEditFacility";
import GymPlan from "./pages/GymPlan";
import AddGymPlan from "./pages/AddGymPlan";
import EditGymPlan from "./pages/EditGymPlan";
import OwnerGymUsers from "./pages/OwnerGymUsers";
import OwnerUserStats from "./pages/OwnerUserStats";
import PlanUsers from "./pages/PlanUsers";
import Wallet from "./pages/Wallet";
import DigitalCard from "./pages/DigitalCard";
import MembershipSwitch from "./pages/MembershipSwitch";
import OwnerEarnings from "./pages/OwnerEarnings";
import GymMap from "./pages/GymMap";
import SessionHistory from "./pages/SessionHistory";

import UnsubscribeRequests from "./pages/UnsubscribeRequests";
import UserCancellationRequests from "./pages/UserCancellationRequests";

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
            <ProtectedRoute allowedRoles={["OWNER", "USER"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Public Gym Routes */}
        <Route path="/gyms" element={<PublicGyms />} />
        <Route path="/gyms/map" element={<GymMap />} />
        <Route path="/gyms/:gymId" element={<GymDetails />} />
        <Route
          path="/purchase-plan"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <PurchasePlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/gym/:gymId/visit"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserGymVisit />
            </ProtectedRoute>
          }
        />
        <Route path="/gyms/:gymId/facilities/:facilityId/plans" element={<FacilityPlans />} />
        <Route
          path="/purchase-facility-plan"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <PurchaseFacilityPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/cancellation-requests"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserCancellationRequests />
            </ProtectedRoute>
          }
        />
        
        {/* Wallet and Digital Card Routes */}
        <Route
          path="/wallet"
          element={
            <ProtectedRoute allowedRoles={["OWNER", "USER"]}>
              <Wallet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/digital-card"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <DigitalCard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/membership/switch"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <MembershipSwitch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/sessions"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <SessionHistory />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/owner/facilities/:facilityId/plans"
          element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerFacilityPlans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/facilities/:facilityId/plans/add"
          element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <AddFacilityPlan />
            </ProtectedRoute>
          }
        />

        {/* Owner Gym Routes */}
        <Route
          path="/owner/gyms"
          element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerMyGyms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/gyms/add"
          element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerAddGym />
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/gyms/edit/:gymId"
          element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerEditGym />
            </ProtectedRoute>
          }
        />
        
        {/* Owner Earnings Route */}
        <Route
          path="/owner/earnings"
          element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerEarnings />
            </ProtectedRoute>
          }
        />
        
        {/* Owner Unsubscribe Requests Route */}
        <Route
          path="/owner/unsubscribe-requests"
          element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <UnsubscribeRequests />
            </ProtectedRoute>
          }
        />

<Route
  path="/owner/gym/:gymId/facilities"
  element={
    <ProtectedRoute allowedRoles={["OWNER"]}>
      <GymFacilities />
    </ProtectedRoute>
  }
/>

<Route
  path="/owner/gym/:gymId/facilities/add"
  element={
    <ProtectedRoute allowedRoles={["OWNER"]}>
      <OwnerAddFacility />
    </ProtectedRoute>
  }
/>

<Route
  path="/owner/facilities/edit/:facilityId"
  element={
    <ProtectedRoute allowedRoles={["OWNER"]}>
      <OwnerEditFacility />
    </ProtectedRoute>
  }
/>
<Route
    path="/owner/gyms/:gymId/plans"
    element={
      <ProtectedRoute allowedRoles={["OWNER"]}>
        <GymPlan />
      </ProtectedRoute>
    }
  />

  <Route
    path="/owner/gyms/:gymId/plans/add"
    element={
      <ProtectedRoute allowedRoles={["OWNER"]}>
        <AddGymPlan />
      </ProtectedRoute>
    }
  />

  <Route
    path="/owner/plans/edit/:planId"
    element={
      <ProtectedRoute allowedRoles={["OWNER"]}>
        <EditGymPlan />
      </ProtectedRoute>
    }
  />

  {/* Owner User Management Routes */}
  <Route
    path="/owner/gyms/:gymId/users"
    element={
      <ProtectedRoute allowedRoles={["OWNER"]}>
        <OwnerGymUsers />
      </ProtectedRoute>
    }
  />

  <Route
    path="/owner/gyms/:gymId/users/:userId/stats"
    element={
      <ProtectedRoute allowedRoles={["OWNER"]}>
        <OwnerUserStats />
      </ProtectedRoute>
    }
  />

  <Route
    path="/owner/facilities/:facilityId/plans/:planId/users"
    element={
      <ProtectedRoute allowedRoles={["OWNER"]}>
        <PlanUsers />
      </ProtectedRoute>
    }
  />

      </Routes>
    </BrowserRouter>
  );
}
