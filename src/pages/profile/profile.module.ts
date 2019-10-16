import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    CoreModule
  ],
})
export class ProfilePageModule {}
