import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FooterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-footer',
  templateUrl: 'footer.html',
})
export class FooterPage {
  isLoggedin:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FooterPage');
    if (localStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
    }
    else {
      this.isLoggedin = false;
    }
  }
  gotoPage(routePage)
  {
    this.navCtrl.push(routePage);
  }
  gotoSearchPage(routePage)
  {
    this.navCtrl.push('SearchPage', { keyword: 0 });
  }


}
