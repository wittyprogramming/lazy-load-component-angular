import {
  Compiler,
  Component,
  Injector,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  template: `
    <div style="text-align:center;margin-top: 100px;" class="content">
      <h1>Welcome to lazy loading a Component</h1>
      <button mat-raised-button color="primary" (click)="loadForm()">
        Load component form!
      </button>
      <ng-template #formComponent></ng-template>
    </div>
  `,
  styles: [],
})
export class AppComponent implements OnDestroy {
  @ViewChild("formComponent", { read: ViewContainerRef })
  formComponent!: ViewContainerRef;
  formSubmittedSubscription = new Subscription();

  constructor(private compiler: Compiler, private injector: Injector) {}

  async loadForm() {
    const { LazyFormModule } = await import("./lazy-form.component");
    const moduleFactory = await this.compiler.compileModuleAsync(
      LazyFormModule
    );
    const moduleRef = moduleFactory.create(this.injector);
    const componentFactory = moduleRef.instance.getComponent();
    this.formComponent.clear();
    const { instance } = this.formComponent.createComponent(componentFactory);
    instance.buttonTitle = "Contact Us";
    this.formSubmittedSubscription = instance.formSubmitted.subscribe(() =>
      console.log("The Form Submit Event is captured!")
    );
  }

  ngOnDestroy(): void {
    this.formSubmittedSubscription.unsubscribe();
  }
}
