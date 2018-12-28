import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

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
  user: 'hassan'
  pass: '123'
  stops: any[] = []
  routes: any [] = []
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: FirebaseProvider,
    public loader:LoadingController, public alert:AlertController) {
      let l = this.loader.create({content:'Loading...'})
      l.present()
  
      this.fb.firebase().database().ref('Routes').once('value',(data)=>{
        this.routes = data.val()
        this.routes.splice(0,1);
      }).then(() => l.dismiss())
  }

  loadMap(route) {
    console.log(route);
    let l = this.loader.create({content:'Loading...'})
    l.present()

    var t = ''
    t = route['waypoints']
    var len = t.split(',')
    var count = 0
    len.forEach((item) => {
      this.fb.firebase().database().ref('Stops/' + item).once('value', (d) => {
        this.stops.push({ lat: d.val()['lat'], lng: d.val()['lng'] })
      }).then(() => {
        if (++count == len.length) {
          l.dismiss()
          this.navCtrl.setRoot('MapPage', { origin: route['origin'], destination: route['destination'], stops: this.stops ,bus:route['bus']})
        }
      })
    })

    // this.fb.firebase().database().ref('Students').set({
    //   "hassan":{
    //     "name":"Hassan Ali",
    //     "number":"03134698550",
    //     "address":"363 E1 Johar Town",
    //     "location":{"lat": "31.469374", "lng": "74.290879"},
    //     "password":"123",
    //     "route":"1"
    //   }
    // })

  }
}
