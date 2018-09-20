import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { AbpModule } from '@core/abp/abp.module';

import { LayoutModule } from '../../layout/layout.module';

import { TenantsRoutingModule } from './tenants-routing.module';

import { TenantsComponent } from './tenants.component'
import { CreateTenantComponent } from './create-tenant/create-tenant.component';
import { EditTenantComponent } from './edit-tenant/edit-tenant.component';


const COMPONENTS = [
    TenantsComponent
];
const COMPONENTS_NOROUNT = [
    CreateTenantComponent,
    EditTenantComponent
];

@NgModule({
  imports: [ SharedModule, AbpModule, LayoutModule, TenantsRoutingModule ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT,
  providers: [
    
  ]
})
export class TenantsModule {}
