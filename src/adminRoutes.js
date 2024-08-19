/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import EmployerList from "views/admin/EmployerList";
import PaymentStatusComponent from "views/admin/PaymentStatusComponent";
import RecapTable from "views/admin/RecapTable.js";
import RechercheAv from "views/admin/RechercheAv.js";
import AddEmployer from "views/admin/AddEmployer.js";
import TransactionForm from "views/admin/TransactionForm";


const adminRoutes = [
  {
    path: "/recap",
    name: "Recapitulation",
    icon: "ni ni-chart-bar-32 text-primary",
    component: RecapTable,
    layout: "/admin",
  },
  {
    path: "/search",
    name: "Recherche et Modification",
    icon: "ni ni-chart-bar-32 text-primary",
    component: RechercheAv,
    layout: "/admin",
  },
  {
    path: "/status-payement",
    name: "Etat de Paie",
    icon: "ni ni-chart-bar-32 text-primary",
    component: PaymentStatusComponent,
    layout: "/admin",
  },
  {
    path: "/employers",
    name: "Liste des employer",
    icon: "ni ni-chart-bar-32 text-primary",
    component: EmployerList,
    layout: "/admin",
  },
  {
    path: "/add-employer",
    name: "Ajout employer",
    icon: "ni ni-chart-bar-32 text-primary",
    component: AddEmployer,
    layout: "/admin",
  },
  {
    path: "/add-transaction",
    name: "Ajout transaction",
    icon: "ni ni-chart-bar-32 text-primary",
    component: TransactionForm,
    layout: "/admin",
  },

  
  
  // ... Autres routes
];

export default adminRoutes;
