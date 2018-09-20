import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';

import { ACLGuard } from '@delon/acl';
import { SessionRouteGuard } from '@core/abp/auth/auth-route-guard';

// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';

// single pages
import { CallbackComponent } from './callback/callback.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, data: { title: '仪表盘' }, canActivate: [ SessionRouteGuard ] },
    ]
  },
  // passport
  { path: 'passport', loadChildren: './passport/passport.module#PassportModule' },
  { path: 'users', loadChildren: './users/users.module#UsersModule', canLoad: [ ACLGuard ], data: { guard: 'Pages.Users' } },
  { path: 'tenants', loadChildren: './tenants/tenants.module#TenantsModule', canLoad: [ ACLGuard ], data: { guard: 'Pages.Tenants' } },
  { path: 'roles', loadChildren: './roles/roles.module#RolesModule', canLoad: [ ACLGuard ], data: { guard: 'Pages.Roles' } },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: '403', component: Exception403Component },
  { path: '404', component: Exception404Component },
  { path: '500', component: Exception500Component },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
