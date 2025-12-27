import { Component } from '@angular/core';

interface Mobiles {
  android: () => boolean;
  blackBerry: () => boolean;
  iOS: () => boolean;
  opera: () => boolean;
  windows: () => boolean;
  any: () => boolean;
}

@Component({
  selector: 'installation-instructions',
  standalone: true,
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  imports: [],
})
export class InstallationComponent {
  mobiles: Mobiles;

  constructor() {
    this.mobiles = {
      android: () => {
        return !!navigator.userAgent.match(/Android/i);
      },
      blackBerry: () => {
        return !!navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: () => {
        return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      opera: () => {
        return !!navigator.userAgent.match(/Opera Mini/i);
      },
      windows: () => {
        return (
          !!navigator.userAgent.match(/IEMobile/i) ||
          !!navigator.userAgent.match(/WPDesktop/i)
        );
      },
      any: () => {
        return (
          this.mobiles.android() ||
          this.mobiles.blackBerry() ||
          this.mobiles.iOS() ||
          this.mobiles.opera() ||
          this.mobiles.windows()
        );
      },
    };
  }
}
