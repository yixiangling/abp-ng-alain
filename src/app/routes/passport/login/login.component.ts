import { Component } from '@angular/core';
import { SocialService } from '@delon/auth';

import { LoginService } from './login.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    providers: [SocialService],
})
export class UserLoginComponent {
    submitting: boolean = false;

    constructor(
        public loginService: LoginService
    ) { }

    login(): void {
        this.submitting = true;
        this.loginService.authenticate(
            () => this.submitting = false
        );
    }

    get isSelfRegistrationAllowed(): boolean {
        return true;    //TODO: 是否允许注册判断
    }
}
