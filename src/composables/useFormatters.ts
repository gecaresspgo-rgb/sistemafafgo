/**
 * Composable para centralizar funções utilitárias de formatação
 * Este arquivo contém funções reutilizáveis para formatação de dados
 * como valores monetários, datas e tamanhos de arquivos
 */

/**
 * Formata um valor em segundos para o formato HH:MM:SS
 * @param seg - O valor em segundos a ser formatado
 * @returns String formatada no padrão HH:MM:SS
 */
export function formatarSegundos(seg: number): string {
  const h = Math.floor(seg / 3600)
  const m = Math.floor((seg % 3600) / 60)
  const s = seg % 60
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

export function useFormatters() {
  /**
   * Formata um valor numérico para moeda brasileira (BRL)
   * @param valor - O valor a ser formatado
   * @returns String formatada como moeda brasileira
   */
  function formatarValor(valor: number | null | undefined): string {
    if (valor === null || valor === undefined) return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  /**
   * Formata uma string de data para o formato brasileiro (DD/MM/AAAA)
   * @param dataString - A string de data a ser formatada
   * @returns String formatada como data brasileira
   */
  function formatarData(dataString: string | null | undefined): string {
    if (!dataString) return 'Data não definida'
    const data = new Date(dataString)
    return data.toLocaleDateString('pt-BR')
  }

  /**
   * Formata um tamanho de arquivo em bytes para uma representação mais legível
   * @param bytes - O tamanho em bytes
   * @returns String formatada com unidade apropriada (Bytes, KB, MB, GB)
   */
  function formatarTamanhoArquivo(bytes: number | null | undefined): string {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Retorna todas as funções de formatação
  return {
    formatarValor,
    formatarData,
    formatarTamanhoArquivo,
    formatarSegundos
  }
}