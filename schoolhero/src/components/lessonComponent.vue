<template>
  <div>
    <div class="card mb-3 rounded-0">
        <img v-bind:src="lesson.url" class="card-img-top rounded-0 mycard-img">
        <div class="card-body">
            <h6 class="card-title">{{lesson.title}}</h6>
            <p class="card-text m-0"><strong>Location:</strong> {{lesson.location}}</p>
            <p class="card-text m-0"><strong>Price:</strong> $ {{lesson.price}}</p>
            <p class="card-text mb-2"><strong>Spaces</strong>: {{lesson.spaces}} <span v-if="lesson.spaces < 1" style="color: red;">(Out of stock)</span></p>
            <button v-bind:disabled="disableAddToCart(lesson)" class="btn btn-sm btn-primary rounded-0 w-100" v-on:click="addToCart">Add to cart <i class="fas fa-cart-plus"></i></button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'lessonComponent',
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
}
</script>
