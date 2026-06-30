import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);
  private usersService = inject(UsersService);
  private toast = inject(ToastService);

  resending = signal(false);

  passwordCurrent = '';
  passwordNew = '';
  passwordConfirm = '';
  passwordLoading = signal(false);

  newEmail = '';
  emailPassword = '';
  emailLoading = signal(false);

  async resend(): Promise<void> {
    this.resending.set(true);
    try {
      await firstValueFrom(this.auth.resendVerification());
      this.toast.success('Email reenviado.');
    } catch {
      this.toast.error('Error al reenviar el email.');
    } finally {
      this.resending.set(false);
    }
  }

  async changePassword(): Promise<void> {
    this.passwordLoading.set(true);
    if (this.passwordNew !== this.passwordConfirm) {
      this.toast.error('Las contraseñas nuevas no coinciden.');
      this.passwordLoading.set(false);
      return;
    }
    try {
      await firstValueFrom(this.usersService.updatePassword({
        currentPassword: this.passwordCurrent,
        newPassword: this.passwordNew,
      }));
      this.toast.success('Contraseña actualizada.');
      this.passwordCurrent = '';
      this.passwordNew = '';
      this.passwordConfirm = '';
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al cambiar la contraseña.');
    } finally {
      this.passwordLoading.set(false);
    }
  }

  async changeEmail(): Promise<void> {
    this.emailLoading.set(true);
    try {
      await firstValueFrom(this.usersService.updateEmail({
        newEmail: this.newEmail,
        password: this.emailPassword,
      }));
      this.toast.success('Email actualizado.');
      this.auth.user.update((u) => u ? { ...u, email: this.newEmail } : null);
      this.newEmail = '';
      this.emailPassword = '';
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al cambiar el email.');
    } finally {
      this.emailLoading.set(false);
    }
  }
}
