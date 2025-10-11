import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  // -----------------------------
  // Toast notifications (non-blocking)
  // -----------------------------
  toast(message: string, icon: SweetAlertIcon = 'info', timer: number = 2000) {
    Swal.fire({
      toast: true,
      position: 'top-end',         // corner position
      showConfirmButton: false,    // no OK button
      timer,
      timerProgressBar: true,
      icon,
      title: message
    });
  }

  success(message: string, p0: string, p1: () => void, timer: number = 2000) {
    this.toast(message, 'success', timer);
  }

  info(message: string, timer: number = 2000) {
    this.toast(message, 'info', timer);
  }

  warning(message: string, p0: string, p1: () => void, timer: number = 2000) {
    this.toast(message, 'warning', timer);
  }

  error(message: string, p0: string, p1: () => void, timer: number = 2000) {
    this.toast(message, 'error', timer);
  }

  // -----------------------------
  // Modal confirmation dialog (blocking)
  // -----------------------------
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

  // Input prompt (blocking)
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
