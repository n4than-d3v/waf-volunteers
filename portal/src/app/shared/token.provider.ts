import { Injectable } from '@angular/core';

export enum Roles {
  Volunteer = 1,
  Reception = 2,
  TeamLeader = 4,
  Vet = 8,
  Admin = 16,
}

export enum Status {
  Active = 0,
  Inactive = 1,
}

export interface Session {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string;
  exp: number;
}

@Injectable()
export class TokenProvider {
  private readonly LS_KEY = 'token';

  public getToken() {
    return localStorage.getItem(this.LS_KEY);
  }

  public setToken(token: string) {
    localStorage.setItem(this.LS_KEY, token);
  }

  public getSession() {
    const token = this.getToken();
    if (!token) return null;

    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;

    try {
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson) as Session;
    } catch (e) {
      return null;
    }
  }

  public hasToken() {
    return !!this.getToken();
  }

  public isTokenStillAlive() {
    const session = this.getSession();
    if (!session) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime < session.exp;
  }

  public isAdmin() {
    const session = this.getSession();
    if (!session) return false;

    return !!(Number(session.roles) & Roles.Admin);
  }
}
