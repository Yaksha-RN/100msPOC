import { Component } from '@angular/core';
import { HMSReactiveStore } from '@100mslive/hms-video-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vc-new';
   hms = new HMSReactiveStore();
 hmsStore = this.hms.getStore();
 hmsActions = this.hms.getActions();

}
