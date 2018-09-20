import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// layout
import { LayoutDefaultComponent } from '../../layout/default/default.component';

import { TenantsComponent } from './tenants.component'

const routes: Routes = [
    {
        path: '',
        component: LayoutDefaultComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: TenantsComponent, data: { title: '租户管理' } }
        ]
    },

    // { path: 'users', component: UsersComponent, data: { title: '用户管理' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TenantsRoutingModule { }
