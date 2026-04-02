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

            <button class="btn-add-cart">
              🛒 Ajouter au panier
            </button>

          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: Object
})
</script>

<style scoped>

/* OVERLAY */

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

/* MODAL */

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

/* CLOSE BUTTON */

.modal-close{
  position:absolute;
  top:18px;
  right:18px;
  border:none;
  background:#f5f5f5;
  width:34px;
  height:34px;
  border-radius:50%;
  cursor:pointer;
  font-size:14px;
  transition:0.2s;
}

.modal-close:hover{
  background:#e8e8e8;
}

/* BODY */

.modal-body{
  padding:35px;
}

.modal-horizontal{
  display:flex;
  gap:40px;
  align-items:flex-start;
}

/* IMAGE */

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

/* TEXT */

.modal-text{
  flex:1;
}

/* TITLE */

.product-title{
  font-size:24px;
  font-weight:700;
  margin-bottom:10px;
}

/* PRICE */

.price{
  font-size:26px;
  font-weight:700;
  color:#111;
  margin-bottom:15px;
}

/* DESCRIPTION */

.description{
  color:#6c757d;
  line-height:1.6;
  margin-bottom:25px;
}

/* ADD CART BUTTON */

.btn-add-cart{
  background:#0d6efd;
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
  background:#0b5ed7;
  transform:translateY(-2px);
}

/* ANIMATIONS */

@keyframes modalZoom{
  from{
    transform:scale(0.85);
    opacity:0;
  }
  to{
    transform:scale(1);
    opacity:1;
  }
}

@keyframes fadeIn{
  from{opacity:0;}
  to{opacity:1;}
}

/* MOBILE */

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