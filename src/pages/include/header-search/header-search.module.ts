import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HeaderSearchPage } from './header-search';

@NgModule({
  declarations: [
    HeaderSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(HeaderSearchPage),
  ],
})
export class HeaderSearchPageModule {}
