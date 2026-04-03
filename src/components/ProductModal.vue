<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog">
      
      <div class="modal-content">
        <!-- bouton fermer -->
        <button class="modal-close" @click="$emit('close')">✕</button>

        <div class="modal-body modal-horizontal">

          <!-- IMAGE GAUCHE -->
          <div class="modal-image">
            <img :src="product.image" class="modal-img" />
          </div>

          <!-- TEXTE DROITE -->
          <div class="modal-text">

            <h2 class="product-title">
              {{ product.name }}
            </h2>

            <p class="price">
              {{ product.price }} FCFA
            </p>

            <p class="description">
              {{ product.description || 'Aucune description disponible pour ce produit.' }}
            </p>

            <button class="btn-add-cart" @click="addToCart">
              🛒 Ajouter au panier
            </button>

          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart.js';
import Swal from "sweetalert2";


const cartStore = useCartStore();

const props = defineProps({
  product: Object
});

const addToCart = () => {
  cartStore.add(props.product);
  Swal.fire({
    title: "Produit ajouté !",
    text: `${props.product.name} a été ajouté au panier.`,
    icon: "success",
    confirmButtonText: "Continuer"
  });
};
</script>

<style scoped>

.modal-backdrop{
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.55);
  backdrop-filter:blur(6px);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:1050;
  animation:fadeIn 0.3s ease;
}

.modal-dialog{
  max-width:850px;
  width:92%;
}

.modal-content{
  position:relative;
  background:white;
  border-radius:16px;
  overflow:hidden;
  box-shadow:0 25px 60px rgba(0,0,0,0.25);
  animation:modalZoom 0.35s ease;
}

/* CLOSE BUTTON — complètement à l'intérieur */
.modal-close{
  position:absolute;
  top:12px;
  right:12px;
  border:none;
  background:#f5f5f5;
  width:34px;
  height:34px;
  border-radius:50%;
  cursor:pointer;
  font-size:14px;
  font-weight:bold;
  z-index:100;
  transition:0.2s;
  display:flex;
  align-items:center;
  justify-content:center;
}

.modal-close:hover{
  background:#e0e0e0;
  transform:scale(1.1);
}

.modal-body{
  padding:35px;
}

.modal-horizontal{
  display:flex;
  gap:40px;
  align-items:flex-start;
}

.modal-image{
  flex:1;
  background:#f8f9fa;
  border-radius:12px;
  display:flex;
  justify-content:center;
  align-items:center;
  padding:25px;
}

.modal-img{
  max-width:100%;
  max-height:320px;
  object-fit:contain;
  transition:transform 0.3s;
}

.modal-img:hover{
  transform:scale(1.05);
}

.modal-text{
  flex:1;
  padding-top:10px;
}

.product-title{
  font-size:24px;
  font-weight:700;
  margin-bottom:10px;
}

.price{
  font-size:26px;
  font-weight:700;
  color:#111;
  margin-bottom:15px;
}

.description{
  color:#6c757d;
  line-height:1.6;
  margin-bottom:25px;
}

.btn-add-cart{
  background:#fd7e14;
  color:white;
  border:none;
  padding:12px 22px;
  border-radius:8px;
  font-size:15px;
  font-weight:500;
  cursor:pointer;
  transition:0.25s;
}

.btn-add-cart:hover{
  background:#e46c0a;
  transform:translateY(-2px);
}

@keyframes modalZoom{
  from{ transform:scale(0.85); opacity:0; }
  to{ transform:scale(1); opacity:1; }
}

@keyframes fadeIn{
  from{ opacity:0; }
  to{ opacity:1; }
}

@media (max-width:768px){
  .modal-horizontal{
    flex-direction:column;
    text-align:center;
  }
  .modal-img{
    max-height:250px;
  }
}
</style>