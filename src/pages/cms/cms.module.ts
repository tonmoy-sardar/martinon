import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CmsPage } from './cms';
//core module
import { CoreModule } from '../../core/core.module';
@NgModule({
  declarations: [
    CmsPage,
  ],
  imports: [
    IonicPageModule.forChild(CmsPage),
    CoreModule
  ],
})
export class CmsPageModule {}
