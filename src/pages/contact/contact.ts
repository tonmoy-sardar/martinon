import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

declare var google;
/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
  ) {
  }

  ionViewDidLoad() {
    this.menuCtrl.close();
    this.loadMap();
  }

  loadMap() {

    let latLng = new google.maps.LatLng(26.540457, 88.719391);
    let mapOptions = {
      center: latLng,
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    var locations = [
      ['Mumbai', 19.076090, 72.877426, 4],
      ['Karnataka', 14.167040, 75.040298, 5],
      ['West Bengal', 26.540457, 88.719391, 3],
      ['Jharkhand', 24.633568, 87.849251, 2]
    ];
    var marker, i;
    var infowindow = new google.maps.InfoWindow();
    for (i = 0; i < locations.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: this.map
      });

      google.maps.event.addListener(marker, 'click', (function (marker, i) {
        return function () {
          infowindow.setContent(locations[i][0]);
          infowindow.open(this.map, marker);
        }
      })(marker, i));
    }

  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

}
