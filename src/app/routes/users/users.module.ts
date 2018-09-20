import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { AbpModule } from '@core/abp/abp.module';

import { LayoutModule } from '../../layout/layout.module';

import { UsersRoutingModule } from './users-routing.module';

import { UsersComponent } from './users.component'
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';


const COMPONENTS = [
    UsersComponent
];
const COMPONENTS_NOROUNT = [
    CreateUserComponent,
    EditUserComponent
];

@NgModule({
  imports: [ SharedModule, AbpModule, LayoutModule, UsersRoutingModule ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT,
  providers: [
    
  ]
})
export class UsersModule {}
