import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    templateUrl: './register-result.component.html'
})
export class UserRegisterResultComponent implements OnInit {
    private email: string;

    constructor(
        private route: ActivatedRoute,
        public msg: NzMessageService
    ) {
    }

    ngOnInit(){
        this.route.params.subscribe(params=>{
            this.email = params['email'];
        })
    }
}
