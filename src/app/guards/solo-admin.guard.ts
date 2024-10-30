import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { DataAuthService } from '../services/data-auth.service';
import { inject } from '@angular/core';

export const soloAdminGuard: CanActivateFn = (route, state) => {
  const dataAuthService = inject(DataAuthService);
  const router = inject(Router);

  if (dataAuthService.usuario?.esAdmin) return true;
  const url = router.parseUrl('/login');
  return new RedirectCommand(url);
};
