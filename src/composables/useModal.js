import { ref } from 'vue';
export function useModal() {
    var isOpen = ref(false);
    function open() {
        isOpen.value = true;
    }
    function close() {
        isOpen.value = false;
    }
    return { isOpen: isOpen, open: open, close: close };
}
