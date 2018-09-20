import { PipeTransform, Pipe } from '@angular/core';
import { I18NService } from '../../i18n/i18n.service';

@Pipe({ name: 'translateFormat' })
export class TranslateFormatPipe implements PipeTransform {
    constructor(
        private i18nService: I18NService
    ){}
    transform(value, ...args: any[]): string {
        return this.i18nService.localize(value, args);
    }
}
