# abp-ng-alain

基于[ng-alain](https://ng-alain.com/)脚手架，增加对[ABP](https://aspnetboilerplate.com/)服务端支持（ABP免费模板）

## 演示地址


[ABP & ng-alain Demo](http://abp-ng-alain.cn-panda.cn) 渣服务器，加载较慢，请轻撸！

登录帐号密码为ABP默认帐号密码 admin/123qwe

## 支持说明

除http通信外，其余全部采用ng-alain脚手架所提供的方案；关于多语言、权限等所有内容均与ng-alain完全相同。

http通信采用的是已封装好针对abp有处理的http类，`src/app/core/abp/abpHttp.ts`

## 支持版本

支持ng-alain最新版`ng-alain@next`

支持ABP免费模板最新版本

**ng-alain已支持到Angular6，使用前请`ng -v`检查你的Angular-cli版本**

## 使用方法

1. 创建基于ng-alain的脚手架；请参考[命令行工具](https://ng-alain.com/cli)了解更多细节。
```bash
ng new demo --style less
cd demo
ng add ng-alain@next --i18n
```
2. 安装新增依赖
```bash
npm install --save moment moment-timezone @types/moment @types/moment-timezone @types/lodash ngx-cookie-service
npm install --save-dev nswag
```
3. 复制补充文件
```bash
获取本项目代码，直接在根目录替换文件
```
4. 启动
```bash
下载ABP免费模板后，启动ABP服务端
ng serve
```

5. 其它
```bash
如果你调用 \nswag\refresh.bat 更新service-proxies.ts文件
请把第9行的 import 'rxjs/add/operator/finally'; 此行删除
```


## 修改说明
### 服务器地址修改
`src/assets/appconfig.json`
### 菜单修改
`src/assets/menu.json` 菜单数据文件

如若你的导航菜单数据是由服务器端返回，那么请修改
`src/app/core/abp/abp-configuration.service.ts`文件中获取菜单数据部分的代码

### service-proxies 更新
执行 `nswag/refresh.bat` 可更新接口访问代码，使用方法同ABP

### 多语言问题

切换到中文语言时仍有英文是因为免费模板提供的中文语言数据不全，只要自行补足即可。

## 增加的内容


|   组件名称  |    说明  |
| ------------- | ------------- |
|	translateFormat	|	新增的pipe，用于处理多语言带参数定义的转义	|

## 使用时的修改建议

+ 由于配置与加载时机不同，免费模板提供的配置都是通过`/AbpUserConfiguration/GetAll`方法获得的，需要对该方法进行重写或另提供其他方法来获取符合ng-alain机制的配置。后台增加对应的方法后修改`abp-configuration.service.ts`文件内容即可

+ 默认多语言切换免费模板是在启动时获得，修改语言会重刷界面，建议增加独立的获取多语言数据接口，后台增加对应方法后修改`AbpTranslateLoader.ts`文件

+ 修改后台User对象，增加Avatar（用户头像），如若不需要可删除页面中显示头像的代码。


## Links

+ [文档](https://ng-alain.com)
+ [@delon](https://github.com/ng-alain/delon)
+ [DEMO](https://ng-alain.github.io/ng-alain/)

# 其它
* 没有用schematics做成angular包，太麻烦，我太懒

## 如果你喜欢这个项目，可以扫码打赏一下给服务器充点带宽 ^Q^

![打赏码](http://abp-ng-alain.cn-panda.cn/good.jpg) 
