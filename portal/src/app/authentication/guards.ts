import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenProvider } from '../shared/token.provider';

export const isAuthenticated: CanActivateFn = (route, state) => {
  const tokenProvider = inject(TokenProvider);
  const router = inject(Router);

  if (tokenProvider.hasToken() && tokenProvider.isTokenStillAlive())
    return true;

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
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
