//import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
//import { SplashScreen } from '@ionic-native/splash-screen';
import { SplashScreen} from '@ionic-native/splash-screen';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// core module
import { CoreModule } from '../../src/core/core.module';
import { AddressPage } from '../pages/address/address';
import { FooterPage } from '../pages/include/footer/footer';
import { FilterPage } from '../pages/filter/filter';
@NgModule({
  declarations: [
    MyApp,
    AddressPage,
    FilterPage
  ],
  imports: [
   // BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    CoreModule.forRoot(),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AddressPage,
    FilterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
