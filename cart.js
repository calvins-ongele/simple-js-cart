class Cart {
    constructor(name) {
        this.name = name;
    }
    //# 1. retries cart data from backend  ... returns {total:count, cart:data}
    async get() {
        const cookie_id = this.getCookie;
        const response = await fetch("/myapp/fetch-cart", {
            method:"POST", body:JSON.stringify({cookie_id})
        });

        const cart = await response.json();

        return cart;
    }
    //# 2. send new/update cart data to backend  ... returns {total:count, cart:data}
    async send(item_id) {
        
        const cookie_id = this.getCookie;
        const response = await fetch("/myapp/save-cart", {
            method:"POST", body:JSON.stringify({
                cookie_id, item_id
            })
        });

        const cart = await response.json();

        return cart;
    }
    // #3. Set a cookie (default expires in 7 days)
    setCookie(value, days = 7) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = `${encodeURIComponent(this.name)}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax`;
    }

    // #4. Get a cookie value by name
    getCookie() {
        const nameEQ = encodeURIComponent(this.name) + "=";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i].trim();
            if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    }

    // #5. Delete a cookie  
    deleteCookie() {
        document.cookie = `${encodeURIComponent(this.name)}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
}
