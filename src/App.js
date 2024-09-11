import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Branches from './Pages/branches';
import AppInfo from './Pages/appInfo';
import Invoices from './Pages/invoices';
import AllWorkers from './Pages/allWorkers';
import AllRequests from './Pages/allRequests';
import AllCategories from './Pages/allCategories';
import AllSubCategories from './Pages/allSubCategories';
import Loginform from './Pages/loginForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Branches />}></Route>
        <Route path="/login" element={<Loginform />} />
        <Route path="/invoices" exact element={<Invoices />}></Route>
        <Route path="/allWorkers" exact element={<AllWorkers />}></Route>
        <Route path="/allRequests" exact element={<AllRequests />}></Route>
        <Route path="/allCategories" exact element={<AllCategories />}></Route>
        <Route
          path="/allSubCategories"
          exact
          element={<AllSubCategories />}
        ></Route>
        <Route path="/appInfo" exact element={<AppInfo />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
