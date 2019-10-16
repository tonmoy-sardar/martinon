import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
//core module
import { CoreModule } from '../../core/core.module';
@NgModule({
  declarations: [
    SearchPage,
    
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    CoreModule
  ],
})
export class SearchPageModule {}
