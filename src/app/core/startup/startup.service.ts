import { Injectable, Injector, Inject } from '@angular/core';
import { AppPreBootstrap } from '@core/abp/AppPreBootstrap';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    private injector: Injector
    ) { }

  private appInitializerFactory(resolve: any, reject: any) {
    let bootstrap = new AppPreBootstrap(this.injector);
    bootstrap.run(resolve, reject);
  }


  load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.appInitializerFactory(resolve, reject);
    });
  }
}
