import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);
  resending = signal(false);

  async resend(): Promise<void> {
    this.resending.set(true);
    try {
      await firstValueFrom(this.auth.resendVerification());
      alert('Email reenviado. Revisá tu bandeja de entrada.');
    } catch {
      alert('Error al reenviar el email. Intentá de nuevo más tarde.');
    } finally {
      this.resending.set(false);
    }
  }
}
