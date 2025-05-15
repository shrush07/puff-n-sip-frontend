import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  // Use base API URL from environment configuration
  private readonly CONTACT_URL = `${environment.apiUrl}/api/contact`;

  constructor(private http: HttpClient) {}

  // Use typed contactData and return Observable of server response
  submitContactForm(contactData: ContactFormData): Observable<any> {
    console.log('Sending contact form data to:', this.CONTACT_URL);
    return this.http.post<any>(this.CONTACT_URL, contactData);
  }
}
