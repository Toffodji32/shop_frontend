<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ product.name }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body modal-horizontal">
          <img :src="product.image" class="modal-img mb-3" />
          <div class="modal-text">
            <p><strong>Prix :</strong> {{ product.price }} €</p>
            <p><strong>Description :</strong> {{ product.description || 'Aucune description' }}</p>

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
.modal-horizontal {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  
}

.modal-text {
  width: 100%;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-dialog {
  max-width: 500px;
  width: 90%;
}

.modal-content {
  background-color: white;
  color: black;
  border-radius: 0.25rem;
  overflow: hidden;
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
}

.modal-img {
  width: 100%; /* image prend toute la largeur du modal */
  height: auto; /* garde les proportions */
  border-radius: 0.25rem;
  object-fit: cover; /* assure que l'image reste bien cadrée */
}
</style>
