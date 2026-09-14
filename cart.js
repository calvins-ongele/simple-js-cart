/******
//usage/calling outside a function
  <script>
        const cart = new Cart('cart_id'); 

        cart.get().then(data => { 
            const totalInCart = data.total; 
            updateNumbers(totalInCart);
        });

        // add to cart btn pressed
        //quantity
        const addToCart = document.querySelector('button[name="add-to-cart"]');
        addToCart.addEventListener('click', async (e)=> {
            e.preventDefault();
            
            const qty = document.querySelector('#quantity').value; 
            const send = await cart.send(item_id, qty); 
            updateNumbers(send.total);
        });

        function updateNumbers(numbersIncart) {
            document.querySelectorAll('.cart-numbers sup').forEach((element)=>{
                element.textContent = numbersIncart;
            });
        }

    <\/script>

*****/


class Cart {
    constructor(name) {
        this.name = name;
    }
    //# 1. retries cart data from backend  ... returns {total:count, cart:data}
    async get() {
        let cookie_id = this.getCookie; 
        
        if (cookie_id.length === 0){ //set it if it doesnt exist
            cookie_id = this.generateRandomString();
            this.setCookie(cookie_id, 14);
         
            return { total:0, cart:[]  } // no need to throw error, perhaps no 'add to cart' button been pressed
        } 
        const response = await fetch("/myapp/fetch-cart", {
            method:"POST", body:JSON.stringify({cookie_id})
        });

        const cart = await response.json();

        return cart;
    }
    //# 2. send new/update cart data to backend  ... returns {total:count, cart:data}
    async send(item_id, qty = 1, checkout = 0) {
        
        let cookie_id = this.getCookie;
        
        if (cookie_id.length === 0){ //set it if it doesnt exist
            cookie_id = this.generateRandomString();
            this.setCookie(cookie_id, 14);
        }

        const response = await fetch("/myapp/save-cart", {
            method:"POST", body:JSON.stringify({
                cookie_id, item_id, qty, checkout
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
        return '';
    }

    // #5. Delete a cookie  
    deleteCookie() {
        document.cookie = `${encodeURIComponent(this.name)}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }

    //# 6. generate cookie id
    generateRandomString(length = 10) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        
        return result;
    }
}
