import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events,ModalController } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { CategoryService } from '../../core/services/category.service';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import { FilterPage } from '../filter/filter';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ segment: 'search/:keyword' })
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  rating;
  product_list: any = [];
  visible_key: boolean;
  searchKey: any;
  FilterResult:number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private spinnerDialog: SpinnerDialog,
    public categoryService: CategoryService,
    public woocommerceService: WoocommerceService,
    public events1: Events,
    public modalCtrl: ModalController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    this.events1.publish('isHeaderHidden', false);
    this.rating = [1, 2, 3, 4, 5];
    this.searchKey =this.navParams.get('keyword');


      if (this.searchKey != 0) {
        this.searchProduct(this.navParams.get('keyword'));
      }
      else {
        this.getAllProduct();
      }
  }

  // search(keyword) {
  //   this.searchProduct(keyword);
  // }
  searchProduct(keywords) {
    this.spinnerDialog.show();
    let params = {
      search: keywords,
    }
    let url = Globals.apiEndpoint + 'products/';
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getSearchProduct(orderUrl).subscribe(
      res => {
        this.product_list =[];
        // console.log("Search Result==>",res);
        // this.FilterResult=0;
        // this.product_list = res;
        // this.visible_key = true;

        console.log("Get Search Product==>",res);
        this.FilterResult=0;
        //this.product_list = res;

        res.forEach(x => {
          if(x.product_variation.length >0){
            
           x.product_regular_price =parseFloat(x.product_variation[0].regular_price);
           x.product_sell_price =parseFloat(x.product_variation[0].sale_price);
            
          }
          else {
            console.log(2);
            x.product_regular_price =parseFloat(x.regular_price);
            x.product_sell_price =parseFloat(x.sale_price);
            //this.stockQty = res.stock_quantity;
           
          }
          console.log("zzzz",x);
          this.product_list.push(x);
        })

        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
      }
    )
  }

  // getAllProduct() {
  //   this.spinnerDialog.show();
  //   let params = {}
  //   let url = Globals.apiEndpoint + 'products/';
  //   let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

  //   this.categoryService.getCategoryList(orderUrl).subscribe(
  //     res => {
  //       console.log("Get All Result==>",res);
  //       this.FilterResult=0;
  //       this.product_list = res;
  //       console.log("aaaaaaa",res);
  //       this.visible_key = true;
  //       this.spinnerDialog.hide();
  //     },
  //     error => {
  //       this.visible_key = true;
  //       this.spinnerDialog.hide();
  //     }
  //   )
  // }

  getAllProduct() {
    this.visible_key = false;
    this.spinnerDialog.show();
    let params = {}
    let url = Globals.apiEndpoint + 'products/';
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getCategoryList(orderUrl).subscribe(
      res => {
        console.log("Get All Product==>",res);
        this.FilterResult=0;
        //this.product_list = res;

        res.forEach(x => {
          if(x.product_variation.length >0){
            
           x.product_regular_price =parseFloat(x.product_variation[0].regular_price);
           x.product_sell_price =parseFloat(x.product_variation[0].sale_price);
            
          }
          else {
            console.log(2);
            x.product_regular_price =parseFloat(x.regular_price);
            x.product_sell_price =parseFloat(x.sale_price);
            //this.stockQty = res.stock_quantity;
           
          }
          console.log("zzzz",x);
          this.product_list.push(x);
        })

        console.log("1111111",this.product_list);

        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }

  gotoProDetails(id) {
    //this.navCtrl.push(page);
    this.navCtrl.push('ProductdetailsPage', { id: id });
  }
  goBack() {
    this.navCtrl.pop();
  }

  // public filterProductModal(address){
  //   var data = { type : 'edit',addressData:address };
  //   var modalPage = this.modalCtrl.create(FilterPage,data);
  //   modalPage.onDidDismiss(() => {
  //     // Call the method to do whatever in your home.ts
  //     console.log('Modal closed');
  //   });
  //   modalPage.present();
  // } 

  public filterProductModal(address){
    var data = { type : 'edit',addressData:address };
    var modalPage = this.modalCtrl.create(FilterPage,data);
    modalPage.onDidDismiss((data) => {
      // Call the method to do whatever in your home.ts
      console.log('Modal closed',data);
      this.getFilterProductList(data);
      this.FilterResult =1;
    });
    modalPage.present();
  } 


  getFilterProductList(filterData) {
    
    this.spinnerDialog.show();
    let params = { }
    var filData = {
      "product_attribute": filterData
    }

    let url = Globals.apiEndpoint + 'product_filter_attribute_wise';
    let filterUrl: string = this.woocommerceService.authenticateApi('POST', url, params);

    this.categoryService.getFilterProduct(filterUrl,filData).subscribe(
      res => {
        this.FilterResult =1;
        this.product_list = res['data'];
        console.log("Filter Data",res['data']);
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }

 

}
