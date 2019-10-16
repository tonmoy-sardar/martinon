import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,MenuController, Events } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import {UserService} from '../../core/services/user.service';
import { PaymentService } from "../../core/services/payment.service";
import { AddressPage } from '../address/address';
/**
 * Generated class for the ProfileviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profileview',
  templateUrl: 'profileview.html',
})
export class ProfileviewPage {
  userId:any;
  logged_first_name:any;
  logged_last_name:any;
  logged_user_name:any;
  logged_user_contact_no:any
  logged_user_email:any;
  user_details:any ={};
  visible_key :boolean =false;
  address_list: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public events1: Events,
    private spinnerDialog: SpinnerDialog,
    public woocommerceService: WoocommerceService,
    public userService:UserService,
    public paymentService: PaymentService,
    public modalCtrl: ModalController,
    ) {
      if (localStorage.getItem('isLoggedin')) {
        this.userId =  localStorage.getItem('logged_user_id');
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileviewPage');
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    this.userDetails();
    this.listAddress(this.userId);
  }

  // ionViewWillEnter() {
  //   this.listAddress(localStorage.getItem('logged_user_id'));
  // }

  userDetails() {
    this.spinnerDialog.show();
    let params = {
    }
    let url = Globals.apiEndpoint + 'customers/' + this.userId;
    let userDeatilsUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.userService.getUserDetails(userDeatilsUrl).subscribe(
      res => {
        this.user_details = res;
        this.visible_key =true;
      },
      error => {
        console.log(error);
        this.spinnerDialog.hide();
      }
    )
  }

  listAddress(id) {
    this.spinnerDialog.show();
    let params = {}
    let url = Globals.apiEndpoint + 'get_user_multiple_address/';
    console.log("url", url);

    let addressUrl: string = this.woocommerceService.authenticateApi('POST', url, params);
    let data = {
      user_id: id
    }
    this.paymentService.getCustomerAddressList(addressUrl, data).subscribe(
      res => {
        //console.log("All Address List==>", res);
        this.address_list = res['user_multiple_address'];
        console.log("All Address List==>", this.address_list);
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }


  // openAddModal() {
  //   const modal = this.modalCtrl.create(AddressPage);
  //   modal.present();
    
  // }
  public openAddModal(){
    var data = { type : '' };
    var modalPage = this.modalCtrl.create(AddressPage,data);
    modalPage.onDidDismiss(() => {
      // Call the method to do whatever in your home.ts
      console.log('Modal closed');
      this.listAddress(localStorage.getItem('logged_user_id'));
    });
    modalPage.present();
  }  
  public openEditModal(address){
    var data = { type : 'edit',addressData:address };
    var modalPage = this.modalCtrl.create(AddressPage,data);
    modalPage.onDidDismiss(() => {
      // Call the method to do whatever in your home.ts
      console.log('Modal closed');
      this.listAddress(localStorage.getItem('logged_user_id'));
    });
    modalPage.present();
  }  

}
