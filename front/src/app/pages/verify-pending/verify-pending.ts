import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-pending',
  imports: [RouterLink],
  templateUrl: './verify-pending.html',
  styleUrl: './verify-pending.css',
})
export class VerifyPendingPage {
  private auth = inject(AuthService);
  sent = signal(false);
  sending = signal(false);

  async resend(): Promise<void> {
    this.sending.set(true);
    try {
      await firstValueFrom(this.auth.resendVerification());
      this.sent.set(true);
    } catch {
      alert('Error al reenviar el email. Iniciá sesión e intentá de nuevo.');
    } finally {
      this.sending.set(false);
    }
  }
}
