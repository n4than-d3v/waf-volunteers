import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { SwUpdate } from '@angular/service-worker';

bootstrapApplication(AppComponent, appConfig)
  .then((appRef) => {
    if (!appRef) return;

    const updates = appRef.injector.get(SwUpdate);

    updates.versionUpdates.subscribe((event) => {
      if (event.type === 'VERSION_READY') {
        updates.activateUpdate().then(() => document.location.reload());
      }
    });
  })
  .catch((err) => console.error(err));
