const checkOutComponent = {
    props:{
        cartItems: Array
    },
    data() {
        return {
            order_details:{
                firstname: "",
                lastname: "",
                mobile: "", 
            },
        }
    },
    methods:{
         // Get total price of items in the cart
         totalPrice(){
            let sum = 0
            for (let i = 0; i < this.cartItems.length; i++) {
                let item_price =  this.cartItems[i].spaces * this.cartItems[i].price
                sum += item_price
            }
            return sum
        },
        
        // Validate name and phone number check out fields
        validateFields(){
            if (/^[0-9]+$/.test(this.order_details.mobile) && /^[a-z]+$/i.test(this.order_details.firstname) && /^[a-z]+$/i.test(this.order_details.lastname)){
                return false
            }
            return true
        },
        removeFromCart(id, spaces){
            this.$emit('remove-lesson', {id: id, spaces: spaces})
        },
        checkOut(){
            this.$emit('checkout', this.order_details)
            this.clearCheckoutForm()
        },
        clearCheckoutForm: function(){
            this.order_details.firstname = ""
            this.order_details.lastname = ""
            this.order_details.mobile = ""
        },
    },
    template: 
    `
    <div class="card rounded-0">
        <div class="card-body">
                <div class="row">
                <div class="col-sm-7">
                    <!-- Cart items -->
                    <div class="row">
                        <h6>Cart Items</h6>
                        <div class="col-sm-4" v-for="item in cartItems">
                            <div class="card mb-3 rounded-0">
                                <img :src="item.url" class="card-img-top rounded-0 mycard-img" :alt="item.title">
                                <div class="card-body">
                                    <h6 class="card-title">{{item.title}}</h6>
                                    <p class="card-text m-0"><strong>Location:</strong> {{item.location}}</p>
                                    <p class="card-text m-0"><strong>Price:</strong> $ {{item.price}}</p>
                                    <p class="card-text m-0"><strong>Spaces:</strong> {{item.spaces}}</p>
                                    <button v-on:click="removeFromCart(item.id, item.spaces)" class="btn mt-1 btn-sm btn-danger rounded-0 w-100">Remove from cart <i class="fas fa-cart-arrow-down"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Check out form -->
                <div class="col-sm-5">
                    <h5>Checkout <i class="fas fa-paper-plane"></i></h5>
                    <div class="total-price">
                        <div class="d-flex">
                            <p class="m-0"><strong>Total:</strong></p>
                            <p class="ms-auto">$ {{totalPrice()}}</p>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col">
                        <input v-model="order_details.firstname" type="text" class="form-control rounded-0" placeholder="First name" aria-label="First name">
                        </div>
                        <div class="col">
                        <input v-model="order_details.lastname" type="text" class="form-control rounded-0" placeholder="Last name" aria-label="Last name">
                        </div>
                    </div>
                    <input type="text" v-model="order_details.mobile" class="form-control rounded-0 mb-2" placeholder="Phone number" aria-label="Last name">
                    <button v-bind:disabled="validateFields()" v-on:click="checkOut" class="btn btn-success w-100 rounded-0">Checkout <i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    </div>
    `
}

const lessonComponent = {
    props:{
        lesson: Object
    },
    methods:{
        disableAddToCart(lesson){
            if (lesson.spaces >= 1){
                return false
            }
            return true
        },
        addToCart(){
            this.$emit('add-to-cart', this.lesson)
        }

    },
    template: 
    `<div class="card mb-3 rounded-0">
        <img v-bind:src="lesson.url" class="card-img-top rounded-0 mycard-img">
        <div class="card-body">
            <h6 class="card-title">{{lesson.title}}</h6>
            <p class="card-text m-0"><strong>Location:</strong> {{lesson.location}}</p>
            <p class="card-text m-0"><strong>Price:</strong> $ {{lesson.price}}</p>
            <p class="card-text mb-2"><strong>Spaces</strong>: {{lesson.spaces}} <span v-if="lesson.spaces < 1" style="color: red;">(Out of stock)</span></p>
            <button v-bind:disabled="disableAddToCart(lesson)" class="btn btn-sm btn-primary rounded-0 w-100" v-on:click="addToCart">Add to cart <i class="fas fa-cart-plus"></i></button>
        </div>
    </div>`
}


Vue.component('root-component', { 
    components: { 'checkout-component': checkOutComponent, 'lesson-component': lessonComponent },
    data() {
        return {
            lessons: [],
            cart_items: [],
            search_keyword: "",
            sort_order: "",
            attribute_sort: "",
            showCheckOut: false
        }
    },
    methods: {

        // Toggle checkout
        toggleCheckOut: function(){
            if (this.showCheckOut == false) {
                this.showCheckOut = true
            }
            else this.showCheckOut = false
        },

        // Logic to add class activity to cart
        addToCart: function(lesson){
            if (lesson.spaces >= 1) {
                let lessonInCart = false
                if (this.countCart() >= 1){
                    for (let i = 0; i < this.cart_items.length; i++) {
                        if (this.cart_items[i].id == lesson._id){
                            this.cart_items[i].spaces += 1
                            lessonInCart = true
                            break
                        }
                    }
                    if (lessonInCart == false) {
                        let item = {}
                        item.id = lesson._id
                        item.spaces = 1
                        this.cart_items.push(item)
                    }
                }
                else{
                    let item = {}
                    item.id = lesson._id
                    item.spaces = 1
                    this.cart_items.push(item)
                }
                lesson.spaces -= 1
            }
            else{
                lesson.spaces = 0
            }
        },
        
        // Method to count items in the cart
        countCart: function(){
            return this.cart_items.length
        },
        
        // Method to return information about the items in the cart
        cartItemsInfo: function(){
            let cart_items_info = []
            for (let i = 0; i < this.cart_items.length; i++) {
                for (let j = 0; j < this.lessons.length; j++) {
                    if (this.lessons[j]._id == this.cart_items[i].id) {
                        let item = {}
                        item.id = this.cart_items[i].id
                        item.title = this.lessons[j].title
                        item.location = this.lessons[j].location
                        item.price = this.lessons[j].price
                        item.url = this.lessons[j].url
                        item.spaces = this.cart_items[i].spaces
                        cart_items_info.push(item)
                    }   
                }
            }
            return cart_items_info
        },
        
        // Logic to disable add to cart button if number of spaces reaches zero
        
        // Logic to disable art button if no items in the cart
        hideCart: function(){
            if (this.countCart() >= 1) {
                return false
            }
            return true
        },
        
        // Remove items from cart
        removeFromCart: function(obj){
            for (let i = 0; i < this.lessons.length; i++) {
                if (this.lessons[i]._id == obj.id) {
                    this.lessons[i].spaces += obj.spaces
                }
            }
            for (let i = 0; i < this.cart_items.length; i++) {
                if (this.cart_items[i].id == obj.id) {
                    this.cart_items.splice(i, 1)
                }
            }
        },
        
        // Checkout logic
        checkOut: function(order_details){
            let order = {
                name: order_details.firstname +' '+order_details.lastname,
                phone_number: order_details.mobile,
                items: this.cart_items
            }
            let order_string = (JSON.stringify(order))
            fetch('https://coursework-two-king.herokuapp.com/collection/orders', {
                method: "POST",
                body: order_string,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.json())
            .then(json_response => {
                console.log(json_response)
                this.updateSpaces()
            })
            .catch(err => console.log(err))
        },

        // Update spaces in db
        updateSpaces: function(){
            let spaces_upd = []
            for (let i = 0; i < this.cart_items.length; i++) {
                for (let j = 0; j < this.lessons.length; j++) {
                    if (this.cart_items[i].id == this.lessons[j]._id) {
                        let item = {
                            id: this.cart_items[i].id,
                            spaces: this.lessons[j].spaces
                        }
                        spaces_upd.push(item)
                    }
                }    
            }
            let spaces_upd_string = (JSON.stringify(spaces_upd ))
            fetch('https://coursework-two-king.herokuapp.com/collection/activities', {
                method: "PUT",
                body: spaces_upd_string,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.json())
            .then(response => {
                console.log(response)
                this.cart_items = []
                Swal.fire(
                    'Success!',
                    'Order submitted successfully!',
                    'success'
                )
                this.showCheckOut = false
            })
            .catch(err => console.log(err))
        },

        // Logic to fetch lists from server
        fetchLessons: function(){
            fetch(`https://coursework-two-king.herokuapp.com/collection/activities`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                this.lessons = data
                console.log(this.lessons)
            })
            .catch(err => {
                this.lessons = []
                console.log(`unable to get lessons: ${err}`)
            })
        },

        // Logic to call back end express filter logic
        filterLessons: function(){
            fetch(`https://coursework-two-king.herokuapp.com/collection/activities/search?filter=${this.search_keyword}`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                this.lessons = data
            })
            .catch(err => {
                this.lessons = []
                console.log(`unable to get lessons: ${err}`)
            })
        },
        
        //Logic to filter results based on search keyword
        sortList: function(){
            /** >>>>>>>>>>>>>> SORT BASED ON PROPERTY <<<<<<<<<<<<<<<<<< **/ 
            if (this.attribute_sort == "location") {
                this.lessons.sort(this.sortbyLocation)
            }
            else if (this.attribute_sort == "price"){
                this.lessons.sort(this.sortbyPrice)
            }
            else if (this.attribute_sort == "spaces"){
                this.lessons.sort(this.sortbySpaces)
            }
            else{
                this.lessons.sort(this.sortbyTitle)
            }

            /** >>>>>>>> SPECITY ORDER (ascending or descending) <<<<<<<< **/ 
            if (this.sort_order == "descending"){
                this.lessons.reverse()
            }
        },
        
        /** Functions to sort based on various poperties **/

        // | >>>>>>>>>>> Sort by title/subject <<<<<<<<<<< | 
        sortbyTitle: function(a, b){
            if ( a.title.toLowerCase() < b.title.toLowerCase()){
                return -1;
            }
            if ( a.title.toLowerCase() > b.title.toLowerCase()){
                return 1;
            }
            return 0;
        },
        
        // | >>>>>>>>>>> Sort by Location <<<<<<<<<<< | 
        sortbyLocation: function(a, b){
            if ( a.location.toLowerCase() < b.location.toLowerCase()){
                return -1;
            }
            if ( a.location.toLowerCase() > b.location.toLowerCase()){
                return 1;
            }
            return 0;
        },
        
        // | >>>>>>>>>>> Sort by price <<<<<<<<<<< | 
        sortbyPrice: function(a, b){
            return a.price-b.price;
        },
        
        // | >>>>>>>>>>> Sort by spaces <<<<<<<<<<< | 
        sortbySpaces: function(a, b){
            return a.spaces-b.spaces;
        }
    },
    created() {
        this.fetchLessons()
    },
    template: 
    `<div>
        <nav class="navbar navbar-light bg-white border-bottom navbar-expand">
            <div class="container-fluid">
            <a class="navbar-brand fw-bold" href="#">🦸SchoolHero</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <button v-bind:disabled="hideCart()" v-on:click="toggleCheckOut" type="button" class="btn rounded-0 btn-sm btn-dark position-relative">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {{ countCart() }}
                            </span>
                        </button>
                    </li>
                </ul>
            </div>
            </div>
        </nav>

        <!-- Page-caption and filters-->
        <div class="container-fluid border-bottom mt-3">
            <div class="row justify-content-center">
                <div class="col-md-7">
                    <h1 class="text-center page-caption">
                        2,500+ after-school activities to power up your learning.
                    </h1>
                    <p class="text-center">Discover new after-school activities and classes that will help shape your mind, body and your future 🚀!</p>
                </div>
            </div>
            <div class="container">
                <div class="row mb-3 mt-2 justify-content-center">
                    <div class="col-md-12">
                        <div class="row justify-content-center">
                            <div class="col-sm-5 mb-2">
                                <input v-on:input="filterLessons" v-model="search_keyword" type="text" class="form-control rounded-0 p-2" placeholder="Search names, locations for interesting activities..." aria-label="Recipient's username" aria-describedby="button-addon2">
                            </div>
                            <div class="col-sm-4 mb-2">
                                <select v-on:change="sortList" v-model="attribute_sort" class="form-select p-2 rounded-0">
                                    <option value="">-- Sort options --</option>
                                    <option value="title">Subject</option>
                                    <option value="location">Location</option>
                                    <option value="price">Price</option>
                                    <option value="spaces">Availability</option>
                                </select>
                            </div>
                            <div class="col-sm-3 mb-2">
                                <select v-on:change="sortList" v-model="sort_order" class="form-select p-2 rounded-0">
                                    <option value="">-- Sort order --</option>
                                    <option value="ascending">Ascending</option>
                                    <option value="descending">Descending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container mt-3">
            <checkout-component v-if="showCheckOut" :cartItems="cartItemsInfo()" v-on:remove-lesson="removeFromCart($event)" v-on:checkout="checkOut($event)"></checkout-component>
            <div v-else class="row">
                <div class="col-sm-3 mb-2" v-for="lesson in lessons">
                    <lesson-component :lesson="lesson" v-on:add-to-cart="addToCart($event)"></lesson-component>
                </div>
            </div>
        </div>

        <footer>
            <div class="container mt-5">
                <div class="rown justify-content-center">
                    <p class="text-center m-0">Made with ❤️ and Vue js</p>
                    <p class="text-center m-0">🦸SchoolHero | &copy; 2022</p>
                </div>
            </div>
        </footer>
    </div>`,
})

new Vue({
    el: "#app"
})

