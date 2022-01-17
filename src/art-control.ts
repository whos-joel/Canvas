export default class ArtControl extends HTMLElement {
    _root: ShadowRoot;
    $valueInput: HTMLInputElement;
    $minInput: HTMLInputElement;
    $maxInput: HTMLInputElement;
    _value: number;

    template = `
    <style>
        :host {
            display: block;
            box-sizing: border-box;
        }       
        
        .container {                  
          color: var(--star-default-color, #c5c5c5);
          font-size: 1em;
          line-height: 1em;
          margin: 0 auto;
          position: relative;
          padding: 0;
          cursor: pointer;
        }  
        
        input{
            background-color: #333;
            border: solid 1px #c5c5c5;
            padding: 5px;
            color: #c5c5c5
        }
    </style>
    <div class="container">
        <div class="value">
            <label></label>
            <input type="number">
        </div>
        <div class="min">
            <label for='min'>Min</label>
            <input type="number">              
        </div>
        <div class="max">
            <label for='min'>Max</label>
            <input type="number">              
        </div>
    </div>`;

    constructor() {
        super();
        // Shadow Root
        this._root = this.attachShadow({ mode: "open" });
    }

    get value(){
        return this._value;
    }

    set value(val:number){
        this.$valueInput.value = val.toString();
    }

    connectedCallback() {
        this._root.innerHTML = this.template;

        this.$valueInput = this.setupInput(this._root.querySelector(`.value input`), "value", "value", this.getAttribute('label'));
        this.$minInput = this.setupInput(this._root.querySelector(`.min input`), "min", "min", "Min");
        this.$minInput = this.setupInput(this._root.querySelector(`.max input`), "max", "max", "Max");
        
        const initValue = this.getAttribute('value');
        if(initValue !== null){
            this.value = parseInt(initValue);
        }

        //this.setupEvents();
    }

    setupInput(input:HTMLInputElement, container:string, inputId:string, labelText:string ) : HTMLInputElement{
        
        input.id = this.createElementId(inputId);

        let label = this._root.querySelector(`.${container} label`) as HTMLLabelElement;
        label.htmlFor = input.id;
        label.innerHTML = labelText;

        input.addEventListener("change", (event) => {
            this.dispatchEvent(new CustomEvent(`${inputId}Change`, {detail : (event.target as HTMLInputElement).value}));
        });

        return input;
    }

    setupEvents(){
        this.$valueInput.addEventListener("change", (event) => {
            this.dispatchEvent(new CustomEvent("valueChange", {detail : (event.target as HTMLInputElement).value}));
        });
    }

    createElementId(id:string){
        return `${this.id}-id`;
    }
}

window.customElements.define("wj-art-control", ArtControl);