import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductlistPage } from './productlist';
//core module
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    ProductlistPage,
    
  ],
  imports: [
    IonicPageModule.forChild(ProductlistPage),
    CoreModule
  ],
})
export class ProductlistPageModule {}
