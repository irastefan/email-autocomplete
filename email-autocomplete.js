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
        this.input.value = this.input.value.split('@')[0] + '@' + domain;
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
                    })
                }
            });
        }
    }

    onKeyDown(e) {
        //key down
        if (e.keyCode == 40) {
            if (this.currentFocus < this.getCurrentDomainList().length-1) {
                this.currentFocus++;
            } else this.currentFocus = 0;
            this.removeActiveDomain();
            document.querySelectorAll('#email-domains div')[this.currentFocus].classList.add('active');
        }
        //key up
        if (e.keyCode == 38) { 
            if (this.currentFocus > 0) {
                this.currentFocus--;
                console.log(this.currentFocus)
            } else this.currentFocus = this.getCurrentDomainList().length-1;
            this.removeActiveDomain();
            document.querySelectorAll('#email-domains div')[this.currentFocus].classList.add('active');
        }
        //key enter
        if (e.keyCode == 13) {
            e.preventDefault();
            this.setInputValue(this.domains[this.currentFocus]);
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
    }
}

const inputEmail = document.querySelector(".email")

const domains = ['google.com', 'gmail.com', 'gmail1.com', 'gmail2.com', 'yahoo.com']

new EmailAutocomplete(inputEmail, domains)