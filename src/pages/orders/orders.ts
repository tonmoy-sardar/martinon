import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events, } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import { PaymentService } from "../../core/services/payment.service";


/**
 * Generated class for the OrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {
  visible_key:boolean=false;
  order_list:any=[];
  userId:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    public events1: Events,
    private spinnerDialog: SpinnerDialog,
    public paymentService:PaymentService,
    public woocommerceService: WoocommerceService,
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    this.events1.publish('isHeaderHidden', false);
    if (localStorage.getItem('isLoggedin')) {
      this.userId =  localStorage.getItem('logged_user_id');
    }
    this.getCustomerOrderList(this.userId)
  }

  getCustomerOrderList(customer_id) {
    this.spinnerDialog.show();
    let params = {
        customer: customer_id
    }
    let url = Globals.apiEndpoint + 'orders';
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);
    this.paymentService.getCustomerOrderList(orderUrl).subscribe(
        res => {
            this.order_list = res;
            this.visible_key = true
            this.spinnerDialog.hide();
        },
        error => {
            console.log(error)
            this.spinnerDialog.hide();
        }
    )
}
gotoOrderDetails(id) {
  this.navCtrl.push('OrderdetailsPage',{id:id});
}


}
