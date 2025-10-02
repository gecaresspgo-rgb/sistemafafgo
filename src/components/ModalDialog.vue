<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  show: boolean
  title?: string
  maxWidth?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

// Fechar o modal quando pressionar ESC
function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.show) {
    emit('close')
  }
}

// Impedir o scroll do body quando o modal estiver aberto
function toggleBodyScroll(disable: boolean) {
  if (disable) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Adicionar/remover event listeners
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  if (props.show) {
    toggleBodyScroll(true)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  toggleBodyScroll(false)
})

// Observar mudanças na prop show
watch(
  () => props.show,
  (newVal) => {
    toggleBodyScroll(newVal)
  }
)

// Fechar o modal quando clicar no overlay
function closeOnOverlayClick(e: MouseEvent) {
  // Verificar se o clique foi no overlay e não no conteúdo do modal
  if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="show"
        class="modal-overlay fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closeOnOverlayClick"
      >
        <div
          class="modal-content bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl overflow-hidden"
          :style="{ maxWidth: maxWidth || '500px', width: '100%' }"
          @click.stop
        >
          <div class="modal-header border-b border-white/10 p-4 flex justify-between items-center">
            <h3 class="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">{{ title || 'Modal' }}</h3>
            <button
              @click="emit('close')"
              class="text-slate-300 hover:text-white transition-colors"
              aria-label="Fechar"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div class="modal-body p-6 text-slate-200">
            <slot></slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-content {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: translateY(20px);
}
</style>
