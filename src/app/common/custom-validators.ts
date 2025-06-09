import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
  static noWhitespace(control: FormControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'onlyWhitespace': true };
  }
}