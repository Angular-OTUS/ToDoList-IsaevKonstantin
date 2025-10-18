import { Component, Input } from "@angular/core";
import { TuiLoader, tuiLoaderOptionsProvider } from "@taiga-ui/core";

@Component({
    selector: 'ui-spinner',
    imports: [TuiLoader],
    template: `<tui-loader [inheritColor]="inheritColor" />`,
    providers: [
        tuiLoaderOptionsProvider({
        size: 'l',
        inheritColor: false,
        overlay: true,
        }),
    ],
})
export class UiSpinner {
    @Input() inheritColor = true;
}