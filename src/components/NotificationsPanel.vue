<template>
  <div class="relative inline-block text-left">
        <button @click="togglePanel" class="relative focus:outline-none">
      <svg class="w-7 h-7 text-slate-300 hover:text-teal-400 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
            <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 border-2 border-slate-900 animate-pulse">{{ unreadCount }}</span>
    </button>
        <div v-if="showPanel" class="origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-slate-900/95 ring-1 ring-black/10 z-50">
      <div class="p-4 border-b border-white/10 flex items-center justify-between">
  <div class="flex items-center gap-2">
    <span class="font-bold text-teal-400 text-lg">Notificações</span>

    <button @click="toggleSound" :title="soundEnabled ? 'Desativar som' : 'Ativar som'">
      <svg v-if="soundEnabled" class="w-5 h-5 text-teal-400 hover:text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 5.858a3 3 0 014.243 0l2.828 2.829a3 3 0 010 4.242L5.858 20.97a1 1 0 01-1.414 0l-4.243-4.243a1 1 0 010-1.414l15.556-15.556z"/></svg>
      <svg v-else class="w-5 h-5 text-slate-500 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15.142A2 2 0 014.172 14H2a1 1 0 01-1-1v-4a1 1 0 011-1h2.172a2 2 0 011.414.586l4.293 4.293a1 1 0 010 1.414l-4.293 4.293zM10 15V9m6 10l-6-6m0-4l6-6"/></svg>
    </button>
  </div>
  <button @click="markAllAsRead" :disabled="markLoading" class="text-xs text-teal-400 hover:underline disabled:opacity-50">
    Marcar todas como lidas
  </button>
</div>
      <div class="max-h-96 overflow-y-auto divide-y divide-white/10">
        <div v-if="notifications.length === 0" class="p-6 text-center text-slate-400">Nenhuma notificação.</div>
                <div v-for="n in notifications" :key="n.id" @click="handleNotificationClick(n)" :class="['p-4 flex flex-col gap-1 hover:bg-teal-500/10 transition cursor-pointer', {'bg-white/5': !n.is_read}]">
          <span :class="['text-sm', n.is_read ? 'text-slate-400' : 'text-white font-semibold']">{{ n.message }}</span>
          <span class="text-xs text-slate-500">{{ formatarData(n.created_at) }}</span>
       </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabase'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const soundEnabled = ref(true);


interface Notification {
  id: string
  user_id: string
  process_id?: string | null
  step_id?: string | null
  message: string
  created_at: string
  is_read: boolean
  type?: string | null
}

const notifications = ref<Notification[]>([])
const showPanel = ref(false)
const { user, fetchUser } = useAuth()
const markLoading = ref(false)
const lastViewed = ref<string | null>(null)

const unreadCount = computed(() => {
  if (!lastViewed.value) {
    return notifications.value.filter(n => !n.is_read).length;
  }
  const lastViewedDate = new Date(lastViewed.value);
  return notifications.value.filter(n => new Date(n.created_at) > lastViewedDate).length;
})

function toggleSound() {
  soundEnabled.value = !soundEnabled.value;
}
watch(soundEnabled, (newValue) => {
  localStorage.setItem('notification_sound_enabled', JSON.stringify(newValue));
});

function formatarData(data: string) {
  if (!data) return ''
  return new Date(data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

// ✅ FUNÇÃO CORRIGIDA
async function markAllAsRead() {
  if (markLoading.value) return;

  const unreadIds = notifications.value.filter(n => !n.is_read).map(n => n.id);

  if (unreadIds.length === 0) {
    return;
  }

  markLoading.value = true;

  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .in('id', unreadIds)
    .select(); // Corrigido para 0 argumentos

  const count = data ? data.length : 0;

  if (error) {
    console.error('Erro ao marcar notificações como lidas:', error.message);
  } else if (count === unreadIds.length) {
    notifications.value = notifications.value.map(n =>
      unreadIds.includes(n.id) ? { ...n, is_read: true } : n
    );
  } else {
    console.warn(`Tentativa de atualizar ${unreadIds.length} notificações, mas apenas ${count} foram alteradas. Verifique as políticas RLS.`);
  }

  markLoading.value = false;
}

async function updateLastViewedTimestamp() {
  const usuario = user.value;
  if (!usuario) return;

  const now = new Date().toISOString();
  const { error } = await supabase
    .from('profiles')
    .update({ last_notification_view_at: now })
    .eq('id', usuario.id);

  if (!error) {
    lastViewed.value = now;
  }
}

async function togglePanel() {
 showPanel.value = !showPanel.value
  if (showPanel.value) {
    await updateLastViewedTimestamp();
    await markAllAsRead();
  }
}

async function initializePanel() {
  let usuario = user.value;
  if (!usuario) {
    usuario = await fetchUser();
  }
  if (!usuario) return;

  const [notificationsResponse, profileResponse] = await Promise.all([
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', usuario.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('profiles')
      .select('last_notification_view_at')
      .eq('id', usuario.id)
      .single()
  ]);

  if (notificationsResponse.data) {
    notifications.value = notificationsResponse.data;
  }
  if (profileResponse.data) {
    lastViewed.value = profileResponse.data.last_notification_view_at;
  }
}

async function handleNotificationClick(notification: Notification) {
  if (notification.process_id) {
    // A lógica para marcar como lida continua a mesma
    if (!notification.is_read) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', notification.id);
      const index = notifications.value.findIndex(n => n.id === notification.id);
      if (index !== -1) {
          notifications.value[index].is_read = true;
      }
    }
    showPanel.value = false;
    
    // ✨ LÓGICA DE REDIRECIONAMENTO INTELIGENTE ✨
    let modalType = 'etapas'; // Define 'etapas' como o padrão
    
    // Se a notificação for do tipo 'overspending', muda para 'registros'
    if (notification.type === 'overspending') {
      modalType = 'registros';
    }
    
    // Usa a variável para construir a URL final
    router.push(`/processos?processo_id=${notification.process_id}&modal_type=${modalType}`);
  }
}

let channel: ReturnType<typeof supabase.channel> | null = null

onMounted(async () => {
  const savedPreference = localStorage.getItem('notification_sound_enabled');
  if (savedPreference !== null) {
    soundEnabled.value = JSON.parse(savedPreference);
  }

  await initializePanel()
  const usuario = user.value
  if (!usuario) return

  channel = supabase.channel('notifications_' + usuario.id)
    .on(
      'postgres_changes',
     {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${usuario.id}`
     },
     (payload) => {
        if (payload.new) {
          notifications.value.unshift(payload.new as Notification)

          if(soundEnabled.value){
          const audio = new Audio('/notification.wav');
            audio.play().catch(error => {
              console.warn('Erro ao reproduzir som de notificação:', error)
            })
          }
        }
      }
    )
    .subscribe()
})

onUnmounted(() => {
  if (channel) {
    channel.unsubscribe()
  }
})
</script>

// A folha de estilo pode permanecer a mesma.

<style scoped>
/* Badge animado */
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
