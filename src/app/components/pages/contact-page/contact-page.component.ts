import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ContactService } from '../../../services/contact.service';
import { ToastrService } from 'ngx-toastr';

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
      private contactService: ContactService,
    private toastr: ToastrService
    ) {}

   onSubmit(form: NgForm): void {
      if (form.invalid) return;
  
      this.contactService.submitContactForm(form.value).subscribe({
      next: (res) => {
        this.messageSent = true;
        this.errorMessage = '';
        this.toastr.success('Message sent successfully!');
        form.resetForm();
        console.log('Contact form submitted successfully:', res);
      },
      error: (err) => {
        this.messageSent = false;
        const message = err?.error?.message || 'Submission failed. Please try again.';
        this.toastr.error(message);
        console.error('Error submitting contact form:', err);
      },
      });
    }
}
