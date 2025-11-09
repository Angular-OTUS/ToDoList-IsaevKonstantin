import { Directive, ElementRef, HostListener, inject, Input, OnDestroy, Renderer2 } from "@angular/core";

type TTooltopPos = 'top' | 'bottom' | 'left' | 'right';

@Directive({
    selector: '[tooltip]',
})
export class Tooltip implements OnDestroy {
    @Input() tooltipText!: string;
    @Input() tooltipPos: TTooltopPos = "top";

    private readonly element = inject(ElementRef);
    private readonly renderer = inject(Renderer2);
    private tooltipElement?: HTMLElement;
    private tooltipArrow?: HTMLElement;

    private get isDisabled(): boolean {
        return this.element.nativeElement.classList.contains('disabled');
    }

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
        this.renderer.setStyle(this.tooltipElement, 'max-width', '220px');
        this.renderer.setStyle(this.tooltipElement, 'display', 'block');
        this.renderer.setStyle(this.tooltipElement, 'borderRadius', '5px');
        this.renderer.setStyle(this.tooltipElement, 'fontSize', '12px');
        this.renderer.setStyle(this.tooltipElement, 'pointerEvents', 'none');
        this.renderer.setStyle(this.tooltipElement, 'zIndex', '100');
        this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
        this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.3s ease-in-out');
        
        this.tooltipArrow = this.renderer.createElement('div') as HTMLElement;
        this.renderer.setStyle(this.tooltipArrow, 'position', 'absolute');
        this.renderer.setStyle(this.tooltipArrow, 'background', '#874e89ff');
        this.renderer.setStyle(this.tooltipArrow, 'pointerEvents', 'none');
        this.renderer.setStyle(this.tooltipArrow, 'zIndex', '100');
        this.renderer.setStyle(this.tooltipArrow, 'opacity', '0');
        this.renderer.setStyle(this.tooltipArrow, 'transition', 'opacity 0.5s ease-in-out');
        this.renderer.setStyle(this.tooltipArrow, 'width', '5px');
        this.renderer.setStyle(this.tooltipArrow, 'height', '5px');
        this.renderer.setStyle(this.tooltipArrow, 'transform', 'rotate(45deg)');

        setTimeout(() => {
            if (this.tooltipElement) this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
            if (this.tooltipArrow) this.renderer.setStyle(this.tooltipArrow, 'opacity', '1');
        }, 300);

        this.renderer.appendChild(document.body, this.tooltipElement);
        this.renderer.appendChild(document.body, this.tooltipArrow);

        this.setTooltipPosition(this.tooltipElement, 4);
        this.setTooltipPosition(this.tooltipArrow, 2);
    }

    private setTooltipPosition(tooltip: HTMLElement, indentation: number): void {
        const hostPos = this.element.nativeElement.getBoundingClientRect();
        let top: number;
        let left: number;
        switch (this.tooltipPos) {
            case "top":
                top = hostPos.top - window.scrollY - tooltip.offsetHeight - indentation;
                left = hostPos.left + hostPos.width / 2 - tooltip.offsetWidth / 2 + window.scrollX;
                break;
            case "bottom":
                top = hostPos.bottom + window.scrollY + indentation;
                left = hostPos.left + hostPos.width / 2 - tooltip.offsetWidth / 2 + window.scrollX;
                break;
            case "left":
                top = hostPos.top + hostPos.height / 2 - tooltip.offsetHeight / 2 + window.scrollY;
                left = hostPos.left - window.scrollX - tooltip.offsetWidth - indentation;
                break;
            case "right":
                top = hostPos.top + hostPos.height / 2 - tooltip.offsetHeight / 2 + window.scrollY;
                left = hostPos.right + window.scrollX + indentation;
                break;
            default:
                this.hideTooltip()
                return;
        }
        this.renderer.setStyle(tooltip, 'top', `${top}px`);
        this.renderer.setStyle(tooltip, 'left', `${left}px`);
    }

    private hideTooltip(): void {
        if (this.tooltipElement) {
            this.renderer.removeChild(document.body, this.tooltipElement);
            this.tooltipElement = undefined;
        }
        if (this.tooltipArrow) {
            this.renderer.removeChild(document.body, this.tooltipArrow);
            this.tooltipArrow = undefined;
        }
    }
    
}