import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  ApplicationRef,
  ComponentRef,
  Type,
} from '@angular/core';
import {
  DomPortalOutlet,
  PortalInjector,
  ComponentPortal,
} from '@angular/cdk/portal';
import {
  PopoutData,
  POPOUT_MODALS,
  POPOUT_MODAL_DATA,
  PopoutModal,
} from './popout.tokens';

@Injectable({ providedIn: 'root' })
export class PopoutService {
  private styleSheetElement: HTMLLinkElement;

  constructor(
    private injector: Injector,
    private comoponentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
  ) {}

  openOrFocusModal<T>(
    component: Type<T>,
    modalData: PopoutData,
    isSame?: (component: any) => boolean,
  ): void {
    if (!this.isPopoutWindowOpen(modalData.modalId)) {
      console.log(`Opening new modal for ${modalData.modalId}`);
      this.openPopoutModal(component, modalData);
    } else {
      console.log(`Using existing modal for ${modalData.modalId}`);
      const existingModal = this.getModal(modalData.modalId);
      const shouldReload = isSame
        ? !isSame(existingModal?.componentInstance)
        : true;

      if (shouldReload && existingModal) {
        existingModal?.outlet.detach();
        const injector = this.createInjector(modalData);
        const componentInstance = this.attachContainer(
          component,
          existingModal.outlet,
          injector,
        );
        existingModal.componentInstance = componentInstance;
      }
      this.focusPopoutWindow(modalData.modalId);
    }
  }

  createInjectionData<T>(
    modalId: string,
    windowTitle: string,
    payload: T,
  ): PopoutData {
    return {
      modalId: modalId,
      windowTitle: windowTitle,
      payload: payload,
    };
  }

  closePopoutModals(): void {
    POPOUT_MODALS.forEach((modal) => {
      if (modal.windowInstance) {
        modal.windowInstance.close();
      }
    });
    POPOUT_MODALS.splice(0, POPOUT_MODALS.length);
  }

  private openPopoutModal<T>(component: Type<T>, data: PopoutData): void {
    const windowInstance = this.openOnce(
      'assets/modal/popout.html',
      data.modalId,
    );

    // Wait for window instance to be created
    setTimeout(() => {
      if (windowInstance) {
        this.createCDKPortal(component, data, windowInstance);
      }
    }, 1000);
  }

  private getModal(id: string): PopoutModal | undefined {
    return POPOUT_MODALS.find((modal) => modal.id === id);
  }

  private isModalCreated(id: string): boolean {
    return POPOUT_MODALS.some((modal) => modal.id === id);
  }

  private createInjector(data: PopoutData): PortalInjector {
    const injectionTokens = new WeakMap();
    injectionTokens.set(POPOUT_MODAL_DATA, data);
    return new PortalInjector(this.injector, injectionTokens);
  }

  private attachContainer<T>(
    component: Type<T>,
    outlet: DomPortalOutlet,
    injector: PortalInjector,
  ): T {
    const containerPortal = new ComponentPortal(component, null, injector);
    const containerRef: ComponentRef<T> = outlet.attach(containerPortal);
    return containerRef.instance;
  }

  private isPopoutWindowOpen(id: string): boolean {
    const modal = this.getModal(id);
    return !!(modal && modal.windowInstance && !modal.windowInstance.closed);
  }

  private focusPopoutWindow(id: string): void {
    this.getModal(id)?.windowInstance.focus();
  }

  private openOnce(url: string, target: string): Window | null {
    // open a blank "target" windowInstance
    // or gtet the reference to the existing "target" window
    const winRef = window.open('', target, ''); // Add height and width as features to force new Window. i.e.'height=600,width=400'
    // if the "target" window was just opened, change its url
    if (winRef?.location.href === 'about:blank') {
      winRef.location.href = url;
    }
    return winRef;
  }

  private createCDKPortal<T>(
    component: Type<T>,
    data: PopoutData,
    windowInstance: Window,
  ): void {
    console.log(`Creating portal for ${data.modalId}`);
    if (windowInstance) {
      windowInstance.document.body.innerText = '';
      // Create a portal outlet with the body of the new window document
      const outlet = new DomPortalOutlet(
        windowInstance.document.body,
        this.comoponentFactoryResolver,
        this.applicationRef,
        this.injector,
      );

      // Copy styles from parent window
      document.querySelectorAll('style').forEach((htmlElement) => {
        windowInstance.document.head.appendChild(htmlElement.cloneNode(true));
      });
      // Copy stylesheet link from parent windowInstance
      this.styleSheetElement = this.getStyleSheetElement();
      windowInstance.document.head.appendChild(this.styleSheetElement);

      this.styleSheetElement.onload = () => {
        console.log('Loading stylesheet');
        // Clear popout modal content
        windowInstance.document.body.innerText = '';

        // Create an injector with modal data
        const injector = this.createInjector(data);

        // Attach the Portal
        windowInstance.document.title = data.windowTitle;
        const componentInstance = this.attachContainer(
          component,
          outlet,
          injector,
        );

        if (this.isModalCreated(data.modalId)) {
          const modal = this.getModal(data.modalId);
          if (modal) {
            modal.windowInstance = windowInstance;
            modal.componentInstance = componentInstance;
            modal.outlet = outlet;
          }
        } else {
          POPOUT_MODALS.push({
            id: data.modalId,
            windowInstance: windowInstance,
            componentInstance: componentInstance,
            outlet: outlet,
          });
        }
      };
    }
  }

  private getStyleSheetElement(): HTMLLinkElement {
    const styleSheetElement = document.createElement('link');
    document.querySelectorAll('link').forEach((htmlElement) => {
      if (htmlElement.rel === 'stylesheet') {
        const absoluteUrl = new URL(htmlElement.href).href;
        styleSheetElement.rel = 'stylesheet';
        styleSheetElement.href = absoluteUrl;
      }
    });
    return styleSheetElement;
  }
}
