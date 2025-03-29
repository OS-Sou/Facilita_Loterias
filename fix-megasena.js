// Script para corrigir problemas com a API da Mega-Sena
(function() {
  console.log('Aplicando correção para o gerador da Mega-Sena...');
  
  // Função para monitorar quando o componente MegaSenaGenerator é carregado
  const checkAndPatch = () => {
    // Verifica se estamos na página do gerador
    if (window.location.pathname.includes('/mega-sena/gerador-avancado')) {
      console.log('Página do gerador da Mega-Sena detectada, aplicando patch...');
      
      // Sobrescreve a função fetch para requisições à API da Mega-Sena
      const originalFetch = window.fetch;
      window.fetch = function(url, options) {
        // Se for uma requisição para a API da Mega-Sena
        if (typeof url === 'string' && url.includes('api/megasena')) {
          console.log('Interceptando requisição para API da Mega-Sena:', url);
          
          // Redireciona para a API direta da Caixa
          const newUrl = url.replace('/api/megasena', 'https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena');
          console.log('Redirecionando para:', newUrl);
          
          return originalFetch(newUrl, {
            ...options,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          }).then(response => {
            if (!response.ok) {
              console.error('Erro na requisição:', response.status);
              throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response;
          }).catch(error => {
            console.error('Erro ao acessar API da Mega-Sena:', error);
            throw error;
          });
        }
        
        // Para outras requisições, usa o fetch original
        return originalFetch(url, options);
      };
      
      // Sobrescreve a função axios.get para requisições à API da Mega-Sena
      if (window.axios) {
        const originalGet = window.axios.get;
        window.axios.get = function(url, options) {
          if (typeof url === 'string' && url.includes('api/megasena')) {
            console.log('Interceptando requisição axios para API da Mega-Sena:', url);
            
            // Redireciona para a API direta da Caixa
            const newUrl = url.replace('/api/megasena', 'https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena');
            console.log('Redirecionando para:', newUrl);
            
            return originalGet(newUrl, {
              ...options,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              }
            });
          }
          
          // Para outras requisições, usa o axios.get original
          return originalGet(url, options);
        };
      }
      
      console.log('Patch aplicado com sucesso!');
    }
  };
  
  // Verifica imediatamente e também quando a URL mudar
  checkAndPatch();
  
  // Observa mudanças na URL
  let lastUrl = window.location.href;
  new MutationObserver(() => {
    const url = window.location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      checkAndPatch();
    }
  }).observe(document, {subtree: true, childList: true});
  
  console.log('Monitor de URL instalado para o patch da Mega-Sena');
})();
