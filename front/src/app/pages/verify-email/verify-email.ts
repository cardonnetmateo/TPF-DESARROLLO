import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  success = signal(false);
  error = signal('');

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.error.set('Token no encontrado en la URL.');
      return;
    }

    try {
      await firstValueFrom(this.auth.verifyEmail(token));
      this.success.set(true);
      this.toast.success('Email verificado correctamente.');
    } catch (err: any) {
      const msg = err.error?.message || 'Token inválido o expirado.';
      this.error.set(msg);
      this.toast.error(msg);
    }
  }
}
