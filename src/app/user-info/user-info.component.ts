import { Component } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent {
  info = {
    fingerprintService: {
      title: 'Servicio de Autenticación de Huellas Dactilares',
      description: `El archivo fingerprint_service.py contiene el servicio que maneja la autenticación de huellas dactilares. Este servicio está basado en un modelo de red siamesa mejorada para comparar huellas y verificar la identidad de un usuario. La clase FingerprintService es responsable de registrar nuevos usuarios, autenticarlos y administrar los datos de huellas dactilares.`,
    },
    fingerprintSiameseModel: {
      title: 'Modelo Siamesa Mejorado',
      description: `El archivo fingerprint_siamese_model.py contiene la definición del modelo de red siamesa mejorado. Este modelo se utiliza para la comparación de huellas dactilares y está basado en una red neuronal convolucional (CNN) optimizada para detectar similitudes en huellas. Utiliza técnicas como la normalización, la detección de bordes y el aumento de datos para mejorar la precisión del modelo.`,
    },
    trainFingerprintModel: {
      title: 'Entrenamiento del Modelo Siamesa',
      description: `El archivo train_fingerprint_model.py contiene el proceso de entrenamiento para la red siamesa. Este archivo maneja el procesamiento de los datos del dataset, la creación de pares de imágenes, y la visualización de las métricas de entrenamiento. Utiliza TensorFlow para entrenar el modelo y generar métricas de precisión, pérdida, y otras estadísticas del modelo.`,
    },
    schemas: {
      title: 'Esquemas de Datos',
      description: `El archivo schemas.py define los esquemas de datos utilizados para las solicitudes y respuestas del sistema. Esto incluye el esquema de registro de usuarios, autenticación de huellas dactilares y detalles de los usuarios. Utiliza Pydantic para la validación y serialización de los datos.`,
    }
  };
}
