import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Platform, LoadingController,Events,ToastController,ActionSheetController } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import {UserService} from '../../core/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop/ngx';

/**
 * Generated class for the ProfileeditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-profileedit',
  templateUrl: 'profileedit.html',
})
export class ProfileeditPage {
  userId:any;
  logged_first_name:any;
  logged_last_name:any;
  logged_user_name:any;
  logged_user_contact_no:any
  logged_user_email:any;
  user_details:any ={};
  visible_key :boolean =false;
  editProfileForm: FormGroup;
  profileDetails:any;
  lastImage: any;
  loading: any;
  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public events1: Events,
    private spinnerDialog: SpinnerDialog,
    public woocommerceService: WoocommerceService,
    public userService:UserService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    private transfer: Transfer,
    private file: File,
    private filePath: FilePath,
    public loadingCtrl: LoadingController,
    ) {
      if (localStorage.getItem('isLoggedin')) {
        this.userId =  localStorage.getItem('logged_user_id');
      }

      this.editProfileForm = this.formBuilder.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        // email: ['', [
        //   Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
        // ]],
        // username: ['', [
        //   Validators.required,
        //   Validators.minLength(10),
        //   Validators.maxLength(10)
        // ]],
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileeditPage');
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    this.menuCtrl.close();
    this.events1.publish('isHeaderHidden', false);
    this.userDetails();
  }
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
        this.spinnerDialog.hide();
      },
      error => {
        this.spinnerDialog.hide();
        this.visible_key =true;
      }
    )
  }

  updateProfile() {
    if (this.editProfileForm.valid) {
      this.spinnerDialog.show();
      var signUpData = {
       // email: this.editProfileForm.value.email,
       // password: this.editProfileForm.value.password,
        first_name: this.editProfileForm.value.first_name,
        last_name: this.editProfileForm.value.last_name,
       // username: this.editProfileForm.value.username,
        billing: {
          first_name: this.editProfileForm.value.first_name,
          last_name: this.editProfileForm.value.last_name,
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          state: "",
          postcode: "",
          country: "",
         // email: this.editProfileForm.value.email,
        //  phone: this.editProfileForm.value.username,
        },
        shipping: {
          first_name: this.editProfileForm.value.first_name,
          last_name: this.editProfileForm.value.last_name,
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
      let url = Globals.apiEndpoint + 'customers/' + this.userId;
      let createUserUrl:string = this.woocommerceService.authenticateApi('POST',url,params);
        

      this.userService.userRegister(createUserUrl,signUpData).subscribe(
        res => {
          this.spinnerDialog.hide();
          localStorage.setItem('logged_first_name', res.first_name)
          localStorage.setItem('logged_last_name', res.last_name)
          localStorage.setItem('logged_user_email', res.email)
          localStorage.setItem('logged_user_name', res.first_name + ' ' + res.last_name)
          localStorage.setItem('logged_user_contact_no', res.username)
          this.presentToast("Succesfully Updated");
          //this.navCtrl.setRoot('ProfilePage');
          this.userDetails();
          this.userService.loginStatus(true);
        },
        error => {
          console.log(error);
          this.spinnerDialog.hide();
          this.presentToast("Error in update profile");


        }
      )
    }
    else {
      this.markFormGroupTouched(this.editProfileForm)
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
    return !this.editProfileForm.get(field).valid && (this.editProfileForm.get(field).dirty || this.editProfileForm.get(field).touched);
  }

  displayFieldCss(field: string) {
    return {
      'is-invalid': this.editProfileForm.get(field).invalid && (this.editProfileForm.get(field).dirty || this.editProfileForm.get(field).touched),
      'is-valid': this.editProfileForm.get(field).valid && (this.editProfileForm.get(field).dirty || this.editProfileForm.get(field).touched)
    };
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      allowEdit: true,
      quality: 100,
      targetWidth: 500,
      targetHeight: 500,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;

      this.uploadImage();
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

   // Always get the accurate path to your apps folder
   public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
    // File name only
    var filename = this.lastImage;
    var options = {
      fileKey: "image",
      fileName: filename,
      image: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'image': filename }
    };
    console.log(options);

    const fileTransfer: TransferObject = this.transfer.create();
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });

   
    //let url = Globals.apiEndpoint + 'customer_image_upload?user_id=' + this.userId;
    //let userDeatilsUrl: string = this.woocommerceService.authenticateApi('POST', url, options);

    this.userService.uploadUserImage(this.userId,options).subscribe(
      res => {
        this.user_details = res;
        this.visible_key =true;
        this.spinnerDialog.hide();
      },
      error => {
        this.spinnerDialog.hide();
        this.visible_key =true;
      }
    )
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
