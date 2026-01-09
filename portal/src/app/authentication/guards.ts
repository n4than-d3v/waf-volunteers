import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenProvider } from '../shared/token.provider';

export const isAuthenticated: CanActivateFn = () => {
  const tokenProvider = inject(TokenProvider);
  return tokenProvider.hasToken() && tokenProvider.isTokenStillAlive();
};

export const isAdmin: CanActivateFn = () => {
  const tokenProvider = inject(TokenProvider);
  return tokenProvider.isAdmin();
};

export const isClocking: CanActivateFn = () => {
  const tokenProvider = inject(TokenProvider);
  return tokenProvider.isClocking();
};

export const isBoards: CanActivateFn = () => {
  const tokenProvider = inject(TokenProvider);
  return tokenProvider.isBoards();
};

export const isVet: CanActivateFn = () => {
  const tokenProvider = inject(TokenProvider);
  return tokenProvider.isVet() || tokenProvider.isAdmin();
};

export const isVetOrAux: CanActivateFn = () => {
  const tokenProvider = inject(TokenProvider);
  return (
    tokenProvider.isVet() ||
    tokenProvider.isAuxiliary() ||
    tokenProvider.isAdmin()
  );
};

export const isOrphanFeeder: CanActivateFn = () => {
  const tokenProvider = inject(TokenProvider);
  return tokenProvider.isOrphanFeeder();
};

export const isAuxiliary: CanActivateFn = () => {
  const tokenProvider = inject(TokenProvider);
  return tokenProvider.isAuxiliary() || tokenProvider.isAdmin();
};
