import { Route, Routes } from "react-router-dom";
import Section from "../pages/Section";
import Home from "../components/Home/Home";
import SaveProfile from "../components/SaveProfile/SaveProfile";
import Comments from "../components/Comments/Comments";

/**
 * Router component that defines the application's routing structure.
 *
 * This component uses React Router's `<Routes>` and `<Route>` to define different routes
 * for the application. Each route renders a specific page component within a `Dashboard` layout.
 *
 * @returns {JSX.Element} The routes configuration for the application.
 */
const Router = () => {
  return (
    <Routes>
      <Route
        path={"/"}
        element={
          <Section>
            <Home />
          </Section>
        }
      />
      <Route
        path={"/comments"}
        element={
          <Section>
            <Comments />
          </Section>
        }
      />
      <Route
        path={"/save-profile"}
        element={
          <Section>
            <SaveProfile />
          </Section>
        }
      />
    </Routes>
  );
};

export default Router;
