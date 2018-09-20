import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, catchError } from"rxjs/operators";

import { AccountServiceProxy, RegisterInput, RegisterOutput } from '@core/abp/service-proxies/service-proxies'
import { NotifyService } from '@core/abp/notify/notify.service';
import { I18NService } from '@core/i18n/i18n.service';
// import { LoginService } from '../login/login.service';

@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.less'],
})
export class UserRegisterComponent {

    model: RegisterInput = new RegisterInput();
    saving: boolean = false;

    constructor(
        private accountService: AccountServiceProxy,
        private notifyService: NotifyService,
        private i18nService: I18NService,
        // private loginService: LoginService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ){}

    save(): void {
        this.saving = true;
        this.accountService.register(this.model)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe((result:RegisterOutput) => {
                this.notifyService.success(this.i18nService.localize('SuccessfullyRegistered'));
                
                this.router.navigate(['../register-result', this.model.emailAddress], { relativeTo: this.activatedRoute, skipLocationChange: true });

                // 以下代码为注册成功自动登录，根据需要修改即可
                // Autheticate
                // this.saving = true;
                // this.loginService.authenticateModel.userNameOrEmailAddress = this.model.userName;
                // this.loginService.authenticateModel.password = this.model.password;
                // this.loginService.authenticate(() => { this.saving = false; });
            });
    }

}
