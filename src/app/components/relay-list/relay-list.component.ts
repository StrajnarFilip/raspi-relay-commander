import { Component, OnInit } from '@angular/core';
import { Relay } from 'src/app/models/relay';
import { RelayService } from 'src/app/services/relay.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-relay-list',
  templateUrl: './relay-list.component.html',
  styleUrls: ['./relay-list.component.scss'],
})
export class RelayListComponent implements OnInit {
  relays: Array<Relay> = [];
  currentSubscription?: Subscription;

  baseAddress = this.relayService.currentAddress;
  webSocketKey = this.relayService.currentKey;

  constructor(private relayService: RelayService) {}

  ngOnInit(): void {
    this.currentSubscription = this.relayService.stateSubscribe.subscribe(
      (newState) => {
        console.log('ws', newState);
        this.relays = newState;
      },
    );
  }

  updateSubscription() {
    console.log('New subscription');
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();

      this.relayService.changeBaseAddress(this.baseAddress);
      this.currentSubscription = this.relayService
        .changeKey(this.webSocketKey)
        .subscribe((newState) => {
          console.log('ws', newState);
          this.relays = newState;
        });
    }
  }
}
