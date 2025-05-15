import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Define an interface for the contact form data
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly CONTACT_URL = '/api/contact';

  constructor(private http: HttpClient) {}

  // Use typed contactData and return Observable of server response
  submitContactForm(contactData: ContactFormData): Observable<any> {
    console.log('Sending contact form data to:', this.CONTACT_URL);
    return this.http.post<any>(this.CONTACT_URL, contactData);
  }
}
