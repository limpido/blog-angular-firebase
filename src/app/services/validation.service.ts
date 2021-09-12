import { Injectable } from '@angular/core';
import {ValidatorFn, Validators} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  urlValidator(): ValidatorFn {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    return Validators.pattern(urlRegex);
  }
}
