import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { ApiServiceService } from '../api-service.service';
import {log} from 'util';
import { AuthenticationService } from '../_services/AuthenticationService';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formData;
  token;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  failedLogin = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

    // /*Login form validation*/
    // this.formData = new FormGroup({
    //   email: new FormControl('', Validators.compose([
    //     Validators.required,
    //     Validators.pattern('[^ @]*@[^ @]*')
    //   ])),
    //   password: new FormControl('', Validators.compose([
    //     Validators.required
    //   ]))
    // });
  }
  get f() { return this.loginForm.controls; }

  // clearForm(error) {
  //   console.log(error);
  //   this.error = true;
  //   this.formData.get('password').setValue('');
  // }
  onClickSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    // this.loading = true;
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          // this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          // this.loading = false;
          this.failedLogin = true;
        });
    // if (this.formData.invalid) {
    //   this.formData.get('email').markAsTouched();
    //   this.formData.get('password').markAsTouched();
    // } else {
    //   this.apiService.authenticate(this.formData.value).subscribe(
    //     token => this.token = token,
    //     error => this.clearForm(error),
    //     () => console.log(this.token)
    //   );
    // }
  }
}
