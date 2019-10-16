import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { CategoryService } from '../../core/services/category.service';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import moment from 'moment';

/**
 * Generated class for the SubcatlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ segment: 'subcatlist/:id' })
@Component({
  selector: 'page-subcatlist',
  templateUrl: 'subcatlist.html',
})
export class SubcatlistPage {
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
  subCatId:any;
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
    this.events1.publish('hideBackButton', false);
    this.events1.publish('isHeaderHidden', false);
    console.log('ionViewDidLoad SubcatlistPage');
    this.subCatId =this.navParams.get('id');
    // alert(this.subCatId);
    this.visible_key = false;
    this.menuCtrl.close();
    this.rating = [1, 2, 3, 4, 5];
    this.getSubCategory(this.subCatId);
    this.getSubCatPopularProduct(this.subCatId);
    this.getAllProduct();
    this.recently_view_product = JSON.parse(localStorage.getItem("recentlyViewdProduct"));
    //console.log("Recently Viewed Product==>",this.recently_view_product);
    this.getRandomSubCatProduct(this.subCatId);
    this.getLatestSubCatProduct(this.subCatId);
  }

  // ionViewDidEnter() {
  //   this.events1.publish('hideBackButton', true);
  // }

 
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
  getSubCategory(id) {
    this.spinnerDialog.show();
    let params = {
      cat_id:id
    }
    //let url = Globals.apiEndpoint + 'products/categories/';
    let url = Globals.apiEndpoint + 'product_subcategory_by_category/';
    
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);
    this.categoryService.getSubCatList(orderUrl).subscribe(
      res => {
        //this.categoryList = res;
        this.categoryList = res['data'];
       console.log("Category Page Sub Cat list Top ==>",this.categoryList);
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }

  getSubCatPopularProduct(id) {
  //  alert(id);
    this.spinnerDialog.show();
    let params = {
      cat_id: id
    }
   
    let url = Globals.apiEndpoint + 'popular_product_category_wise/';
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);
    this.categoryService.getSubcatPopularList(orderUrl).subscribe(
      res => {
        console.log("============");
        console.log("Sub Category Popular Fashion==>",res);
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
        //console.log("New Arraival==>",res);
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }



  getRandomSubCatProduct(id) {
    this.spinnerDialog.show();
    let params = {
      cat_id:id
    }
    let url = Globals.apiEndpoint + 'random_product_by_category';
    let randomProUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getRandomsubCatProduct(randomProUrl).subscribe(
      res => {
        this.ramdom_pro_list = res['data'];
       // console.log("random product list==>",this.ramdom_pro_list);
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }

  getLatestSubCatProduct(id) {
    this.spinnerDialog.show();
    let params = {
      tag: 62,
      category:id
    }
    //let url = Globals.apiEndpoint + 'products/?tag=62';
    let url = Globals.apiEndpoint + 'products';
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getLatestsubCatProduct(orderUrl).subscribe(
      res => {
        //this.latest_product_list = res;
       console.log("Sub Cat Latest product list==>",res);
        res.forEach(x => {
          if(x.product_variation.length >0){
         //   console.log(1);
           x.product_regular_price =parseFloat(x.product_variation[0].regular_price);
           x.product_sell_price =parseFloat(x.product_variation[0].sale_price);
            
          }
          else {
           // console.log(2);
            x.product_regular_price =parseFloat(x.regular_price);
            x.product_sell_price =parseFloat(x.sale_price);
            //this.stockQty = res.stock_quantity;
           
          }
         // console.log("Get Product Push==>",x);
          this.latest_product_list.push(x);
        })
       // console.log(this.latest_product_list);
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
