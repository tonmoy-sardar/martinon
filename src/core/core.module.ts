import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { ApiProvider } from '../core/api/api';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as ionicGalleryModal from 'ionic-gallery-modal';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
//import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FooterPage } from '../pages/include/footer/footer';
import { IonicStepperModule } from 'ionic-stepper';

//import { File } from '@ionic-native/file';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Transfer} from '@ionic-native/transfer';
import { Camera } from '@ionic-native/camera';




//services
import { UserService } from './services/user.service';
import { WoocommerceService } from './services/woocommerce.service';
import { CategoryService } from './services/category.service';
import { CartService } from './services/cart.service';
import { PaymentService } from './services/payment.service';




@NgModule({
  imports: [
    // Ionic2RatingModule 
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ionicGalleryModal.GalleryModalModule,
    IonicStepperModule
  ],
  exports: [
    // Ionic2RatingModule 
    FormsModule,
    ReactiveFormsModule,
    FooterPage,
    IonicStepperModule
  ],
  declarations: [
    //FooterPage
		
  ],
  providers: [
    ApiProvider,
    SpinnerDialog,
    File,
    Transfer,
    Camera,
    FilePath,
    // UserService,
    // WoocommerceService,
    // CategoryService,
    // CartService,
    // PaymentService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: ionicGalleryModal.GalleryModalHammerConfig,
    },
    FileTransfer,
    FileTransferObject,

    //DocumentViewer,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
// export class CoreModule {

// }
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        UserService,
        WoocommerceService,
        CategoryService,
        CartService,
        PaymentService,
      ]
    }
  }
}
