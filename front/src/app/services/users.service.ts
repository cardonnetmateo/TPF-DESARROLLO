import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SafeUser, UpdateUserRoleDto } from '../models/user';
import { environment } from '../../environments/environment';

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateEmailDto {
  newEmail: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(): Observable<SafeUser[]> {
    return this.http.get<SafeUser[]>(`${this.api}/users`);
  }

  updateRole(id: string, dto: UpdateUserRoleDto): Observable<SafeUser> {
    return this.http.patch<SafeUser>(`${this.api}/users/${id}/role`, dto);
  }

  updatePassword(dto: UpdatePasswordDto): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.api}/users/me/password`, dto);
  }

  updateEmail(dto: UpdateEmailDto): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.api}/users/me/email`, dto);
  }
}
