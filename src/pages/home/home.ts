import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { CategoryService } from '../../core/services/category.service';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import moment from 'moment';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  rating;
  categoryList: any = [];
  popular_product_list: any;
  visible_key: boolean;
  recently_view_product:any =[];
  all_product_list:any =[];
  all_cat_list:any=[];
  ramdom_pro_list:any=[];
  latest_product_list:any=[];
  latestProduct:any=[];
  allCouponList:any =[];
  couponListFilter:any[];
  isExist:number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private spinnerDialog: SpinnerDialog,
    public categoryService: CategoryService,
    public woocommerceService: WoocommerceService,
    public events1: Events
  ) {
    this.events1.publish('isHeaderHidden', false);
    
  }

  ionViewDidLoad() {
   
    this.visible_key = false;
    this.menuCtrl.close();
    this.rating = [1, 2, 3, 4, 5];
    this.getCategory();
    this.getPopularProduct();
    this.getAllProduct();
    this.recently_view_product = JSON.parse(localStorage.getItem("recentlyViewdProduct"));
    console.log("Recently Viewed Product==>",this.recently_view_product);

    this.getAllCategory();
    this.getRandomProduct();
    this.getLatestProduct();

    this.couponList();

  }
  ionViewDidEnter() {
    this.events1.publish('hideBackButton', true);
  }

  couponList() {
    this.spinnerDialog.show();
    let params = {}
    let url = Globals.apiEndpoint + 'coupons/';
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getCategoryList(orderUrl).subscribe(
      res => {
        console.log("Coupon List==>",res);
        this.allCouponList = res;
        console.log("Coupon List==>",this.allCouponList);
       var today = new Date().toLocaleDateString();
       if(this.allCouponList.length > 0) {
        this.couponListFilter = this.allCouponList.filter(coupon => moment(coupon.date_expires).format('DD/MM/YYYY') >= today);
        console.log(this.couponListFilter);
        this.isExist = this.couponListFilter.length;
       }
       else {
        this.isExist =0;
       }
       
        this.spinnerDialog.hide();
      },
      error => {
        this.isExist =0;
        this.spinnerDialog.hide();
      }
    )
  }
  gotoProList(id) {
    this.navCtrl.push('ProductlistPage', { id: id });
  }
  gotoSubCatPage(id) {
    this.navCtrl.push('SubcatlistPage', { id: id });
  }
  gotoProDetails(id) {
    this.navCtrl.push('ProductdetailsPage', { id: id });
  }
  gotoPage(page) {
    this.navCtrl.push(page);
  }


  gotoCatPage(catDetails) {
    console.log("Cat Details ==>",catDetails);
    if(catDetails.child.length > 0) {
      this.navCtrl.push('SubcatlistPage', { id: catDetails.category_id });
    }
    else {
      this.navCtrl.push('ProductlistPage', { id: catDetails.category_id });
    }

  }
  getCategory() {
    this.spinnerDialog.show();
    let params = {
      customer: ''
    }
    let url = Globals.apiEndpoint + 'product_category/';
    
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);
    this.categoryService.getCategoryList(orderUrl).subscribe(
      res => {
        this.categoryList = res['data'];
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }

  getPopularProduct() {
    this.spinnerDialog.show();
    let params = {}
    let url = Globals.apiEndpoint + 'popular_product/';
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getCategoryList(orderUrl).subscribe(
      res => {
        this.popular_product_list = res.data;
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }

  getAllProduct() {
    this.spinnerDialog.show();
    let params = {}
    let url = Globals.apiEndpoint + 'products/';
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getCategoryList(orderUrl).subscribe(
      res => {
        this.all_product_list = res;
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }

  getAllCategory() {
    this.spinnerDialog.show();
    let params = {}
    let url = Globals.apiEndpoint + 'product_category_subcategory/';
    let allCatUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getAllCategory(allCatUrl).subscribe(
      res => {
        this.all_cat_list = res['data'];
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }

  getRandomProduct() {
    this.spinnerDialog.show();
    let params = {}
    let url = Globals.apiEndpoint + 'random_product';
    let randomProUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getRandomProduct(randomProUrl).subscribe(
      res => {
        this.ramdom_pro_list = res['data'];
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }

  getLatestProduct() {
    this.spinnerDialog.show();
    let params = {
      tag: 62
    }
    let url = Globals.apiEndpoint + 'products';
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getLatestProduct(orderUrl).subscribe(
      res => {
        res.forEach(x => {
          if(x.product_variation.length >0){
           x.product_regular_price =parseFloat(x.product_variation[0].regular_price);
           x.product_sell_price =parseFloat(x.product_variation[0].sale_price);
            
          }
          else {
            x.product_regular_price =parseFloat(x.regular_price);
            x.product_sell_price =parseFloat(x.sale_price);
          }
          this.latest_product_list.push(x);
        })
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }

  gotoProductList(routePage) {
    this.navCtrl.push(routePage, { id: '' });
  }

}
