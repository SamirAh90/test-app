import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

/* -------------------------------- */
/* Public pages                     */
/* -------------------------------- */

import Home from "./pages/Home";
import Trainer from "./pages/Trainer";
import DemoTrainer from "./pages/DemoTrainer";
import Results from "./pages/Results";
import Register from "./pages/Register";
import Login from "./pages/Login";
import EmailLinkLogin from "./pages/EmailLinkLogin";
import MyTraining from "./pages/MyTraining";
import SubjectTrainer from "./pages/SubjectTrainer";
import SubjectEducation from "./pages/SubjectEducation";
import SubjectGlossary from "./pages/SubjectGlossary";
import Glossary from "./pages/Glossary";
import StudyMaterial from "./pages/StudyMaterial";
import AboutTest from "./pages/AboutTest";
import PublicGuide from "./pages/PublicGuide";
import Premium from "./pages/Premium";
import Account from "./pages/Account";

/* -------------------------------- */
/* Authenticated training pages     */
/* -------------------------------- */

import FreeTraining from "./pages/FreeTraining";
import PremiumTraining from "./pages/PremiumTraining";
import SmartTraining from "./pages/SmartTraining";
import Simulator from "./pages/Simulator";

/* -------------------------------- */
/* Route protection                 */
/* -------------------------------- */

import AppHeader from "./components/AppHeader/AppHeader";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PremiumRoute from "./components/PremiumRoute/PremiumRoute";

/* -------------------------------- */
/* Admin application                */
/* -------------------------------- */

import { AdminAuthProvider } from "./admin/contexts/AdminAuthContext";

import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";
import AdminLayout from "./admin/layouts/AdminLayout";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminSubjects from "./admin/pages/AdminSubjects";
import AdminStudyMaterial from "./admin/pages/AdminStudyMaterial";
import AdminGlossary from "./admin/pages/AdminGlossary";
import AdminQuestions from "./admin/pages/AdminQuestions";
import AdminSources from "./admin/pages/AdminSources";
import AdminTranslations from "./admin/pages/AdminTranslations";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminAnalytics from "./admin/pages/AdminAnalytics";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminPayments from "./admin/pages/AdminPayments";

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          {/* -------------------------------- */}
          {/* Public application               */}
          {/* -------------------------------- */}

          <Route path="/" element={<Home />} />

          <Route path="/trainer" element={<Trainer />} />

          <Route path="/trainer/demo" element={<DemoTrainer />} />

          <Route
            path="/trainer/subject/:subjectId"
            element={<SubjectTrainer />}
          />

          <Route path="/results" element={<Results />} />

          <Route path="/register" element={<Register />} />

          <Route path="/login" element={<Login />} />
          <Route path="/login/email" element={<EmailLinkLogin />} />

          <Route path="/om-provet" element={<AboutTest />} />
          <Route path="/studietips" element={<PublicGuide page="tips" />} />
          <Route path="/provdatum" element={<PublicGuide page="dates" />} />
          <Route path="/vanliga-fragor" element={<PublicGuide page="faq" />} />
          <Route path="/medborgarskap" element={<PublicGuide page="citizenship" />} />
          <Route path="/medborgarskap/krav" element={<PublicGuide page="requirements" />} />
          <Route path="/medborgarskap/ansokan" element={<PublicGuide page="application" />} />

          <Route path="/premium" element={<Premium />} />

          {/* -------------------------------- */}
          {/* Study material                   */}
          {/* -------------------------------- */}

          <Route path="/studiematerial" element={<StudyMaterial />} />

          <Route path="/amnen/:subjectSlug" element={<SubjectEducation />} />

          <Route
            path="/amnen/:subjectSlug/begrepp"
            element={<SubjectGlossary />}
          />

          <Route path="/begrepp" element={<Glossary />} />

          {/* -------------------------------- */}
          {/* Min träning dashboard            */}
          {/* -------------------------------- */}

          <Route
            path="/min-traning"
            element={
              <ProtectedRoute>
                <>
                  <AppHeader />
                  <MyTraining />
                </>
              </ProtectedRoute>
            }
          />

          {/* -------------------------------- */}
          {/* Logged-in Demo                   */}
          {/* -------------------------------- */}

          <Route
            path="/min-traning/demo"
            element={
              <ProtectedRoute>
                <DemoTrainer />
              </ProtectedRoute>
            }
          />

          {/* -------------------------------- */}
          {/* Free-account training            */}
          {/* -------------------------------- */}

          <Route
            path="/min-traning/free"
            element={
              <ProtectedRoute>
                <FreeTraining />
              </ProtectedRoute>
            }
          />

          {/* -------------------------------- */}
          {/* Premium full question bank       */}
          {/* -------------------------------- */}

          <Route
            path="/min-traning/premium"
            element={
              <PremiumRoute>
                <PremiumTraining />
              </PremiumRoute>
            }
          />

          {/* -------------------------------- */}
          {/* Premium Smart Training           */}
          {/* -------------------------------- */}

          <Route
            path="/min-traning/smart-training"
            element={
              <PremiumRoute>
                <SmartTraining />
              </PremiumRoute>
            }
          />

          {/* -------------------------------- */}
          {/* Premium Simulator                */}
          {/* -------------------------------- */}

          <Route
            path="/min-traning/simulator"
            element={
              <PremiumRoute>
                <Simulator />
              </PremiumRoute>
            }
          />

          {/* -------------------------------- */}
          {/* Account                */}
          {/* -------------------------------- */}

          <Route
            path="/konto"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />

          {/* -------------------------------- */}
          {/* Admin login                      */}
          {/* -------------------------------- */}

          <Route path="/admin/login" element={<AdminLogin />} />

          {/* -------------------------------- */}
          {/* Protected admin application      */}
          {/* -------------------------------- */}

          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />

            <Route path="subjects" element={<AdminSubjects />} />

            <Route path="materials" element={<AdminStudyMaterial />} />

            <Route path="glossary" element={<AdminGlossary />} />

            <Route path="questions" element={<AdminQuestions />} />

            <Route path="sources" element={<AdminSources />} />

            <Route path="translations" element={<AdminTranslations />} />

            <Route path="users" element={<AdminUsers />} />

            <Route path="analytics" element={<AdminAnalytics />} />

            <Route path="settings" element={<AdminSettings />} />

            <Route path="payments" element={<AdminPayments />} />
          </Route>
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
