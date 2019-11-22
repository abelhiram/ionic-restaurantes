import { Component } from '@angular/core';
import { AlertController} from '@ionic/angular';

import { AuthService } from '../auth.service'; 
import { UserService } from '../user.service';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  loading: boolean = false;
  user: any;
  arrayPosts:any;

  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private userService: UserService,
    public http: HttpClient
  ) {
  }

  async ionViewCanEnter () {
    let isAuthenticated = await this.authService.checkIsAuthenticated();
    return isAuthenticated;
  }

  ngOnInit() {
    this.getPostss();//Llamamos a la función getPost cuando la vista se cargue
  }

  getPostss() { //llamamos a la funcion getPost de nuestro servicio.
    this.getPosts()
    .then(data => {
      this.arrayPosts = data;
    });
  }

  getPosts(){
    return new Promise(resolve=>{
      this.http.get('http://127.0.0.1:8000/api/comidas2').subscribe(data=>{
          resolve(data);
      },error=>{
        console.log(error);
      });
    });
  }

  getUser () 
  {
    this.loading = true;
    this.userService.getUserInfo()
      .then((response: any) => {
        this.loading = false;
        this.user = response;
      })
      .catch(err => {
        this.loading = false;
        this.presentAlert('Error on get user info');
      })
  }
  async presentAlert(message:any) {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

}
