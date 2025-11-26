// frontend/src/components/ReloadPrompt.jsx
import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Snackbar, Button, Alert } from '@mui/material';

export default function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Opcional: Log para debug
      console.log('SW Registrado: ' + r);
    },
    onRegisterError(error) {
      console.log('Erro no registro do SW', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <>
      {/* Aviso: App pronto para uso offline */}
      <Snackbar 
        open={offlineReady} 
        autoHideDuration={6000} 
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={close} severity="success" sx={{ width: '100%' }} variant="filled">
          Aplicativo pronto para uso offline!
        </Alert>
      </Snackbar>

      {/* Aviso: Nova versão disponível */}
      <Snackbar 
        open={needRefresh} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="info"
          variant="filled"
          action={
            <Button color="inherit" size="small" onClick={() => updateServiceWorker(true)}>
              ATUALIZAR
            </Button>
          }
        >
          Nova versão disponível.
        </Alert>
      </Snackbar>
    </>
  );
}