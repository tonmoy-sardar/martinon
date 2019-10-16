import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Events } from 'ionic-angular';
import { CategoryService } from '../../core/services/category.service';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';

/**
 * Generated class for the SubcategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  categoryList: any = [];
  visible_key: boolean;
  subCatList:any=[];
  subCatListt:any=[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public categoryService: CategoryService,
    public woocommerceService: WoocommerceService,
    public events1: Events,
    private spinnerDialog: SpinnerDialog,
  ) {
    
  }

  ionViewDidLoad() {
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    this.events1.publish('isHeaderHidden', false);
    this.getCategory();
  }
 
  gotoProList(id) {
    this.navCtrl.push('ProductlistPage', { id: id });
  }
  goBack() {
    this.navCtrl.pop();
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
        this.spinnerDialog.hide();
        this.categoryList = res['data'];
        var subcat = []
        this.visible_key = true;
      },
      error => {
        this.spinnerDialog.hide();
        this.visible_key = true;
      }
    )
  }
  

showSubCat(id) {
  if (this.categoryList.length > 0) {
    this.categoryList.forEach(y => {
      if(y.category_id==id) {
        this.subCatList = y.child;
      }
    })

  }
}

showSubCatt(id) {
  if (this.subCatList.length > 0) {
    this.subCatList.forEach(y => {
      if(y.category_id==id) {
        this.subCatListt = y.child;
      }
    })

  }
}


}
