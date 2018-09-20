import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { AbpModule } from '@core/abp/abp.module';

import { LayoutModule } from '../../layout/layout.module';

import { RolesRoutingModule } from './roles-routing.module';

import { RolesComponent } from './roles.component'
import { CreateRoleComponent } from './create-role/create-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';

const COMPONENTS = [
    RolesComponent
];
const COMPONENTS_NOROUNT = [
    CreateRoleComponent,
    EditRoleComponent
];

@NgModule({
  imports: [ SharedModule, AbpModule, LayoutModule, RolesRoutingModule ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT,
  providers: [
    
  ]
})
export class RolesModule {}
