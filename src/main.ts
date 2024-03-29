/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// google analytics
gtag('js', new Date());
gtag('config', environment.gtagId);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
