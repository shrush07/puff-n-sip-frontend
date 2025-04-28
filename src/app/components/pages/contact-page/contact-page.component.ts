import { Component } from '@angular/core';

@Component({
    selector: 'app-contact-page',
    templateUrl: './contact-page.component.html',
    styleUrl: './contact-page.component.css',
    standalone: false
})



export class ContactPageComponent {

  handleSubmit = async(e:any) =>{
    // e.preventDefault();

    try {
      const response = await fetch("http://puff-n-sip.netlify.app/api/form/contact", {
        method:"POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          ratings: e.target.ratings.value,
          contact: e.target.contact.value,
          message: e.target.message.value
        })
      });

      if(response.ok){
        const data = await response.json();
        console.log(data);
        alert("Message sent successfully");
        e.target.reset();
      }

    } catch (error) {
      console.log(error);
    }
  }
}
