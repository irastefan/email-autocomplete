class EmailAutocomplete {
    constructor(input, domains) {
        this.input = input;
        this.domains = domains;
        this.currentFocus = -1;
        this.init();
    }

    init() {
        this.input.addEventListener('input', this.inputEmail.bind(this));
        this.input.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener("click", this.closeList.bind(this));
    }

    getInputValue() {
        return this.input.value;
    }

    setInputValue(domain) {
        if (document.querySelector(".email-placeholder")) {
            this.input.value = document.querySelector(".email-placeholder").innerText;
        } else {
            if (domain) {
                this.input.value = this.input.value.split('@')[0] + '@' + domain;
            }
        }
        this.closeList();
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

    getCurrentDomainList() {
        return this.domains.filter(
            domain =>
                domain.slice(0, this.getDomain(this.getInputValue()).length)
                ===
                this.getDomain(this.getInputValue()).toLowerCase()
        );
    }

    inputEmail() {
        this.closeList();

        if (!this.getInputValue()) {
            this.removePlaceholder();
            return false;
        }

        if (!this.isEmail(this.getInputValue())) {
            this.removePlaceholder();
            return false;
        }

        this.input.setAttribute('autocomplete', 'off');

        this,this.currentFocus = -1;

        const domainList = document.createElement('div');
        domainList.setAttribute('id', 'email-domains');
        this.input.parentNode.appendChild(domainList);

        let userDomain = this.getDomain(this.getInputValue());

        if (userDomain.length > 0) {
            this.domains.forEach(domain => {
                if (domain.slice(0, userDomain.length) === userDomain.toLowerCase()) {
                    this.createDomainItem(domainList, domain);
                }
            });
        } else {
            this.domains.forEach(domain => {
                this.createDomainItem(domainList, domain);
            });
        }

        this.setPlaceholder();
    }

    onKeyDown(e) {
        if (document.querySelectorAll('#email-domains div')) {
            //key down / up
            if (e.keyCode == 40 || e.keyCode == 38) {
                if (e.keyCode == 40) {
                    if (this.currentFocus < this.getCurrentDomainList().length-1) {
                        this.currentFocus++;
                    } else this.currentFocus = 0;
                } else {
                    if (this.currentFocus > 0) {
                        this.currentFocus--;
                    } else this.currentFocus = this.getCurrentDomainList().length-1;
                }
                
                this.setPlaceholder();
    
                this.removeActiveDomain();
                document.querySelectorAll('#email-domains div')[this.currentFocus].classList.add('active');
            }
            //key enter
            if (e.keyCode == 13 || e.keyCode == 39) {
                e.preventDefault();
                this.currentFocus = -1;
                this.setInputValue(this.domains[this.currentFocus]);
                this.removePlaceholder();
            }
        }
    }

    createDomainItem(domainList, domain) {
        let domainItem = document.createElement("div");
        domainItem.innerHTML = `<span>${this.getInputValue().split('@')[0]}@</span>${domain}`;
        domainList.appendChild(domainItem);

        domainItem.addEventListener('click', () => {
            this.setInputValue(domain);
        })
    }

    removePlaceholder() {
        if (document.querySelector(".email-placeholder")) {
            document.querySelector(".email-placeholder").parentNode.removeChild(document.querySelector(".email-placeholder"));
        }
    }

    setPlaceholder() {
        this.removePlaceholder();

        const placeholder = document.createElement('div');
        placeholder.classList.add('email-placeholder');
        this.input.parentNode.appendChild(placeholder);

        let currentFocus;
        if (this.currentFocus !== -1) currentFocus = this.currentFocus;
            else currentFocus = 0;

        if (document.querySelectorAll('#email-domains div').length > 0) {
            placeholder.innerHTML = 
            `<span>${this.getInputValue()}</span>${document.querySelectorAll('#email-domains div')[currentFocus].innerText.substring(this.getInputValue().length, document.querySelectorAll('#email-domains div')[currentFocus].innerText.length)}`;
        }
    }

    removeActiveDomain() {
        document.querySelectorAll('#email-domains div.active').forEach(item => {
            item.classList.remove('active')
        })
    }

    closeList() {
        let domains = document.getElementById('email-domains');
        if (domains) domains.parentNode.removeChild(domains);
        this.removePlaceholder();
    }
}

window.addEventListener("load", () => {
    const inputEmail = document.querySelector("#billing_email")
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'aol.com', 'icloud.com']
    new EmailAutocomplete(inputEmail, domains)
})