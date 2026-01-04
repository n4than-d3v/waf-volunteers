import { Injectable } from '@angular/core';

export enum Roles {
  None = 0,

  BEACON_ANIMAL_HUSBANDRY = 1,
  BEACON_RECEPTIONIST = 2,
  BEACON_TEAM_LEADER = 4,
  BEACON_VET = 8,
  BEACON_VET_NURSE = 16,
  BEACON_AUXILIARY = 32,
  BEACON_WORK_EXPERIENCE = 64,
  BEACON_ORPHAN_FEEDER = 128,
  BEACON_RESCUER = 256,
  BEACON_CENTRE_MAINTENANCE = 512,
  BEACON_OFFICE_ADMIN = 1024,

  APP_ADMIN = 2048,
  APP_CLOCKING = 4096,
}

export enum Status {
  Active = 0,
  Inactive = 1,
}

const roleEnumToLabel = (value: string): string => {
  return value
    .toLowerCase() // beacon_animal_husbandry
    .split('_') // ["beacon", "animal", "husbandry"]
    .slice(1) // remove BEACON
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' '); // "Animal Husbandry"
};

export const roleList = Object.keys(Roles)
  .filter((key) => isNaN(Number(key)))
  .map((key) => ({
    name: key,
    display: roleEnumToLabel(key),
    value: Roles[key as keyof typeof Roles],
  }));

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

    return !!(Number(session.roles) & Roles.APP_ADMIN);
  }

  public isClocking() {
    const session = this.getSession();
    if (!session) return false;

    return !!(Number(session.roles) & Roles.APP_CLOCKING);
  }

  public isVet() {
    const session = this.getSession();
    if (!session) return false;

    return (
      !!(Number(session.roles) & Roles.BEACON_VET) ||
      !!(Number(session.roles) & Roles.BEACON_VET_NURSE)
    );
  }

  public isAuxiliary() {
    const session = this.getSession();
    if (!session) return false;

    return !!(Number(session.roles) & Roles.BEACON_AUXILIARY);
  }
}
