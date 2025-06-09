import { Injectable } from '@angular/core';
import { RefCode } from '../common/ref-code';
import { map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country } from '../common/country';
import { CountryResponse } from '../interfaces/country-response';
import { StateResponse } from '../interfaces/state-response';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  url: string = 'http://localhost:8080/api';
  months: RefCode[] = [
    { description: 'Jan', code: 1 },
    { description: 'Feb', code: 2 },
    { description: 'Mar', code: 3 },
    { description: 'Apr', code: 4 },
    { description: 'May', code: 5 },
    { description: 'Jun', code: 6 },
    { description: 'Jul', code: 7 },
    { description: 'Aug', code: 8 },
    { description: 'Sep', code: 9 },
    { description: 'Oct', code: 10 },
    { description: 'Nov', code: 11 },
    { description: 'Dec', code: 12 },
  ];
  constructor(private http: HttpClient) { }

  getMonths(): Observable<RefCode[]> {
    return of(this.months);
  }

  getYears(): Observable<RefCode[]> {
    const currentYear = new Date().getFullYear();
    const years: RefCode[] = [];
    for (let i = 0; i < 10; i++) {
      years.push({
        code: currentYear + i,
        description: (currentYear + i).toString()
      });
    }
    return of(years);
  }

  getCountryCodes(): Observable<Country[]> {
    return this.http.get<CountryResponse>(`${this.url}/countries`).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStateCodes(countryCode: string): Observable<State[]> {
    return this.http.get<StateResponse>(`${this.url}/states/search/findByCountryCode?code=${countryCode}`).pipe(
      map(response => response._embedded.states)
    );
  }
}


