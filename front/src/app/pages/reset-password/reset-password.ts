import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordPage implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  token = '';
  password = '';
  confirmPassword = '';
  success = signal(false);
  error = signal('');
  loading = signal(false);

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      this.error.set('Token no encontrado en la URL.');
    }
  }

  async submit(): Promise<void> {
    this.error.set('');
    this.loading.set(true);

    if (this.password.length < 8) {
      this.error.set('La contraseña debe tener al menos 8 caracteres.');
      this.loading.set(false);
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error.set('Las contraseñas no coinciden.');
      this.loading.set(false);
      return;
    }

    try {
      await firstValueFrom(this.auth.resetPassword(this.token, this.password));
      this.success.set(true);
      this.toast.success('Contraseña actualizada.');
    } catch (err: any) {
      const msg = err.error?.message || 'Error al restablecer la contraseña.';
      this.error.set(msg);
      this.toast.error(msg);
    } finally {
      this.loading.set(false);
    }
  }
}
