// sweet-alert.service.ts
import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  // Generic alert
  alert(title: string, text: string, icon: SweetAlertIcon = 'info') {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'OK'
    });
  }

  // Success alert
  success(title: string, text: string) {
    return this.alert(title, text, 'success');
  }

  // Info alert
  info(title: string, text: string) {
    return this.alert(title, text, 'info');
  }

  // Warning alert
  warning(title: string, text: string) {
    return this.alert(title, text, 'warning');
  }

  // Error alert
  error(title: string, text: string) {
    return this.alert(title, text, 'error');
  }

  // Confirmation dialog
  confirm(title: string, text: string, confirmText: string = 'Yes', cancelText: string = 'No') {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText
    });
  }

  // Input prompt
  prompt(title: string, text: string, placeholder: string = '') {
    return Swal.fire({
      title,
      text,
      input: 'text',
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel'
    });
  }
}
