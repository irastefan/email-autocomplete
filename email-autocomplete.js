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
        if (domain) {
            this.input.value = this.input.value.split('@')[0] + '@' + domain;
        } else {
            if (document.querySelector(".email-placeholder") && document.querySelector(".email-placeholder").innerText) {
                this.input.value = document.querySelector(".email-placeholder").innerText;
            }
        }
        this.closeList();
    }

    isEmail() {
        if (this.input.value.indexOf('@') === -1) {
            return false;
        }
        return true;
    }

    getDomain() {
        return this.input.value.split('@')[1].toLowerCase();
    }

    getCurrentDomainList() {
        return this.domains.filter(
            domain =>
                domain.slice(0, this.getDomain().length)
                ===
                this.getDomain().toLowerCase()
        );
    }

    inputEmail() {
        this.closeList();

        if (!this.getInputValue()) {
            this.removePlaceholder();
            return false;
        }

        if (!this.isEmail()) {
            this.removePlaceholder();
            return false;
        }

        this.input.setAttribute('autocomplete', 'off');

        this.currentFocus = -1;

        if (this.getCurrentDomainList().length > 0) {

            const domainList = document.createElement('div');
            domainList.setAttribute('id', 'email-domains');
            this.input.after(domainList);

            let userDomain = this.getDomain();

            if (userDomain.length > 0) {
                this.domains.forEach(domain => {
                    if (domain.slice(0, userDomain.length) === userDomain.toLowerCase()) {
                        this.createDomainItem(domainList, domain);
                    }
                })
            } else {
                this.domains.forEach(domain => {
                    this.createDomainItem(domainList, domain);
                });
            }

            if (this.getDomain()) this.setPlaceholder();
        }
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

                if (document.querySelector('#email-domains')) {
                    document.querySelector('#email-domains').scrollTo(0, this.currentFocus * 20)
                    document.querySelectorAll('#email-domains div')[this.currentFocus].classList.add('active');
                }
            }
            //key enter / tab
            if (e.keyCode == 13 || e.keyCode == 9) {
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
        domainList.append(domainItem);

        domainItem.addEventListener('click', () => {
            this.setInputValue(domain);
        })
    }

    removePlaceholder() {
        const emailPlaceholder = document.querySelector(".email-placeholder")
        if (emailPlaceholder) {
            emailPlaceholder.remove();
        }
    }

    setPlaceholder() {
        this.removePlaceholder();
        const placeholder = document.createElement('div');
        placeholder.classList.add('email-placeholder');
        this.input.after(placeholder);

        placeholder.addEventListener('click', () => {
            this.setInputValue()
            this.input.focus()
        })

        let currentFocus;
        if (this.currentFocus !== -1) currentFocus = this.currentFocus;
        else currentFocus = 0;

        if (document.querySelectorAll('#email-domains div').length > 0) {
            const currentDomain = document.querySelectorAll('#email-domains div')[currentFocus].innerText;
            placeholder.innerHTML =
                `<span>${this.getInputValue()}</span>${currentDomain.substring(this.getInputValue().length, currentDomain.length)}`;
        }
    }

    removeActiveDomain() {
        document.querySelectorAll('#email-domains div.active').forEach(item => {
            item.classList.remove('active')
        })
    }

    closeList() {
        let domains = document.getElementById('email-domains');
        if (domains) domains.remove();
        this.removePlaceholder();
    }
}