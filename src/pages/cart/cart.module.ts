import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartPage } from './cart';
//core module
import { CoreModule } from '../../core/core.module';
@NgModule({
  declarations: [
    CartPage,
  ],
  imports: [
    IonicPageModule.forChild(CartPage),
    CoreModule
    
  ],
})
export class CartPageModule {}
