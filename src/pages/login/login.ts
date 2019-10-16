import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, Events, ModalController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';

import { UserService } from "../../core/services/user.service";
import { WoocommerceService } from "../../core/services/woocommerce.service";
//var Globals = require("../core/globals");
import * as Globals from '../../core/global';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  lastPage: any;
  isCart: any;
  customer_cart_data: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events1: Events,
    private toastCtrl: ToastController,
    public menuCtrl: MenuController,
    private formBuilder: FormBuilder,
    private spinnerDialog: SpinnerDialog,
    private userService: UserService,
    private woocommerceService: WoocommerceService,
    public modalCtrl: ModalController
  ) {
    //events1.publish({'isHeaderHidden': true });
    this.events1.publish('isHeaderHidden', true);
    this.loginForm = this.formBuilder.group({
      email_phone: ["", Validators.required],
      password: ["", Validators.required]
    });
    // this.isCart = JSON.parse(localStorage.getItem("cart"));
    // if (this.isCart != null) {
    //   this.customer_cart_data = this.isCart;
    // }
    // else {
    //   this.customer_cart_data = [];
    // }

   // this.isCart = JSON.parse(localStorage.getItem("cart"));
   console.log("is Cart ==>",JSON.parse(localStorage.getItem("cart")));
    if (JSON.parse(localStorage.getItem("cart")) != null) {
      this.customer_cart_data = this.isCart;
    }
    else {
      this.customer_cart_data = [];
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.menuCtrl.close();
  }

  signIn() {
    if (this.loginForm.valid) {
      let params = {}
      let url = Globals.apiEndpoint + 'login/';
      let loginUserUrl: string = this.woocommerceService.authenticateApi('POST', url, params);
      this.userService.userLogin(loginUserUrl, this.loginForm.value).subscribe(
        res => {
          localStorage.setItem('logged_first_name', res.user['first_name'])
          localStorage.setItem('logged_last_name', res.user['last_name'])
          localStorage.setItem('logged_user_email', res.user['email'])
          localStorage.setItem('logged_user_name', res.user['first_name'] + ' ' + res.user['last_name'])
          localStorage.setItem('logged_user_contact_no', res.user['username'])
          localStorage.setItem('logged_user_id', res.user['user_id'].toString())
          localStorage.setItem('isLoggedin', 'true')
          this.userService.loginStatus(true)
          this.navCtrl.setRoot('HomePage');
          if (this.customer_cart_data.length > 0) {
            this.customer_cart_data.forEach(x => {
              x.user_id = res.user['user_id'].toString()
            })
            this.setCartData();
           this.navCtrl.setRoot('HomePage');
          }
          else {
            this.navCtrl.setRoot('HomePage');
          }
        },
        error => {
          console.log(error);
          this.presentToast("Please check your login credential");
        }
      )
    }
    else {
      this.markFormGroupTouched(this.loginForm)
    }
  }

  setCartData() {
    localStorage.setItem("cart", JSON.stringify(this.customer_cart_data));
  }

  gotoPage(page) {
    this.navCtrl.push(page);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }

  isFieldValid(field: string) {
    return !this.loginForm.get(field).valid && (this.loginForm.get(field).dirty || this.loginForm.get(field).touched);
  }

  displayFieldCss(field: string) {
    return {
      'is-invalid': this.loginForm.get(field).invalid && (this.loginForm.get(field).dirty || this.loginForm.get(field).touched),
      'is-valid': this.loginForm.get(field).valid && (this.loginForm.get(field).dirty || this.loginForm.get(field).touched)
    };
  }

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
