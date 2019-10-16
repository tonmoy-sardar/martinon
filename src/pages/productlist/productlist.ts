import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events,ModalController,ViewController } from 'ionic-angular';
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

@IonicPage({ segment: 'productlist/:id' })
@Component({
  selector: 'page-productlist',
  templateUrl: 'productlist.html',
})
export class ProductlistPage {
  rating;
  product_list: any = [];
  FilterResult:number;
  visible_key: boolean=false;
  catId: any;
  filterUrl:any;
  filterData:any;
  product_regular_price:any;
  product_sell_price:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private spinnerDialog: SpinnerDialog,
    public categoryService: CategoryService,
    public woocommerceService: WoocommerceService,
    public events1: Events,
    public modalCtrl: ModalController,
    public viewCtrl:ViewController
  ) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductlistPage');
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    this.events1.publish('isHeaderHidden', false);
    this.rating = [1, 2, 3, 4, 5];
    this.catId = this.navParams.get('id');
    this.filterData = this.navParams.get('filterData');

    if(this.filterData == undefined) {
      if (this.catId != "") {
        this.getProduct(this.navParams.get('id'));
      }
      else {
        this.getAllProduct();
      }
    }
    else {
      this.getFilterProductList(this.filterData);
    }
   

  }

  getProduct(category_id) {
    this.visible_key = false;
    this.spinnerDialog.show();
    let params = {
      category: category_id,
    }
    let url = Globals.apiEndpoint + 'products/';
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getCategoryList(orderUrl).subscribe(
      res => {
        this.FilterResult=0;
        console.log("Get Product==>",res);
       // this.product_list = res;

        res.forEach(x => {
          if(x.product_variation.length >0){
            console.log(1);
           x.product_regular_price =parseFloat(x.product_variation[0].regular_price);
           x.product_sell_price =parseFloat(x.product_variation[0].sale_price);
            
          }
          else {
            console.log(2);
            x.product_regular_price =parseFloat(x.regular_price);
            x.product_sell_price =parseFloat(x.sale_price);
            //this.stockQty = res.stock_quantity;
           
          }
          console.log("Get Product Push==>",x);
          this.product_list.push(x);
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

        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }


  getSortedProductList(order_by,meta_key) {
    this.spinnerDialog.show();
    var params;
    if(this.catId !="") {
      params = {
        category:this.catId,
        order:order_by,
        orderby_meta_key:meta_key,
    }
    }
    else {
      params = {
        order:order_by,
        orderby_meta_key:meta_key,
    }
      
    }
    let url = Globals.apiEndpoint + 'products';
    let productUrl:string = this.woocommerceService.authenticateApi('GET',url,params);

    this.categoryService.getProductListByCategoryId(productUrl).subscribe(
        res => {
          this.product_list=[];
          console.log("Sorted Product==>",res);
          // this.product_list = res;
          // this.visible_key = true;
          // this.spinnerDialog.hide();
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
  
          this.visible_key = true;
          this.spinnerDialog.hide();
        },
        error => {
          this.spinnerDialog.hide();
        }
    )
}


  gotoProDetails(id) {
    //this.navCtrl.push(page);
    this.navCtrl.push('ProductdetailsPage', { id: id });
  }
  searchProduct(keyword) {
    this.navCtrl.push('SearchPage', { keyword: keyword });
  }
  goBack() {
    this.navCtrl.pop();
  }

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
    this.visible_key = false;
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
        console.log("Filter Product Data",res['data']);

        
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
