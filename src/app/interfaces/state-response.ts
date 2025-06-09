import { State } from "../common/state";

export interface StateResponse {
  _embedded: {
    states: State[];
  }
}