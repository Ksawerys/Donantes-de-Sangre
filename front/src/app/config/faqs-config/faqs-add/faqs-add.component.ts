import { Component } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-faqs-add',
  templateUrl: './faqs-add.component.html',
  styleUrls: ['./faqs-add.component.scss']
})
export class FaqsAddComponent {
  aviso: number;

  faqForm: FormGroup = new FormGroup({
    pregunta: new FormControl('', [Validators.required]),
    respuesta: new FormControl('', [Validators.required]),
  });

  constructor(private ConfigService: ConfigService) {
    this.aviso = 0;
  }
  limpiar() {
    this.faqForm.reset();
    this.aviso = 0;
  }

  addFaq() {
    if (this.faqForm.get("pregunta")?.value == null || this.faqForm.get("respuesta")?.value == null) {
      this.aviso = 1;
    } else if (this.faqForm.get("pregunta")!.value.trim() == "" || this.faqForm.get("respuesta")!.value.trim() == "") {
      this.aviso = 1;
    } else {
      this.aviso = 0;
      this.ConfigService.addFaq(this.faqForm.get("pregunta")!.value, this.faqForm.get("respuesta")!.value).subscribe((res) => {
        if (res.success !== false) {
          this.ConfigService.addFaqInterface(res.data);
          this.aviso = 2;
          this.faqForm.reset();

          setTimeout(() => this.aviso = 0, 3000);

        } else {
          this.aviso = 3;
          setTimeout(() => this.aviso = 0, 3000);
        }

      });
    }
  }
}
