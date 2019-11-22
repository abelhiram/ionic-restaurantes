import { Component, OnInit } from '@angular/core';
import { HomePage } from '../home/home.page';
import { AuthService } from '../auth.service'; 
import { NavController, AlertController, LoadingController, MenuController } from '@ionic/angular';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage{

  segment: string = "login";
  loading: any;
  formLogin: any = {
    email: '',
    password: '',
  };
  formRegister: any = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  }


  constructor(
    private authService: AuthService,
    public navCtrl: NavController, 
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    ) { }
    async presentLoad() { 
      this.loading = await this.loadingCtrl.create({message: 'Please wait ...'});
      this.loading.present();
    }

    ionViewDidLoad() {
      this.checkAuthenticated();
    }
  
    async checkAuthenticated () 
    {
      try {
        let isAuthenticated = await this.authService.checkIsAuthenticated();
        if ( isAuthenticated ) {
          this.menuCtrl.enable(true);
          this.navCtrl.navigateRoot('/home');
        }
      } catch (err) {
        console.log(err);
        let alert = await this.alertCtrl.create({ 'header': 'Error', message: 'Error on verify authentication info', buttons: ['Ok'] });
        alert.present();
      }
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
  
    doLogin (data: any) 
    {
      this.presentLoad();
      this.authService.login(data)
        .then((response: any) => {
          this.loading.dismiss();
          this.authService.storeCredentials(response);
          setTimeout(() => {
            this.checkAuthenticated()
          }, 750);
        })
        .catch(err => {
          this.loading.dismiss();
          
          if ( err.status == 400 ) {
            this.presentAlert( `${err.error.hint}`);
          } else if (err.status == 401) {
            this.presentAlert(`${err.error.message}`);
          } else {
            this.presentAlert('Unknow error on login');
          }
          this.presentAlert('')
        })
    }
  
    doRegister () 
    {
      this.presentLoad();
      this.authService.register(this.formRegister)
        .then((response: any) => {
          this.loading.dismiss();
          console.log(response)
          this.doLogin({
            email: this.formRegister.email,
            password: this.formRegister.password,
          });
        })
        .catch((err: any) => {
          this.loading.dismiss();
          
          if (err.status == 422) {
            
            this.presentAlert('decode error');
          } else {
            this.presentAlert('Unknow error on register');
          }
          this.presentAlert('Unknow error on register 2');
        })
    }
  
    validateLoginData (data: any) 
    {
      return true;
    }

}
