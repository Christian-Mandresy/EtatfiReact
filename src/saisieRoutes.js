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
import Comptage from "views/saisie/Comptage.js";
import RakitraList from "views/saisie/RakitraList.js";
import Salaire from "views/saisie/Salaire.js";
import AjoutVoady from "views/saisie/AjoutVoady.js";
import VoadyList from "views/saisie/VoadyList";
import Depense from "views/saisie/Depense";
import DepenseList from "views/saisie/DepenseList";
import PaymentComponent from "views/saisie/PaymentComponent";
import PaymentListComponent from "views/saisie/PaymentListComponent";




const saisieRoutes = [
  {
    path: "/comptage",
    name: "Comptage",
    icon: 'ni ni-bullet-list-67', // Utilisez votre icône personnalisée
    component: Comptage,
    layout: "/saisie",
  },
  {
    path: "/liste-rakitra",
    name: "Liste des Rakitra",
    icon: "ni ni-bullet-list-67", // Utilisez une icône de la bibliothèque
    component: RakitraList,
    layout: "/saisie",
  },
  {
    path: "/liste-voady",
    name: "liste voady",
    icon: "ni ni-settings-gear-65", // Utilisez une icône de la bibliothèque
    component: VoadyList,
    layout: "/saisie",
  },
  {
    path: "/ajout-voady",
    name: "AjoutVoady",
    icon: "ni ni-money-coins", // Utilisez une icône de la bibliothèque
    component: AjoutVoady,
    layout: "/saisie",
  },
  {
    path: "/ajout-depense",
    name: "Depense",
    icon: "ni ni-money-coins", // Utilisez une icône de la bibliothèque
    component: Depense,
    layout: "/saisie",
  },
  {
    path: "/liste-depense",
    name: "liste depense",
    icon: "ni ni-settings-gear-65", // Utilisez une icône de la bibliothèque
    component: DepenseList,
    layout: "/saisie",
  },
  {
    path: "/payement-employer",
    name: "Payement employer",
    icon: "ni ni-settings-gear-65", // Utilisez une icône de la bibliothèque
    component: PaymentComponent,
    layout: "/saisie",
  },
  {
    path: "/list-payement",
    name: "liste des payements",
    icon: "ni ni-settings-gear-65", // Utilisez une icône de la bibliothèque
    component: PaymentListComponent,
    layout: "/saisie",
  },
  

  // ... Ajoutez d'autres fonctionnalités spécifiques au rôle "saisie" ici
];


export default saisieRoutes;
