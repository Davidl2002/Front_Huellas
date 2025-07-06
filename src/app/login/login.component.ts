import { Component } from '@angular/core';
import { FingerprintService } from '../services/fingerprint.service';

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
  showRegisterForm = false;

  constructor(private fingerprintService: FingerprintService) { }

  // Registro
  showRegisterModal = false;
  registerUsername: string = '';
  capturedImages: string[] = [];

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
  }

  // Para el registro
  captureRegisterPhoto() {
    if (!this.videoElement || this.capturedImages.length >= 10) return;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    context?.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
    const photo = canvas.toDataURL('image/jpeg', 0.5);
    this.capturedImages.push(photo);
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.videoElement = null;
  }

  cancelRegistration() {
    this.showRegisterForm = false;
    this.registerUsername = '';
    this.capturedImages = [];
    this.stopCamera();
  }

  submitLogin() {
    if (!this.imageBase64) {
      alert('Primero debes capturar una imagen.');
      return;
    }

    const payload = { image: this.imageBase64 };

    this.fingerprintService.authenticateUser(payload).subscribe({
      next: (response) => {
        if (response.success) {
          this.welcomeMessage = `Bienvenido ${response.username}`;
        } else {
          alert('No se pudo autenticar. Intenta nuevamente.');
        }
      },
      error: (err) => {
        console.error('Error al autenticar:', err);
        alert('Error al autenticar. Verifica el backend.');
      }
    });
  }

  // Métodos para el modal
  openRegistration() {
    this.showRegisterModal = true;
    this.registerUsername = '';
    this.capturedImages = [];
  }

  closeRegistration() {
    this.showRegisterModal = false;
    this.stopCamera();
  }

  canSubmitRegister(): boolean {
    return this.registerUsername.trim().length > 0 && this.capturedImages.length >= 3;
  }

  submitRegistration() {
    if (!this.canSubmitRegister()) {
      alert('Por favor, completa el formulario con al menos 3 imágenes.');
      return;
    }

    const payload = {
      username: this.registerUsername,
      images: this.capturedImages
    };

    // Verifica si el JSON está bien formado
    try {
      JSON.stringify(payload); // Verifica si se puede convertir a JSON
    } catch (error) {
      console.error('Error al formar el JSON:', error);
      alert('Hubo un error al formar los datos. Por favor, verifica la entrada.');
      return;
    }

    console.log('Enviando al backend:', payload);

    this.fingerprintService.registerUser(payload).subscribe({
      next: (response) => {
        alert(`Usuario ${this.registerUsername} registrado con éxito!`);
        this.closeRegistration();
      },
      error: (err) => {
        console.error('Error registrando usuario:', err);
        alert('Error al registrar el usuario. Intenta nuevamente.');
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

  onRegisterImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0] && this.capturedImages.length < 10) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.capturedImages.push(base64);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
