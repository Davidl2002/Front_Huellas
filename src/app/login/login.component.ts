import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  imageBase64: string | null = null;
  videoElement: HTMLVideoElement | null = null;
  stream: MediaStream | null = null;
  welcomeMessage: string | null = null; // Para mostrar el mensaje de bienvenida

  startCamera() {
    const video = document.createElement('video');
    this.videoElement = video;
    video.setAttribute('autoplay', 'true');

    const constraints = {
      video: { facingMode: 'environment' }
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          this.stream = stream;
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
          };
        })
        .catch((error) => {
          console.error('Error al acceder a la cámara', error);
        });
    }
  }

  capturePhoto() {
    if (!this.videoElement) return;
    const video = this.videoElement;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageBase64 = canvas.toDataURL('image/jpeg', 0.5);
    }
  }

  stopCamera() {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach(track => track.stop());
      this.stream = null;
    }
  }

  submitLogin() {
    // Simulamos una autenticación exitosa
    console.log('Foto enviada al backend: ', this.imageBase64);

    // Aquí puedes simular el backend respondiendo correctamente
    setTimeout(() => {
      this.welcomeMessage = 'Bienvenido David López';
    }, 1000); // simula un pequeño retraso de red
  }
}
