import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileviewPage } from './profileview';
import { CoreModule } from '../../core/core.module';
@NgModule({
  declarations: [
    ProfileviewPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileviewPage),
    CoreModule
  ],
})
export class ProfileviewPageModule {}
