import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Relay } from '../models/relay';

@Injectable({
  providedIn: 'root',
})
export class RelayService {
  private baseAddress = 'wss://api1.fprog.nl';
  private webSocketKey = 'fe439a8edfca7dcb6945b19cc5079c87';
  private currentWebSocket: WebSocket = this.newWebSocket;

  get stateSubscribe(): Observable<Array<Relay>> {
    return new Observable((sub) => {
      console.log(
        `New subscription on ${this.baseAddress}/t/${this.webSocketKey}/relays`
      );
      this.currentWebSocket.onmessage = (ev) => {
        sub.next(JSON.parse(ev.data));
      };
    });
  }

  get newWebSocket() {
    const newest = new WebSocket(
      `${this.baseAddress}/t/${this.webSocketKey}/relays`
    );
    console.log(newest);
    newest.onopen = (ev) => {
      newest.send('u');
    };
    this.currentWebSocket = newest;
    return newest;
  }

  changeBaseAddress(newAddress: string) {
    this.baseAddress = newAddress;
    return this.stateSubscribe;
  }

  changeKey(newKey: string) {
    this.webSocketKey = newKey;
    return this.stateSubscribe;
  }

  get currentKey() {
    return this.webSocketKey;
  }

  get currentAddress() {
    return this.baseAddress;
  }

  changeRelay(id: number, state: boolean) {
    if (this.currentWebSocket) {
      this.currentWebSocket.send(
        JSON.stringify({
          id: id,
          state: state,
        })
      );
    }
  }

  constructor() {}
}
