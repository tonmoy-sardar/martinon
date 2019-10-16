import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import * as Globals from '../../core/global';
import { UserService } from "../../core/services/user.service";
import { WoocommerceService } from "../../core/services/woocommerce.service";
/**
 * Generated class for the ForgotPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {
  isShowHeader: number;
  isShow: number;
  data: any = {};
  newOtp: string;
  otpVerified: number;
  contactNumber: any;
  lastFourNumber: number;
  getResult: any = {};
  useContactEmail;
  forgotForm: FormGroup;
  otpForm: FormGroup;
  newPasswordForm:FormGroup;
  otp:any;
  user_id:any;
  otp_status:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events1: Events,
    private toastCtrl: ToastController,
    private spinnerDialog: SpinnerDialog,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private woocommerceService: WoocommerceService,
  ) {
    this.isShow = 0;
    //Header Show Hide Code 
    //events.publish('hideHeader', { isHeaderHidden: true, isSubHeaderHidden: true });
    this.events1.publish('isHeaderHidden', true);
    // this.events1.publish('isHeaderHidden', false);
    this.forgotForm = this.formBuilder.group({
      phone: ["", Validators.required]
    });

    this.otpForm = this.formBuilder.group({
      otp: ["", Validators.required]
    });

    this.newPasswordForm = this.formBuilder.group({
      password: ["", Validators.required],
      conf_password: ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPage');
  }

  gotoSignin() {
    this.navCtrl.push('LoginPage');
  }
  resetPassword(data) {
    this.useContactEmail = data.phone;
    this.spinnerDialog.show();
    if (this.useContactEmail != undefined) {
      let params = {}
      let otpUrl = Globals.apiEndpoint + 'send_otp/';
      let sendOtpUrl: string = this.woocommerceService.authenticateApi('POST', otpUrl, params);

      this.userService.userForgetPasswordOtp(sendOtpUrl, this.forgotForm.value).subscribe(
        res => {
          console.log(res);
          this.spinnerDialog.hide();

         // this.otp = base64.decode(res['phone_otp']);
         this.otp =res['phone_otp'];
          this.user_id = res['user_id'];
          this.isShow = 1;
        },
        error => {
          this.presentToast("Please check your contact number");
          this.spinnerDialog.hide();

        }
      )
    } else {
      this.presentToast("Please check your contact number");
    }

  }

  matchOtp() {
    console.log(this.otp);
    console.log(btoa(this.otpForm.value.otp));
    if (this.otp == btoa(this.otpForm.value.otp)) {
      this.isShow = 2;
     this.otp_status = 1;
     console.log(this.otp)
     console.log(this.otpForm.value.otp)
     console.log("Match otp");
    }
    else {
      this.presentToast("Please Enter Valid OTP");
    }
  }

  updatePassword() {
    if (this.newPasswordForm.valid) {
      if (this.newPasswordForm.value.conf_password != this.newPasswordForm.value.password) {
        this.presentToast("New & Confirm Password should be same");

      }
      else {
        this.spinnerDialog.show();
        var data = {
          user_id: this.user_id,
          otp_status: this.otp_status,
          new_password: this.newPasswordForm.value.password,
        }
        let params = {}
        let url = Globals.apiEndpoint + 'forget_password/';
        let userPasswordUpdateUrl: string = this.woocommerceService.authenticateApi('POST', url, params);
        
        this.userService.userPasswordUpdate(userPasswordUpdateUrl,data).subscribe(
          res => {
            this.spinnerDialog.hide();
            this.presentToast("Password has been successfully changed.");
            this.navCtrl.setRoot('LoginPage');
           
          },
          error => {
           this.presentToast("New & Confirm Password should be same");
           this.spinnerDialog.hide();
          }
        )

      }

    }
    else {
      this.markFormGroupTouched(this.newPasswordForm)
    }

  }

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && (form.get(field).dirty || form.get(field).touched);
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'is-invalid': form.get(field).invalid && (form.get(field).dirty || form.get(field).touched),
      'is-valid': form.get(field).valid && (form.get(field).dirty || form.get(field).touched)
    };
  }



}
