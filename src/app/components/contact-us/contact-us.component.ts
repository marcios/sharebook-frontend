import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import * as AppConst from '../../core/utils/app.const';
import {ContactUsService} from '../../core/services/contact-us/contact-us.service';
import {ToastrService} from 'ngx-toastr';
import {SeoService} from '../../core/services/seo/seo.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})

export class ContactUsComponent implements OnInit {
  formGroup: FormGroup;
  isSent: Boolean;
  isLoading: Boolean = false;
  pageTitle: string;

  constructor(private _formBuilder: FormBuilder, private _scContactUs: ContactUsService,
              private _toastr: ToastrService, private seo: SeoService) {
    this.createFormGroup();
  }

  ngOnInit() {
    // TODO: receber mensagem por query string, pra integrar com outras pages.
    this.seo.generateTags({
      title: 'Fale Conosco',
      description: 'Fale Conosco para tirar duvidas, sugestões, apoiar o projeto.',
      image: 'https://www.sharebook.com.br/assets/img/sharebook-share.png',
      slug: 'fale-conosco'
    });
  }

  createFormGroup() {
    this.formGroup = this._formBuilder.group({
      id: '',
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.pattern(AppConst.emailPattern)]],
      phone: ['', [Validators.pattern(AppConst.phonePattern)]],
      message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(512)]],
      recaptchaReactive: new FormControl(null, Validators.required)
    });
  }

  onContactUs() {
    if (this.formGroup.valid) {
      this.isLoading = true;
      if (!this.formGroup.value.id) {
        this._scContactUs.contactUs(this.formGroup.value).subscribe(resp => {
          if (resp.success) {
            this.isSent = true;
            this._toastr.success('Mensagem enviada com sucesso!');
            this.pageTitle = 'Obrigado por entrar em contato! ^^ ';
          } else {
            this._toastr.error(resp.messages[0]);
          }
          this.isLoading = false;
        });
      }
    }
  }
}




