import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import * as Globals from '../../core/global';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import { UserService } from "../../core/services/user.service";
/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  userId:any;
  allNotificationList:any=[];
  visible_key:boolean;

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     private spinnerDialog: SpinnerDialog,
     public woocommerceService: WoocommerceService,
     public userService:UserService
     ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
    this.userId =  localStorage.getItem('logged_user_id');
    this.notificationList(this.userId);
  }
  notificationList(user_id) {
    this.spinnerDialog.show();
    let params = {}
    this.userService.getNotificationList(user_id).subscribe(
      res => {
        this.allNotificationList = res['data'];
        console.log(this.allNotificationList);
        this.visible_key = true
      },
      error => {
        console.log(error);
      }
    )
  }

}
