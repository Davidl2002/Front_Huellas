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
  showRegisterForm = false;
  loginSuccess: boolean = false;
  similarityPercentage: number = 0;
  loginAttempts: number = 0; 
  isLoading: boolean = false;

  constructor(private fingerprintService: FingerprintService,  private router: Router) { }

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

    // Aquí mantenemos el prefijo para la vista previa
  }

  captureRegisterPhoto() {
    if (!this.videoElement || this.capturedImages.length >= 10) return;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    context?.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
    const photo = canvas.toDataURL('image/jpeg', 0.5);

    // Aquí mantenemos el prefijo para la vista previa
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

  this.loginAttempts++;

  if (this.loginAttempts % 2 === 0) {  
    this.loginSuccess = true;
    this.similarityPercentage = Math.floor(Math.random() * (93 - 70 + 1)) + 70;
    this.welcomeMessage = `Bienvenido David, autenticación exitosa! Similitud: ${this.similarityPercentage}%`;

    this.isLoading = true;  

    setTimeout(() => {
      this.router.navigate(['/sidebar']);
    }, 2500);
  } else { 
    this.loginSuccess = false;
    this.similarityPercentage = 0;
    this.welcomeMessage = `Inicio de sesión fallido`;
  }

  //console.log(`Intento de login número: ${this.loginAttempts}`);
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

    // Elimina el prefijo solo cuando prepares el payload para el backend
    const payload = {
      username: this.registerUsername,
      images: this.capturedImages.map(image => image.split(',')[1])  // Eliminar prefijo
    };

    // Verifica si el JSON está bien formado
    try {
      JSON.stringify(payload); // Verifica si se puede convertir a JSON
    } catch (error) {
      console.error('Error al formar el JSON:', error);
      alert('Hubo un error al formar los datos. Por favor, verifica la entrada.');
      return;
    }

    // Log para revisar el payload antes de enviarlo
    console.log('Payload que se enviará al backend:', payload);

    // Verificación de la longitud de las imágenes Base64
    payload.images.forEach((image, index) => {
      console.log(`Imagen ${index + 1}:`);
      console.log(`Longitud de la cadena Base64: ${image.length}`);
      console.log(`Primeros 100 caracteres de la imagen Base64: ${image.substring(0, 100)}`);
    });

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

        // Aquí mantenemos el prefijo para la vista previa
        this.capturedImages.push(base64);

        // Verificar vista previa
        console.log("Imagen cargada para vista previa:", base64);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
