import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand ,Router } from '@angular/router';
import { DataAuthService } from '../services/data-auth.service';

export const soloPublicoGuard: CanActivateFn = (route, state) => {
    const dataAuthService = inject(DataAuthService);
    const router = inject(Router)
    if (!dataAuthService.usuario?.token) return true;
    const url = router.parseUrl('/parking-status');
    return new RedirectCommand(url);
};