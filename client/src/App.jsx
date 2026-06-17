import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute, RoleRoute, GuestRoute } from "./components/layout/RouteGuards.jsx";
import GoogleAuthSuccess from "./pages/shared/GoogleAuthSuccess.jsx";

// ── Public Pages ──
import LandingPage       from "./pages/public/LandingPage.jsx";
import ExploreMentors    from "./pages/public/ExploreMentors.jsx";
import MentorProfile from "./pages/mentee/MentorProfile.jsx";
import LoginPage         from "./pages/public/LoginPage.jsx";
import RegisterPage      from "./pages/public/RegisterPage.jsx";

// ── Mentee Pages ──
import MenteeDashboard   from "./pages/mentee/Dashboard.jsx";
import Onboarding        from "./pages/mentee/Onboarding.jsx";
import CareerQuiz        from "./pages/mentee/CareerQuiz.jsx";
import MenteeExploreMentors from "./pages/mentee/ExploreMentors.jsx";
import BookSession       from "./pages/mentee/BookSession.jsx";
import SessionRoom       from "./pages/mentee/SessionRoom.jsx";
import LeaveReview       from "./pages/mentee/LeaveReview.jsx";
import MySessions        from "./pages/mentee/MySessions.jsx";
import Messages          from "./pages/mentee/Messages.jsx";
import SavedMentors      from "./pages/mentee/SavedMentors.jsx";
import Roadmaps          from "./pages/mentee/Roadmaps.jsx";
import Subscription      from "./pages/mentee/Subscription.jsx";
import MenteeNotifications from "./pages/mentee/Notifications.jsx";
import MenteeSettings    from "./pages/mentee/Settings.jsx";

// ── Mentor Pages ──
import ApplyMentor       from "./pages/mentor/ApplyMentor.jsx";
import ApplicationStatus from "./pages/mentor/ApplicationStatus.jsx";
import MentorDashboard   from "./pages/mentor/Dashboard.jsx";
import Availability      from "./pages/mentor/Availability.jsx";
import MentorSessions    from "./pages/mentor/MySessions.jsx";
import MentorSessionRoom from "./pages/mentor/SessionRoom.jsx";
import RoadmapBuilder    from "./pages/mentor/RoadmapBuilder.jsx";
import MentorMessages    from "./pages/mentor/Messages.jsx";
import Earnings          from "./pages/mentor/Earnings.jsx";
import EditMentorProfile from "./pages/mentor/EditProfile.jsx";
import SessionPricing    from "./pages/mentor/SessionPricing.jsx";
import MentorNotifications from "./pages/mentor/Notifications.jsx";

// ── Admin Pages ──
import AdminDashboard    from "./pages/admin/Dashboard.jsx";
import Applications      from "./pages/admin/Applications.jsx";
import UserManagement    from "./pages/admin/UserManagement.jsx";
import SessionsOverview  from "./pages/admin/SessionsOverview.jsx";
import Revenue           from "./pages/admin/Revenue.jsx";
import ContentModeration from "./pages/admin/ContentModeration.jsx";
import Analytics         from "./pages/admin/Analytics.jsx";
import PlatformSettings  from "./pages/admin/PlatformSettings.jsx";

// ── Shared Pages ──
import NotFound          from "./pages/shared/NotFound.jsx";
import TermsPage         from "./pages/shared/Terms.jsx";
import PrivacyPage       from "./pages/shared/Privacy.jsx";
import VerifyEmail       from "./pages/shared/VerifyEmail.jsx";
import ForgotPassword    from "./pages/shared/ForgotPassword.jsx";
import ResetPassword     from "./pages/shared/ResetPassword.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── PUBLIC ── */}
        <Route path="/"           element={<LandingPage />} />
        <Route path="/mentors"    element={<ExploreMentors />} />
        <Route path="/mentors/:id" element={<MentorProfile />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

        {/* ── SHARED AUTH ── */}
        <Route path="/verify-email"     element={<VerifyEmail />} />
        <Route path="/forgot-password"  element={<ForgotPassword />} />
        <Route path="/reset-password"   element={<ResetPassword />} />
        <Route path="/terms"            element={<TermsPage />} />
        <Route path="/privacy"           element={<PrivacyPage />} />

        {/* ── MENTEE ── */}
        <Route path="/dashboard"        element={<PrivateRoute><MenteeDashboard /></PrivateRoute>} />
        <Route path="/onboarding"       element={<PrivateRoute><Onboarding /></PrivateRoute>} />
        <Route path="/career-quiz"      element={<PrivateRoute><CareerQuiz /></PrivateRoute>} />
        <Route path="/explore"          element={<PrivateRoute><MenteeExploreMentors /></PrivateRoute>} />
        <Route path="/book/:mentorId"   element={<PrivateRoute><BookSession /></PrivateRoute>} />
        <Route path="/session/:id/room" element={<PrivateRoute><SessionRoom /></PrivateRoute>} />
        <Route path="/session/:id/review" element={<PrivateRoute><LeaveReview /></PrivateRoute>} />
        <Route path="/my-sessions"      element={<PrivateRoute><MySessions /></PrivateRoute>} />
        <Route path="/messages"         element={<PrivateRoute><Messages /></PrivateRoute>} />
        <Route path="/messages/:userId" element={<PrivateRoute><Messages /></PrivateRoute>} />
        <Route path="/saved-mentors"    element={<PrivateRoute><SavedMentors /></PrivateRoute>} />
        <Route path="/roadmaps"         element={<PrivateRoute><Roadmaps /></PrivateRoute>} />
        <Route path="/subscription"     element={<PrivateRoute><Subscription /></PrivateRoute>} />
        <Route path="/notifications"    element={<PrivateRoute><MenteeNotifications /></PrivateRoute>} />
        <Route path="/settings"         element={<PrivateRoute><MenteeSettings /></PrivateRoute>} />

        {/* ── MENTOR ── */}
        <Route path="/mentor/apply"         element={<PrivateRoute><ApplyMentor /></PrivateRoute>} />
        <Route path="/mentor/status"        element={<PrivateRoute><ApplicationStatus /></PrivateRoute>} />
        <Route path="/mentor/dashboard"     element={<RoleRoute roles={["mentor"]}><MentorDashboard /></RoleRoute>} />
        <Route path="/mentor/availability"  element={<RoleRoute roles={["mentor"]}><Availability /></RoleRoute>} />
        <Route path="/mentor/sessions"      element={<RoleRoute roles={["mentor"]}><MentorSessions /></RoleRoute>} />
        <Route path="/mentor/session/:id/room" element={<RoleRoute roles={["mentor"]}><MentorSessionRoom /></RoleRoute>} />
        <Route path="/mentor/roadmaps"      element={<RoleRoute roles={["mentor"]}><RoadmapBuilder /></RoleRoute>} />
        <Route path="/mentor/messages"      element={<RoleRoute roles={["mentor"]}><MentorMessages /></RoleRoute>} />
        <Route path="/mentor/earnings"      element={<RoleRoute roles={["mentor"]}><Earnings /></RoleRoute>} />
        <Route path="/mentor/profile/edit"  element={<RoleRoute roles={["mentor"]}><EditMentorProfile /></RoleRoute>} />
        <Route path="/mentor/pricing"       element={<RoleRoute roles={["mentor"]}><SessionPricing /></RoleRoute>} />
        <Route path="/mentor/notifications" element={<RoleRoute roles={["mentor"]}><MentorNotifications /></RoleRoute>} />

        {/* ── ADMIN ── */}
        <Route path="/admin"                element={<RoleRoute roles={["admin"]}><AdminDashboard /></RoleRoute>} />
        <Route path="/admin/applications"   element={<RoleRoute roles={["admin"]}><Applications /></RoleRoute>} />
        <Route path="/admin/users"          element={<RoleRoute roles={["admin"]}><UserManagement /></RoleRoute>} />
        <Route path="/admin/sessions"       element={<RoleRoute roles={["admin"]}><SessionsOverview /></RoleRoute>} />
        <Route path="/admin/revenue"        element={<RoleRoute roles={["admin"]}><Revenue /></RoleRoute>} />
        <Route path="/admin/moderation"     element={<RoleRoute roles={["admin"]}><ContentModeration /></RoleRoute>} />
        <Route path="/admin/analytics"      element={<RoleRoute roles={["admin"]}><Analytics /></RoleRoute>} />
        <Route path="/admin/settings"       element={<RoleRoute roles={["admin"]}><PlatformSettings /></RoleRoute>} />

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
   
    // <footer style={{ backgroundColor: "#f3f4f6", padding: "20px", textAlign: "center" }}>
    //   <p style={{ color: "#6b7280", fontSize: "14px" }}>
    //     &copy; 2023 MentorPath. All rights reserved.
    //   </p>
    // </footer>
  );
}
