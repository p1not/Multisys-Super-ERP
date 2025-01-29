import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GridcardViewerComponent } from './components/gridcard-viewer/gridcard-viewer.component';
import { ErrorPage } from './pages/error/error.page';
import { FormViewerComponent } from './components/form-viewer/form-viewer.component';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/login/login.page';

const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'configurations/administrators/menus', component: GridcardViewerComponent },
  { path: 'configurations/users/perfis', component: GridcardViewerComponent },  
  { path: 'configurations/users/operators', component: GridcardViewerComponent }, 
  { path: 'configurations/users/operatortypes', component: GridcardViewerComponent },
  { path: 'configurations/entities/entitytypes', component: GridcardViewerComponent }, 
  { path: 'configurations/entities/entities', component: GridcardViewerComponent },
  { path: 'configurations/entities/entitygroups', component: GridcardViewerComponent },
  { path: 'configurations/permissions/permissions', component: GridcardViewerComponent },
  { path: 'configurations/permissions/permissionsgroups', component: GridcardViewerComponent },
  { path: 'configurations/permissions/permissionsbyperfil', component: GridcardViewerComponent },
  { path: 'configurations/customers/customers', component: GridcardViewerComponent },
  { path: 'configurations/customers/customerstypes', component: GridcardViewerComponent },
  { path: 'configurations/customers/customersgroups', component: GridcardViewerComponent },
  { path: 'configurations/financial/banks', component: GridcardViewerComponent },
  { path: 'configurations/financial/bankbranches', component: GridcardViewerComponent },
  { path: 'configurations/financial/bankaccounts', component: GridcardViewerComponent },
  { path: 'configurations/financial/currencies', component: GridcardViewerComponent },
  { path: 'configurations/financial/blockchains', component: GridcardViewerComponent },
  { path: 'configurations/financial/blockchainaccounts', component: GridcardViewerComponent },
  { path: 'configurations/logistics/deliverytypes', component: GridcardViewerComponent },
  { path: 'configurations/logistics/ordertypes', component: GridcardViewerComponent },
  { path: 'configurations/logistics/materials/materials', component: GridcardViewerComponent },
  { path: 'configurations/logistics/materials/materialtypes', component: GridcardViewerComponent },
  { path: 'configurations/logistics/materials/materialgroups', component: GridcardViewerComponent },
  { path: 'configurations/logistics/materials/serials', component: GridcardViewerComponent },
  { path: 'configurations/logistics/services/services', component: GridcardViewerComponent },
  { path: 'configurations/logistics/services/servicestype', component: GridcardViewerComponent },
  { path: 'configurations/logistics/services/servicesgroups', component: GridcardViewerComponent },
  { path: 'configurations/logistics/services/ticketstypes', component: GridcardViewerComponent },
  { path: 'configurations/logistics/services/ticketsgroups', component: GridcardViewerComponent },
  { path: 'configurations/logistics/vehicles/vehicles', component: GridcardViewerComponent },
  { path: 'configurations/logistics/vehicles/vehiclestypes', component: GridcardViewerComponent },
  { path: 'configurations/logistics/vehicles/routes', component: GridcardViewerComponent },
  { path: 'configurations/general/countries', component: GridcardViewerComponent },
  { path: 'configurations/general/countryregions', component: GridcardViewerComponent },
  { path: 'configurations/general/states', component: GridcardViewerComponent },
  { path: 'configurations/general/cities', component: GridcardViewerComponent },
  { path: 'configurations/general/neighborhoods', component: GridcardViewerComponent },
  { path: 'configurations/general/measurementsunits', component: GridcardViewerComponent },
  { path: 'configurations/general/marks', component: GridcardViewerComponent },
  { path: 'configurations/general/marktypes', component: GridcardViewerComponent },
  { path: 'configurations/general/models', component: GridcardViewerComponent },
  { path: 'configurations/general/modeltypes', component: GridcardViewerComponent },
  { path: 'teams/teams', component: GridcardViewerComponent },
  { path: 'teams/myteams', component: GridcardViewerComponent },

  // { path: 'configurations/administrators/menus/:id', component: FormViewerComponent },
  { path: 'form-viewer', component: FormViewerComponent, data: { } },
  { path: 'error', component: ErrorPage },    
  { path: 'login', component: LoginPage },
  // {
  //   path: 'login',
  //   loadChildren: () => import('./pages/login/login.page').then(m => m.LoginPage) // lazy loading
  // },

  // {
  //   path: 'login',
  //   loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  // },  
  { path: '**', component: HomePage }
//deixar sempre por último, caso não encontre nenhuma rota válida
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
