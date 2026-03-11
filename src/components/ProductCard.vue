<template>
  <div class="col mb-5">
    <div class="card product-card h-100">

      <!-- badge -->
      <span class="badge bg-danger product-badge">
        Nouveau
      </span>

      <!-- image -->
      <div class="image-container">
        <img :src="product.image" class="card-img-top" />
      </div>

      <!-- contenu -->
      <div class="card-body">

        <h5 class="product-title">
          {{ product.name }}
        </h5>

        <p class="product-price">
          {{ product.price }} €
        </p>

      </div>

      <!-- boutons -->
      <div class="card-footer bg-transparent border-0">

        <div class="product-buttons">

          <button class="btn btn-cart" @click="addToCart">
            🛒 Ajouter
          </button>

          <button
            class="btn btn-details"
            @click="$emit('view', product)"
          >
            Voir
          </button>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart.js'
import Swal from "sweetalert2";

const props = defineProps({
  product: Object
})

const cart = useCartStore()

const addToCart = () => {
  cart.add(props.product)

  Swal.fire({
    icon: 'success',
    title: 'Produit ajouté au panier',
    showConfirmButton: false,
    timer: 1500
  })
}
</script>

<style scoped>

/* CARD */

.product-card{
  border:none;
  border-radius:14px;
  overflow:hidden;
  transition:all 0.25s ease;
  box-shadow:0 5px 15px rgba(0,0,0,0.05);
  position:relative;
}

.product-card:hover{
  transform:translateY(-6px);
  box-shadow:0 18px 35px rgba(0,0,0,0.15);
}

/* BADGE */

.product-badge{
  position:absolute;
  top:12px;
  left:12px;
  z-index:2;
  font-size:12px;
}

/* IMAGE */

.image-container{
  height:220px;
  overflow:hidden;
}

.card-img-top{
  width:100%;
  height:100%;
  object-fit:cover;
  transition:transform 0.4s ease;
}

.product-card:hover .card-img-top{
  transform:scale(1.05);
}

/* BODY */

.card-body{
  padding:18px;
  text-align:center;
}

/* TITRE */

.product-title{
  font-weight:600;
  font-size:16px;
  min-height:48px;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
}

/* PRIX */

.product-price{
  font-size:20px;
  font-weight:700;
  color:#111;
  margin-top:8px;
}

/* FOOTER */

.card-footer{
  padding-bottom:18px;
}

/* BOUTONS */

.product-buttons{
  display:flex;
  justify-content:center;
  gap:10px;
}

/* bouton panier */

.btn-cart{
  background:#0d6efd;
  color:white;
  border:none;
  padding:7px 16px;
  border-radius:7px;
  font-size:14px;
  transition:0.2s;
}

.btn-cart:hover{
  background:#0b5ed7;
}

/* bouton details */

.btn-details{
  border:1px solid #dee2e6;
  padding:7px 16px;
  border-radius:7px;
  font-size:14px;
  background:white;
  transition:0.2s;
}

.btn-details:hover{
  background:#f8f9fa;
}

</style>