import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Relay } from '../models/relay';

@Injectable({
  providedIn: 'root',
})
export class RelayService {
  private baseAddress: string;
  private webSocketKey: string;
  private currentWebSocket: WebSocket;
  private LOCALSTORAGE_ADDRESS = 'address';
  private LOCALSTORAGE_KEY = 'key';

  constructor() {
    const storedAddress = localStorage.getItem(this.LOCALSTORAGE_ADDRESS);
    if (storedAddress) this.baseAddress = storedAddress;
    else this.baseAddress = 'wss://api1.fprog.nl';

    const storedKey = localStorage.getItem(this.LOCALSTORAGE_KEY);
    if (storedKey) this.webSocketKey = storedKey;
    else this.webSocketKey = 'fe439a8edfca7dcb6945b19cc5079c87';

    this.currentWebSocket = this.newWebSocket();
  }

  get stateSubscribe(): Observable<Array<Relay>> {
    return new Observable((sub) => {
      console.log(
        `New subscription on ${this.baseAddress}/t/${this.webSocketKey}/relays`,
      );
      this.currentWebSocket.onmessage = (ev) => {
        // Ignore if we're getting 'e'
        if (ev.data == 'e') return;
        console.log('Event data', ev.data);
        sub.next(JSON.parse(ev.data));
      };
    });
  }

  newWebSocket() {
    const newest = new WebSocket(
      `${this.baseAddress}/t/${this.webSocketKey}/relays`,
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
    this.newWebSocket();
    return this.stateSubscribe;
  }

  changeKey(newKey: string) {
    this.webSocketKey = newKey;
    this.newWebSocket();
    return this.stateSubscribe;
  }

  changeRelay(id: number, state: boolean) {
    if (this.currentWebSocket) {
      this.currentWebSocket.send(
        JSON.stringify({
          id: id,
          state: state,
        }),
      );
    }
  }

  saveNewConfiguration(address: string, key: string) {
    localStorage.setItem(this.LOCALSTORAGE_ADDRESS, address);
    localStorage.setItem(this.LOCALSTORAGE_KEY, key);
  }

  get currentKey() {
    return this.webSocketKey;
  }

  get currentAddress() {
    return this.baseAddress;
  }
}
