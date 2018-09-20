export class AppConsts {

    static remoteServiceBaseUrl: string;
    static appBaseUrl: string;

    static app = {
        name: "Abp & Alain",
        description: "Abp & Ng-zorro admin panel front-end framework"
    };

    static readonly userManagement = {
        defaultAdminUserName: 'admin'
    };

    static readonly localization = {
        defaultLocalizationSourceName: 'TestTemplate'
    };

    static readonly authorization = {
        encrptedAuthTokenName: 'enc_auth_token'
    };
}