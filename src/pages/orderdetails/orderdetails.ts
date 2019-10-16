import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events,ModalController } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { CategoryService } from '../../core/services/category.service';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import { RateproductPage } from '../rateproduct/rateproduct';

/**
 * Generated class for the OrderdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ segment: 'orderdetails/:id' })
@Component({
  selector: 'page-orderdetails',
  templateUrl: 'orderdetails.html',
})
export class OrderdetailsPage {
  visible_key:boolean;
  order_details:any=[];
  shippingAddress:any ={};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public events1: Events,
    private spinnerDialog: SpinnerDialog,
    public categoryService: CategoryService,
    public woocommerceService: WoocommerceService,
    public modalCtrl: ModalController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderdetailsPage');
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    this.events1.publish('isHeaderHidden', false);
    this.getOrderDetails(this.navParams.get('id'))
  }
  getOrderDetails(order_id) {
    this.visible_key =false;
    this.spinnerDialog.show();
    let params = {
    }
    let url = Globals.apiEndpoint + 'orders/' + order_id;
    let orderDeatilsUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getOrderDetails(orderDeatilsUrl).subscribe(
      res => {
        this.order_details = res;
        this.shippingAddress = this.order_details.shipping;
        this.visible_key = true
        this.spinnerDialog.hide();
      },
      error => {
        this.spinnerDialog.hide();
        
      }
    )
  }

  // public openReviewModal(){
  //   var data = { type : '' };
  //   var modalPage = this.modalCtrl.create(RateproductPage,data);
  //   modalPage.onDidDismiss(() => {
  //     // Call the method to do whatever in your home.ts
  //     console.log('Modal closed');
  //     //this.listAddress(localStorage.getItem('logged_user_id'));
  //   });
  //   modalPage.present();
  // }  

  addReview(id) {
    this.navCtrl.push('RateproductPage',{id:id});
  }


}
