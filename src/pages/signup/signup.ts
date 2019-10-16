import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController,Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
//Services
import { UserService} from '../../core/services/user.service';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  isShowHeader:number;
  signupForm: FormGroup;
  contact;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public events1: Events,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private spinnerDialog: SpinnerDialog,
    public userService:UserService,
    public menuCtrl: MenuController,
    private woocommerceService: WoocommerceService,
  ) {
    this.events1.publish('isHeaderHidden', true);

    this.signupForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      // email: ['', [
      //   Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
      // ]],
      username: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      password: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
    this.menuCtrl.close();
  }
  gotoSignin() {
    this.navCtrl.push('LoginPage');
  }

  // signUp() {
  //   this.spinnerDialog.show();
  //   if (this.signupForm.valid) {
  //     console.log(this.signupForm);
  //     // this.signupForm.value.otp_verified =  '1';
  //     // this.signupForm.value.address =  '1';
  //     // this.userService.userSignup(this.signupForm.value).subscribe(
  //     //   res => {
  //     //     this.presentToast("Succesfully User Register");
  //     //     this.navCtrl.setRoot('LoginPage');
  //     //     this.spinnerDialog.hide();
  //     //   },
  //     //   error => {
  //     //     this.presentToast(error.error.message);
  //     //     this.spinnerDialog.hide();
  //     //   }
  //     // )
  //   } else {
  //     this.markFormGroupTouched(this.signupForm)
  //   }
  // }

  signUp() {
    if (this.signupForm.valid) {
      this.spinnerDialog.show();
      var signUpData = {
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        first_name: this.signupForm.value.first_name,
        last_name: this.signupForm.value.last_name,
        username: this.signupForm.value.username,
        billing: {
          first_name: this.signupForm.value.first_name,
          last_name: this.signupForm.value.last_name,
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          state: "",
          postcode: "",
          country: "",
          email: this.signupForm.value.email,
          phone: this.signupForm.value.username,
        },
        shipping: {
          first_name: this.signupForm.value.first_name,
          last_name: this.signupForm.value.last_name,
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          state: "",
          postcod: "",
          country: ""
        }
      }
      let params = {}
      let url = Globals.apiEndpoint + 'customers/';
      let createUserUrl:string = this.woocommerceService.authenticateApi('POST',url,params);
        

      this.userService.userRegister(createUserUrl,signUpData).subscribe(
        res => {
          this.spinnerDialog.hide();
          this.presentToast("Registration Successful");
          this.navCtrl.setRoot('LoginPage');
        },
        error => {
          console.log(error);
          this.spinnerDialog.hide();
          this.presentToast("Account already exist");

        }
      )
    }
    else {
      this.markFormGroupTouched(this.signupForm)
    }
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
    return !this.signupForm.get(field).valid && (this.signupForm.get(field).dirty || this.signupForm.get(field).touched);
  }

  displayFieldCss(field: string) {
    return {
      'is-invalid': this.signupForm.get(field).invalid && (this.signupForm.get(field).dirty || this.signupForm.get(field).touched),
      'is-valid': this.signupForm.get(field).valid && (this.signupForm.get(field).dirty || this.signupForm.get(field).touched)
    };
  }

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position:'top'
    });
    toast.present();
  }

}
