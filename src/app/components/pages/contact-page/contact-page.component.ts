import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ContactService } from '../../../services/contact.service';

@Component({
    selector: 'app-contact-page',
    templateUrl: './contact-page.component.html',
    styleUrl: './contact-page.component.css',
    standalone: false
})



export class ContactPageComponent {

  http: any;
  messageSent = false;
  errorMessage = '';

  constructor(
      private contactService: ContactService
    ) {}

   onSubmit(form: NgForm): void {
      if (form.invalid) return;
  
      this.contactService.submitContactForm(form.value).subscribe({
        next: (res) => {
          this.messageSent = true;
          this.errorMessage = '';
          form.resetForm();
          console.log('Contact form submitted successfully:', res);
        },
        error: (err) => {
          this.messageSent = false;
          this.errorMessage = err?.error?.message || 'Submission failed. Please try again.';
          console.error('Error submitting contact form:', err);
        },
      });
    }
}
