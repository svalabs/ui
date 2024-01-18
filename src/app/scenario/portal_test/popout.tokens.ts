import { InjectionToken } from '@angular/core';
import { DomPortalOutlet } from '@angular/cdk/portal';

export interface PopoutData {
  modalId: string;
  windowTitle: string;
  payload: any;
}

export const POPOUT_MODAL_DATA = new InjectionToken<PopoutData>(
  'POPOUT_MODAL_DATA',
);

export enum PopoutModalName {
  'shell' = 'SHELL',
  'guacTerm' = 'GUAC_TERM',
}

export const POPOUT_MODALS: PopoutModal[] = [];

export interface PopoutModal {
  id: string;
  windowInstance: Window;
  componentInstance: any;
  outlet: DomPortalOutlet;
}
