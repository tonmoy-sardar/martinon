import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
//core module
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    CoreModule
  ],
})
export class HomePageModule { }
