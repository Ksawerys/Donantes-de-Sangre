import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform, SecurityContext } from '@angular/core';

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) {}


  transform(url: string) {
    const sanitizedUrl = this.domSanitizer.sanitize(SecurityContext.URL, url);

    if (sanitizedUrl) return this.domSanitizer.bypassSecurityTrustResourceUrl(sanitizedUrl);
    else return this.domSanitizer.bypassSecurityTrustResourceUrl('');
  }
}


