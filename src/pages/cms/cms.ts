import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events, } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import { UserService } from '../../core/services/user.service';

/**
 * Generated class for the CmsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ segment: 'cms/:id' })
@Component({
  selector: 'page-cms',
  templateUrl: 'cms.html',
})
export class CmsPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public menuCtrl:MenuController,
    public events1: Events,
    private spinnerDialog: SpinnerDialog,
    public woocommerceService: WoocommerceService,
    public userService:UserService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CmsPage');
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    this.events1.publish('isHeaderHidden', false);
    this.cmsDetails(this.navParams.get('id'));
  }

  cmsDetails(page_id) {
    let params = {
    }
  //  let url = Globals.apiEndpoint + 'page';
   // let orderDeatilsUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.userService.getCmsDetails(page_id).subscribe(
      res => {
       this.cmsDetails = res['data'][0];
       console.log(this.cmsDetails);
      },
      error => {
        console.log(error);
      }
    )
  }


}
