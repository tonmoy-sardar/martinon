import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import { CategoryService } from "../../core/services/category.service";
import * as Globals from '../../core/global';
/**
 * Generated class for the RateproductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rateproduct',
  templateUrl: 'rateproduct.html',
})
export class RateproductPage {
  ratingNumber;
  rate;
  rating: number;
  reviewForm: FormGroup;
  product_id: any;
  userId: any;
  userName:any;
  userEmail:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    public categoryService: CategoryService,
    private woocommerceService: WoocommerceService,
  ) {
    this.reviewForm = this.formBuilder.group({
      review: ["", Validators.required],
    });
    this.product_id = this.navParams.get('id');
  }

  ionViewDidLoad() {
    this.userId = localStorage.getItem('logged_user_id');
    this.userName = localStorage.getItem('logged_user_name');
    this.userEmail = localStorage.getItem('logged_user_email');
    console.log('ionViewDidLoad RateproductPage');
    this.ratingNumber = '';
  }
  onModelChange(event) {
    this.ratingNumber = event;
    // alert(this.ratingNumber);
  }

  addReview() {
    console.log("Review Form Data==>", this.reviewForm);
    if (this.ratingNumber) {
      if (this.reviewForm.valid) {
        var data = {
          "product_id": this.product_id,
          "review": this.reviewForm.value.review,
          "reviewer": this.userName,
          "reviewer_email": this.userEmail,
          "rating": this.ratingNumber,
          "verified": 1,
          "status": "approved"
        }
        let params = {}
        let url = Globals.apiEndpoint + 'products/reviews/';
        let reviewUrl:string = this.woocommerceService.authenticateApi('POST',url,params);
          this.categoryService.addReview(reviewUrl,data).subscribe(
            res => {
              console.log("Review Succes==>",res);
              this.navCtrl.push('HomePage');
              this.presentToast("Review Added Succesfully");
              
            },
            error => {
              this.presentToast("Rating not added");
            }
          )
      }
      else {
        this.markFormGroupTouched(this.reviewForm)
      }
    }
    else {
      this.presentToast("please give some rating");
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
    return !this.reviewForm.get(field).valid && (this.reviewForm.get(field).dirty || this.reviewForm.get(field).touched);
  }

  displayFieldCss(field: string) {
    return {
      'is-invalid': this.reviewForm.get(field).invalid && (this.reviewForm.get(field).dirty || this.reviewForm.get(field).touched),
      'is-valid': this.reviewForm.get(field).valid && (this.reviewForm.get(field).dirty || this.reviewForm.get(field).touched)
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
