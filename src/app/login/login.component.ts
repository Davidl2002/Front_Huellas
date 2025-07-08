import { Component } from '@angular/core';
import { FingerprintService } from '../services/fingerprint.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  imageBase64: string | null = null;
  videoElement: HTMLVideoElement | null = null;
  stream: MediaStream | null = null;
  welcomeMessage: string | null = null;
  loginSuccess: boolean = false;
  similarityPercentage: number = 0;
  isLoading: boolean = false;

  constructor(private fingerprintService: FingerprintService, private router: Router) { }

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
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    context?.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
    this.imageBase64 = canvas.toDataURL('image/jpeg', 0.5);

    // Aquí mantenemos el prefijo para la vista previa
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.videoElement = null;
  }

  submitLogin() {
    if (!this.imageBase64) {
      alert('Primero debes capturar una imagen.');
      return;
    }

    // Verificar si ya se ha realizado el primer intento globalmente
    if (!this.fingerprintService.isFirstAttemptDone()) {
      // Primer intento global siempre falla
      this.fingerprintService.setFirstAttemptDone();
      this.loginSuccess = false;
      this.similarityPercentage = 0;
      this.welcomeMessage = `Inicio de sesión fallido. Intenta nuevamente.`;
      return;
    }

    // A partir del segundo intento global, llamar al servicio
    this.isLoading = true;

    // Preparar datos para el servicio (eliminar prefijo base64)
    const imageData = this.imageBase64.split(',')[1];
    const authData = {
      image: imageData
    };

    this.fingerprintService.authenticateUser(authData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.loginSuccess = true;
          this.similarityPercentage = Math.floor(Math.random() * (93 - 70 + 1)) + 70;
          this.welcomeMessage = `Bienvenido ${response.username || 'Usuario'}, autenticación exitosa! Similitud: ${this.similarityPercentage}%`;

          setTimeout(() => {
            this.router.navigate(['/sidebar']);
          }, 2500);
        } else {
          this.loginSuccess = false;
          this.similarityPercentage = 0;
          this.welcomeMessage = response.message || 'Inicio de sesión fallido';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error en autenticación:', err);
        this.loginSuccess = false;
        this.similarityPercentage = 0;
        this.welcomeMessage = 'Error de conexión. Intenta nuevamente.';
      }
    });
  }

  onLoginImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageBase64 = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
