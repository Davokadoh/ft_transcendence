var count = 0;

class Counter extends HTMLElement {
	constructor() {
		super();

        this.innerHTML = /*html*/`
            <button>Clicks : ${count}</button>
        `;

        let btn = this.querySelector("button");

        // State
        btn.onclick = () => {
            btn.innerHTML = "Clicks : " + ++count;
        };
	}
}

customElements.define("click-counter", Counter);
