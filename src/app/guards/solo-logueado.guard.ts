import { CanActivateFn, RedirectCommand ,Router } from '@angular/router';
import { DataAuthService } from '../services/data-auth.service';
import { inject } from '@angular/core';

export const soloLogueadoGuard: CanActivateFn = (route, state) => {
  const dataAuthService = inject(DataAuthService);
  const router = inject(Router);

  if (dataAuthService.usuario?.token !== null) return true;
  const url = router.parseUrl('/reportes');
  return new RedirectCommand(url);
};