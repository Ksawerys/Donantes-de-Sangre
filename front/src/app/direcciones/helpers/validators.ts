import { DomSanitizer } from "@angular/platform-browser";
import { Injectable, SecurityContext } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class CustomValidators {

  constructor(private domSanitizer: DomSanitizer) { }


  trimFormControl = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value) return value.trim() === '' ? { vacio: true } : null;
    else return null;
  };


  safeUrl = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value) {
      const sanitizedUrl = this.domSanitizer.sanitize(SecurityContext.URL, value);
      return !sanitizedUrl || sanitizedUrl.startsWith('unsafe:') ? { unsafeUrl: true } : null;

    } else return null;
  };
}
