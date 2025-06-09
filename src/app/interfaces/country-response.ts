import { Country } from "../common/country";

export interface CountryResponse {
  _embedded: {
    countries: Country[];
  }
}