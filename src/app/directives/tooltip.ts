import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from "@angular/core";

type TTooltopPos = 'top' | 'bottom' | 'left' | 'right';

@Directive({
    selector: '[tooltip]',
})
export class Tooltip implements OnDestroy {
    @Input() tooltipText!: string;
    @Input() tooltipPos: TTooltopPos = "top";

    private tooltipElement?: HTMLElement;

    private get isDisabled(): boolean {
        return this.element.nativeElement.classList.contains('disabled');
    }

    constructor(private element: ElementRef, private renderer: Renderer2) {}

    ngOnDestroy(): void {
        this.hideTooltip();
    }

    @HostListener('mouseenter') onMouseEnter(): void {
        this.createTooltip();
    }

    @HostListener('mouseleave') onMouseLeave(): void {
        this.hideTooltip();
    }

    @HostListener('click') onMouseClick(): void {
        this.hideTooltip();
    }


    private createTooltip() {
        if (!this.tooltipText || this.isDisabled) return;
        this.tooltipElement = this.renderer.createElement('span') as HTMLElement;
        this.tooltipElement.innerText = this.tooltipText;
        this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
        this.renderer.setStyle(this.tooltipElement, 'background', '#874e89ff');
        this.renderer.setStyle(this.tooltipElement, 'color', '#fff');
        this.renderer.setStyle(this.tooltipElement, 'padding', '4px 8px');
        this.renderer.setStyle(this.tooltipElement, 'borderRadius', '5px');
        this.renderer.setStyle(this.tooltipElement, 'fontSize', '12px');
        this.renderer.setStyle(this.tooltipElement, 'pointerEvents', 'none');
        this.renderer.setStyle(this.tooltipElement, 'zIndex', '100');
        this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
        this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.3s ease-in-out');
        setTimeout(() => {
            if (this.tooltipElement) this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
        }, 300);
        this.renderer.appendChild(document.body, this.tooltipElement);
        this.setTooltipPosition(this.tooltipElement);
    }

    private setTooltipPosition(tooltipElement: HTMLElement): void {
        const hostPos = this.element.nativeElement.getBoundingClientRect();
        let top: number;
        let left: number;
        switch (this.tooltipPos) {
            case "top":
                top = hostPos.top - window.scrollY - tooltipElement.offsetHeight - 2;
                left = hostPos.left + hostPos.width / 2 - tooltipElement.offsetWidth / 2 + window.scrollX;
                break;
            case "bottom":
                top = hostPos.bottom + window.scrollY + 2;
                left = hostPos.left + hostPos.width / 2 - tooltipElement.offsetWidth / 2 + window.scrollX;
                break;
            case "left":
                top = hostPos.top + hostPos.height / 2 - tooltipElement.offsetHeight / 2 + window.scrollY;
                left = hostPos.left - tooltipElement.offsetWidth - window.scrollX - 2;
                break;
            case "right":
                top = hostPos.top + hostPos.height / 2 - tooltipElement.offsetHeight / 2 + window.scrollY;
                left = hostPos.right + window.scrollX + 2;
                break;
            default:
                this.hideTooltip()
                return;
        }
        this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
        this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
    }

    private hideTooltip(): void {
        if (this.tooltipElement) {
            this.renderer.removeChild(document.body, this.tooltipElement);
            this.tooltipElement = undefined;
        }
    }
    
}