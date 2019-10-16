import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileeditPage } from './profileedit';
//core module
import { CoreModule } from '../../core/core.module';
@NgModule({
  declarations: [
    ProfileeditPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileeditPage),
    CoreModule
  ],
})
export class ProfileeditPageModule {}
