<template>
  <div class="col mb-5">
    <div class="card h-100">
      <img :src="product.image" class="card-img-top" />

      <div class="card-body p-4">
        <div class="text-center">
          <h5 class="fw-bolder">{{ product.name }}</h5>
          <p>{{ product.price }} €</p>
        </div>
      </div>

      <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
        <div class="text-center d-flex justify-content-center gap-2">
          <button class="btn btn-outline-dark" @click="addToCart">Add to cart</button>
          <button class="btn btn-outline-dark" @click="$emit('view', product)">Voir détails</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart.js'

const props = defineProps({
  product: Object
})

const cart = useCartStore()

const addToCart = () => {
  cart.add(props.product)
}
</script>
