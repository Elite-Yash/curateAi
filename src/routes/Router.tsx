import { Route, Routes } from "react-router-dom";
import Section from "../pages/Section";
import Home from "../components/Home/Home";
import SaveProfile from "../components/SaveProfile/SaveProfile";
import Comments from "../components/Comments/Comments";
import SingUp from "../components/SingUp/SingUp";
import SignIn from "../components/SignIn/SignIn";
import ForgotPassword from "../components/ForgotPassword/ForgotPassword";
import ChangePassword from "../components/ChangePassword/ChangePassword";
import { useEffect, useState } from "react";
import UserProfile from "../components/UserProfile/UserProfile";
import PricingPage from "../components/PricingPage/PricingPage";


/**
 * Router component that defines the application's routing structure.
 *
 * This component uses React Router's `<Routes>` and `<Route>` to define different routes
 * for the application. Each route renders a specific page component within a `Dashboard` layout.
 *
 * @returns {JSX.Element} The routes configuration for the application.
 */
const Router = () => {

  const [login, setLogin] = useState<string | null>(null);
  useEffect(() => {
    const checkToken = () => {
      chrome.runtime.sendMessage({ type: "getCookies" }, (response) => {
        if (response && response.success) {
          setLogin(response.token);
        } else {
          setLogin('');
        }
      });
    };
    // Initial check
    checkToken();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Section>
            {login ? <Home /> : <SignIn />}
          </Section>
        }
      />
      <Route
        path="/signup"
        element={
          <Section>
            <SingUp />
          </Section>
        }
      />
      <Route
        path="/signin"
        element={
          <Section>
            <SignIn />
          </Section>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <Section>
            <ForgotPassword />
          </Section>
        }
      />
      <Route
        path="/change-password"
        element={
          <Section>
            <ChangePassword />
          </Section>
        }
      />
      <Route
        path="/comments"
        element={
          <Section>
            <Comments />
          </Section>
        }
      />
      <Route
        path="/save-profile"
        element={
          <Section>
            <SaveProfile />
          </Section>
        }
      />
      <Route
        path="/home"
        element={
          <Section>
            <Home />
          </Section>
        }
      />
      <Route
        path="/setting"
        element={
          <Section>
            <UserProfile />
          </Section>
        }
      />
      <Route
        path="/pricing"
        element={
          <Section>
            <PricingPage />
          </Section>
        }
      />
    </Routes>
  );
};

export default Router;
