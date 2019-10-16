import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events, AlertController } from 'ionic-angular';
import { CartService } from '../../core/services/cart.service';
import { CategoryService } from '../../core/services/category.service';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { isEmpty } from 'rxjs/operators';
/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  logged_user_id;
  customer_cart_data: any = [];
  all_cart_data: any = [];
  img_base_url;
  total_item_price: number;
  isLoggedin: boolean;
  visible_key: boolean;
  stockQty: any;
  cartQty: any;
  pro_variation_id: any;
  isAvailable :boolean;
  alertMsg:any;
  allCouponList:any=[];
  today:any;
  couponResult:any={};
  result:any ={};
  msg:any;
  discountPrice:number;
  toPay:number;
  isShowMsg:number;
  couponcode:any;
  percentageDetails:any;
  taxPrice:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public events1: Events,
    public alertCtrl: AlertController,
    public cartService: CartService,
    public categoryService: CategoryService,
    public woocommerceService: WoocommerceService,
    private spinnerDialog: SpinnerDialog,
  ) {
    this.isShowMsg=0;
    if (localStorage.getItem('isLoggedin')) {
      this.logged_user_id = localStorage.getItem('logged_user_id');
      this.isLoggedin = true;
    }
    else {
      this.logged_user_id = '';
      this.isLoggedin = false;
    }
    this.couponList(this.logged_user_id);

  }

  ionViewDidLoad() {
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    this.events1.publish('isHeaderHidden', false);
    this.populateData();
  }

  

  couponList(user_id) {
    let params = {}
    let url = Globals.apiEndpoint + 'coupons/';
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getCategoryList(orderUrl).subscribe(
      res => {
        console.log("Coupon List==>",res);
        this.allCouponList = res;
      },
      error => {
      }
    )
  }

  applyCode(code) {
    this.visible_key = false;
    this.spinnerDialog.show();
    let params = { }
    var data = {
      "coupon_code": code,
      "user_id":this.logged_user_id
    }
      let url = Globals.apiEndpoint + 'valid_coupon/';
      let couponUrl: string = this.woocommerceService.authenticateApi('POST', url, params);
  
      this.categoryService.checkCoupon(couponUrl,data).subscribe(
      res => {
        this.msg = res.message;
        console.log(this.msg);
        this.result =res;
        this.couponResult = res['data'];
        if(res.status==true) {
          this.getDiscountPrice(this.couponResult.amount,this.couponResult.maximum_amount)
        }
        console.log("Coupon result",res['data']);
        this.visible_key = true;
        this.spinnerDialog.hide();
        this.isShowMsg = 1;
      },
      error => {
        this.isShowMsg = 0;
        this.visible_key = true;
        this.spinnerDialog.hide();

      }
    )
  }

  getDiscountPrice(discount,maximum_amount) {
    
    this.total_item_price = 0;
    this.customer_cart_data.forEach(x => {
      if (x.price > 0) {
        this.total_item_price += (x.price * x.quantity);
      }
      else {
        this.total_item_price += (x.price * x.quantity);
      }
    })

    this.discountPrice = (this.total_item_price * discount)/100;
    this.taxCalculation(this.discountPrice);
   
  }


  populateData() {
    if (localStorage.getItem("cart")) {
      this.all_cart_data = JSON.parse(localStorage.getItem("cart"));
      // this.customer_cart_data = this.all_cart_data;
      var filteredData = this.all_cart_data.filter(x => x.user_id == this.logged_user_id)
      this.customer_cart_data = filteredData;
      console.log(this.customer_cart_data);
      this.getTotalItemPrice();
      this.visible_key = true
    }
    else {
      this.customer_cart_data = [];
      this.visible_key = true
    }
  }

  setCartData() {
    console.log("Set Cart Data ==>",this.customer_cart_data);
    localStorage.setItem("cart", JSON.stringify(this.customer_cart_data));
    this.getTotalItemPrice();
  }

  increment(i, item) {
    var qty = this.customer_cart_data[i].quantity;
    this.cartQty = qty + 1;
    this.getVariationQty(i, item.product_id)
    
  }

  decrement(i) {
    var qty = this.customer_cart_data[i].quantity;
    if (qty > 1) {
      this.customer_cart_data[i].quantity = qty - 1;
      var index = this.all_cart_data.findIndex(x => x.user_id == this.logged_user_id && x.product_id == this.customer_cart_data[i].product_id && x.size == this.customer_cart_data[i].size && x.color == this.customer_cart_data[i].color);
      if (index != -1) {
        this.setCartData()
      }
    }
    else {
      this.remove(this.customer_cart_data[i].product_id,i)
    }
    this.cartService.cartNumberStatus(true);
  }


  remove(id,i) {
    let alert = this.alertCtrl.create({
      message: 'Do you want to remove?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Remove',
          handler: () => {
            var index = this.all_cart_data.findIndex(x => x.user_id == this.logged_user_id && x.product_id == id && x.size == this.customer_cart_data[i].size && x.color == this.customer_cart_data[i].color);
            if (index != -1) {
              this.all_cart_data.splice(index, 1);
              this.customer_cart_data.splice(index, 1);
              this.setCartData();
              this.isShowMsg = 0;
              if(this.couponResult) {
                this.getDiscountPrice(this.couponResult.amount,this.couponResult.maximum_amount)
              }
              
            }
            this.cartService.cartNumberStatus(true);
          }
        }
      ]
    });
    alert.present();
  }

  getTotalItemPrice() {
    this.total_item_price = 0;
   
    this.customer_cart_data.forEach(x => {
      if (x.price > 0) {
        this.total_item_price += (x.price * x.quantity);
      }
      else {
        this.total_item_price += (x.price * x.quantity);
      }
    })
 if(Object.getOwnPropertyNames(this.couponResult).length ==0) {
  this.discountPrice = 0;
 this.taxCalculation(this.discountPrice);
 }
 else {
  this.getDiscountPrice(this.couponResult.amount,this.couponResult.maximum_amount)
 }
 
  }


  checkout() {
    if (this.isLoggedin) {
     //alert(this.result);
      if( this.result.status ==true) {
        var coupondata = {
          code: this.couponResult.code,
          amount: this.couponResult.amount,
        }
      }
     
      this.navCtrl.push('CheckoutPage',{data:coupondata});
    }
    else {
      this.navCtrl.push('LoginPage');
    }
  }

  gotoProDetails(id) {
    this.navCtrl.push('ProductdetailsPage', { id: id });
  }

  getVariationQty(i, pro_id) {
    this.pro_variation_id = this.customer_cart_data[i].variation_id
    let params = {
    }
    let url = Globals.apiEndpoint + 'products/' + pro_id + '/variations/' + this.pro_variation_id;
    let variationQtyUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getVariationQty(variationQtyUrl).subscribe(
      res => {
        console.log("Pro Variation Qty ==>", res);
        this.stockQty = res.stock_quantity;
        this.alertMsg ="Only "+ this.stockQty + " Stocks available";
        if (this.cartQty > this.stockQty) {
          let alert = this.alertCtrl.create({
            message: this.alertMsg,
            buttons: [
              {
                text: 'Ok',
                role: 'cancel',
                handler: () => {
                }
              }
            ]
          });
          alert.present();
        }
        else {
          var index = this.all_cart_data.findIndex(x => x.user_id == this.logged_user_id && x.product_id == this.customer_cart_data[i].product_id && x.size == this.customer_cart_data[i].size && x.color == this.customer_cart_data[i].color);
          if (index != -1) {
            this.all_cart_data[index].quantity = this.cartQty;
            this.setCartData()
          }
          this.cartService.cartNumberStatus(true);
        }

      },
      error => {
        console.log(error);

      }
    )

  }


  taxCalculation(discountprice) {

    let params = {}
    let url = Globals.apiEndpoint + 'taxes/';
    let taxUrl: string = this.woocommerceService.authenticateApi('GET', url, params);
   
    this.categoryService.getTaxDetails(taxUrl).subscribe(
      res => {
        this.percentageDetails = res[0];
        this.visible_key = true;
        this.taxPrice = (this.total_item_price * this.percentageDetails.rate)/100;
        this.toPay = (this.total_item_price - discountprice) + this.taxPrice;
      },
      error => {
        this.visible_key = true;
      }
    )
  }



}
