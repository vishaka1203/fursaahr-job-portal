import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Branches from './Pages/branches';
import AppInfo from './Pages/appInfo';
import Invoices from './Pages/invoices';
import AllWorkers from './Pages/allWorkers';
import AllCategories from './Pages/allCategories';
import AllSubCategories from './Pages/allSubCategories';
import Loginform from './Pages/loginForm';
import AdminDashboard from './Pages/Dashboard/adminDashboard';
import UserList from './Pages/Branches/Users/userList';
import Agentinvoice from './Pages/Agent/Agentinvoice';
import ViewInvoice from './Pages/Branches/viewInvoice';

import AgentDashboard from './Pages/Dashboard/agentDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Branches />}></Route>
        <Route path="/users/:branchId" element={<UserList />} />
        <Route path="/invoices/:branchId" element={<ViewInvoice />} />
        <Route path="/login" element={<Loginform />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/agent" element={<AgentDashboard />} />
        <Route path="/invoices" exact element={<Invoices />}></Route>
        <Route path="/allWorkers" exact element={<AllWorkers />}></Route>
        <Route path="/allCategories" exact element={<AllCategories />}></Route>
        <Route
          path="/allSubCategories"
          exact
          element={<AllSubCategories />}
        ></Route>
        <Route path="/appInfo" exact element={<AppInfo />}></Route>
        {/* agent section */}
        <Route path="/agentinvoice" exact element={<Agentinvoice />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
