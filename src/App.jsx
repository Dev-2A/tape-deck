import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import CollectionPage from "./pages/CollectionPage";
import PlayerPage from "./pages/PlayerPage";
import CreatePage from "./pages/CreatePage";
import EditPage from "./pages/EditPage";
import { ROUTES } from "./constants/routes";

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path={ROUTES.COLLECTION} element={<CollectionPage />} />
          <Route path={ROUTES.CREATE} element={<CreatePage />} />
          <Route path={ROUTES.PLAY} element={<PlayerPage />} />
          <Route path={ROUTES.EDIT} element={<EditPage />} />
          <Route path="*" element={<CollectionPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
