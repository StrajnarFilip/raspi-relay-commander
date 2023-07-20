import { Component, Input } from '@angular/core';
import { Relay } from 'src/app/models/relay';
import { RelayService } from 'src/app/services/relay.service';

@Component({
  selector: 'app-relay-toggle',
  templateUrl: './relay-toggle.component.html',
  styleUrls: ['./relay-toggle.component.scss'],
})
export class RelayToggleComponent {
  @Input()
  relay?: Relay;

  constructor(private relayService: RelayService) {}

  onChange(event: any) {
    if (this.relay) {
      this.relayService.changeRelay(
        this.relay.id,
        event.checked,
        this.relay.name,
      );
    }
  }
}
