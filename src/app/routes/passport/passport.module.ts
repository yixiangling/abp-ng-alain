import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { AbpModule } from '@core/abp/abp.module';

import { PassportRoutingModule } from './passport-routing.module';

// passport pages
import { UserLoginComponent } from './login/login.component';
import { UserRegisterComponent } from './register/register.component';
import { UserRegisterResultComponent } from './register-result/register-result.component';
import { LoginService } from './login/login.service'
// single pages
import { UserLockComponent } from './lock/lock.component';
import { LayoutModule } from '../../layout/layout.module';


const COMPONENTS = [
  // passport pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  // single pages
  UserLockComponent,
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [ SharedModule, AbpModule, LayoutModule, PassportRoutingModule ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT,
  providers: [
    LoginService
  ]
})
export class PassportModule {}
