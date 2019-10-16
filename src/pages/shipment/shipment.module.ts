import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShipmentPage } from './shipment';

@NgModule({
  declarations: [
    ShipmentPage,
  ],
  imports: [
    IonicPageModule.forChild(ShipmentPage),
  ],
})
export class ShipmentPageModule {}
