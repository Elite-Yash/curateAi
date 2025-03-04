import { Route, Routes } from "react-router-dom";
import Section from "../pages/Section";

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

          </Section>
        }
      />
      <Route
        path={"/comment"}
        element={
          <Section>

          </Section>
        }
      />
      <Route
        path={"/post"}
        element={
          <Section>

          </Section>
        }
      />
      <Route
        path={"/join-crm"}
        element={
          <Section>

          </Section>
        }
      />
    </Routes>
  );
};

export default Router;
