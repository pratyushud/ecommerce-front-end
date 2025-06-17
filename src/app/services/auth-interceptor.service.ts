import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const ecommerce_be_url: string = environment.ecommerce_be_url;
  const oktaAuth = inject(OKTA_AUTH) as OktaAuth;
  const securedUrls = [ecommerce_be_url + '/orders'];

  if (securedUrls.some(url => req.urlWithParams.includes(url))) {
    const accessToken = oktaAuth.getAccessToken();
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        console.log('Response:', event);
      }
    })
  );  
};