import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RateproductPage } from './rateproduct';
import { Ionic2RatingModule } from "ionic2-rating";
@NgModule({
  declarations: [
    RateproductPage,
  ],
  imports: [
    IonicPageModule.forChild(RateproductPage),
    Ionic2RatingModule // Put ionic2-rating module here
  ],
})
export class RateproductPageModule {}
