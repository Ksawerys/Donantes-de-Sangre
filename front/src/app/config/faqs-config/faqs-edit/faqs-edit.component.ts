import { Component, Input,OnChanges, SimpleChanges } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Faq } from '../../interfaces/config.interface';

@Component({
  selector: 'app-faqs-edit',
  templateUrl: './faqs-edit.component.html',
  styleUrls: ['./faqs-edit.component.scss']
})
export class FaqsEditComponent implements OnChanges {
  aviso: number;
  @Input() faqEditar: Faq;

  faqEditForm: FormGroup = new FormGroup({
    pregunta: new FormControl('', [Validators.required]),
    respuesta: new FormControl('', [Validators.required]),
  });

  constructor(private ConfigService: ConfigService) {
    this.aviso = 0;
    this.faqEditar = {
      id: "0",
      pregunta: "",
      respuesta: ""
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    this.faqEditForm.patchValue({
      id: this.faqEditar.id,
      pregunta: this.faqEditar.pregunta,
      respuesta: this.faqEditar.respuesta
    });
  }

  editarFaq() {
    if (this.faqEditForm.get("pregunta")?.value == null || this.faqEditForm.get("respuesta")?.value == null) {
      this.aviso = 1;
    } else if (this.faqEditForm.get("pregunta")!.value.trim() == "" || this.faqEditForm.get("respuesta")!.value.trim() == "") {
      this.aviso = 1;
    } else {
      this.aviso = 0;
      this.ConfigService.editarFaq(this.faqEditar.id,this.faqEditForm.get("pregunta")!.value, this.faqEditForm.get("respuesta")!.value).subscribe((res) => {
        if (res.success !== false) {
          this.ConfigService.editarFaqInterface(res.data);
          this.aviso = 2;
          this.faqEditForm.reset();

          setTimeout(() => this.aviso = 0, 3000);

        } else {
          this.aviso = 3;
          setTimeout(() => this.aviso = 0, 3000);
        }

      });
    }
  }
  limpiar() { }
}
