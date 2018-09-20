# abp-ng-alain

基于[ng-alain](https://ng-alain.com/)脚手架，增加对[ABP](https://aspnetboilerplate.com/)服务端支持（ABP免费模板）

## 支持说明

除http通信外，其余全部采用ng-alain脚手架所提供的方案；关于多语言、权限等所有内容均与ng-alain完全相同。

## 支持版本

支持ng-alain最新版`ng-alain@next`

支持ABP免费模板最新版本

## 快速入门

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

## Links

+ [文档](https://ng-alain.com)
+ [@delon](https://github.com/ng-alain/delon)
+ [DEMO](https://ng-alain.github.io/ng-alain/)

# 其它
* 没有用schematics做成angular包，太麻烦，我太懒