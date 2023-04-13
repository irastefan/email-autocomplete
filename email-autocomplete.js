class EmailAutocomplete {
    constructor(input, domains) {
        this.input = input;
        this.domains = domains;
        this.init();
    }

    init() {
        this.input.addEventListener('input', this.inputEmail.bind(this))

        document.addEventListener("click", this.closeList.bind(this));
    }

    getInputValue() {
        return this.input.value;
    }

    setInputValue(domain) {
        this.input.value = this.input.value.split('@')[0] + '@' + domain;
    }

    isEmail(input) {
        if (input.indexOf('@') === -1) {
            return false;
        }
        return true;
    }

    getDomain(input) {
        return input.split('@')[1].toLowerCase();
    }

    inputEmail() {
        this.closeList();

        if (!this.getInputValue()) {
            return false;
        }

        if (!this.isEmail(this.getInputValue())) {
            return false;
        }

        const domainList = document.createElement('div');
        domainList.setAttribute('id', 'email-domains');
        this.input.parentNode.appendChild(domainList);

        let userDomain = this.getDomain(this.getInputValue());

        if (userDomain.length > 0) {
            this.domains.forEach(domain => {
                if (domain.slice(0, userDomain.length) === userDomain.toLowerCase()) {
                    let domainItem = document.createElement("DIV");
                    domainItem.innerHTML += domain;
                    domainList.appendChild(domainItem);

                    domainItem.addEventListener('click', () => {
                        this.setInputValue(domainItem.innerText); 
                        this.closeList();
                    })
                }
            });
        }
    }

    closeList() {
        let domains = document.getElementById('email-domains');
        if (domains)
            domains.parentNode.removeChild(domains);
    }
}

const inputEmail = document.querySelector(".email")
const domains = ['google.com', 'gmail.com', 'yahoo.com']

new EmailAutocomplete(inputEmail, domains)