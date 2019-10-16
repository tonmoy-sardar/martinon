import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubcatlistPage } from './subcatlist';
import { CoreModule } from '../../core/core.module';
@NgModule({
  declarations: [
    SubcatlistPage,
  ],
  imports: [
    IonicPageModule.forChild(SubcatlistPage),
    CoreModule
  ],
})
export class SubcatlistPageModule {}
