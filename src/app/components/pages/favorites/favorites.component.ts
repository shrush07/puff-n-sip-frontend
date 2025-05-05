import { Component } from '@angular/core';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {

  getImageUrl(imageFileName: string): string {
    const backendUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000' 
      : 'https://puff-sip.onrender.com';
  
    // Remove 'assets/images/' or 'assets/' if present at the start of the path
    const cleanedFileName = imageFileName.replace(/^assets\/images\//, '').replace(/^assets\//, '');
  
    // Return the URL without the 'assets/images/' prefix
    return `${backendUrl}/images/${cleanedFileName}`;
  }


}
