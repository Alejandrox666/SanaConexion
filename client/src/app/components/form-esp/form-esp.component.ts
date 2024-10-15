import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-esp',
  templateUrl: './form-esp.component.html',
  styleUrls: ['./form-esp.component.css']
})
export class FormEspComponent {

  constructor(private router:Router){}

  goToComponent() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}
