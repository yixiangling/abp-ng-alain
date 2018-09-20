import { Injectable, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { en_US, zh_CN, NzI18nService } from 'ng-zorro-antd';
import * as df_en from 'date-fns/locale/en';
import * as df_zh_cn from 'date-fns/locale/zh_cn';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService, AlainI18NService } from '@delon/theme';

@Injectable()
export class I18NService implements AlainI18NService {
  private _default = 'zh-Hans';
  private change$ = new BehaviorSubject<string>(null);

  private _langs = [
    { code: 'en', text: 'English' },
    { code: 'zh-Hans', text: '中文' },
  ];

  constructor(
    settings: SettingsService,
    private nzI18nService: NzI18nService,
    private translate: TranslateService,
    private injector: Injector,
  ) {
    const defaultLan = settings.layout.lang || translate.getBrowserLang();
    const lans = this._langs.map(item => item.code);
    this._default = lans.includes(defaultLan) ? defaultLan : lans[0];
    translate.addLangs(lans);
    this.setZorro(this._default).setDateFns(this._default);
  }

  setZorro(lang: string): this {
    this.nzI18nService.setLocale(lang === 'en' ? en_US : zh_CN);
    return this;
  }

  setDateFns(lang: string): this {
    (window as any).__locale__ = lang === 'en' ? df_en : df_zh_cn;
    return this;
  }

  get change(): Observable<string> {
    return this.change$.asObservable().pipe(filter(w => w != null));
  }

  use(lang: string): void {
    lang = lang || this.translate.getDefaultLang();
    if (this.currentLang === lang) return;
    this.setZorro(lang).setDateFns(lang);
    this.translate.use(lang).subscribe(() => this.change$.next(lang));
  }
  /** 获取语言列表 */
  getLangs() {
    return this._langs;
  }
  /** 翻译 */
  fanyi(key: string) {
    return this.translate.instant(key);
  }

  /** 翻译（参数Format） */
  localize(key: string, ...args: any[]) {
    let localizedText = this.translate.instant(key);
    if (!args || !args.length) {
      return localizedText;
    }else{
      return this.formatString(localizedText, args);
    }
  }
  private formatString(text, ...args: any[]) {
    for (var i = 0; i < args.length; i++) {
        var placeHolder = '{' + i + '}';
        text = this.replaceAll(text, placeHolder, args[i]);
    }
    return text;
  }
  private replaceAll (str, search, replacement) {
    var fix = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return str.replace(new RegExp(fix, 'g'), replacement);
  }

  /** 默认语言 */
  get defaultLang() {
    return this._default;
  }
  /** 当前语言 */
  get currentLang() {
    return (
      this.translate.currentLang ||
      this.translate.getDefaultLang() ||
      this._default
    );
  }
}
