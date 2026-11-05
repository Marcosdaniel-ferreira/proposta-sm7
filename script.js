//  <!-- SCRIPT LIGHTBOX -->

    const imagens = document.querySelectorAll('.slide img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const btnFechar = document.getElementById('lightbox-fechar');

    imagens.forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.add('ativo');
      });
    });

    const fecharLightbox = () => {
      lightbox.classList.remove('ativo');
      setTimeout(() => { lightboxImg.src = ''; }, 400);
    };

    btnFechar.addEventListener('click', fecharLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target !== lightboxImg) {
        fecharLightbox();
      }
    });
  

//   <!-- SCRIPT JARVIS: MÁQUINA DE ESCREVER + SUBIDA SUAVE -->
  
    const hudIntro = document.getElementById('hud-intro');
    const btnAcao = document.getElementById('btn-acao');
    const hudConteudo = document.getElementById('hud-conteudo');
    const textoMaquina = document.getElementById('texto-maquina');
    const audioVoz = document.getElementById('audio-voz');
    const dicaAvancar = document.getElementById('dica-avancar');

    const mensagem = "Identidade, confirmada. Bem-vinda... Pepper Potts. O futuro da sua marca, agora é estritamente confidencial. Toque... e descubra.";
    let indexTexto = 0;
    let fase = 0; // 0 = início, 1 = decodificando / pronto para subir
    let subiu = false;

    // Função que toca o áudio de forma segura
    function tocarAudio() {
      if (!audioVoz) return;
      try {
        audioVoz.currentTime = 0;
        const playPromise = audioVoz.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => console.warn("Áudio não reproduzido ou bloqueado:", err));
        }
      } catch (e) {
        console.warn(e);
      }
    }

    // Função que digita o texto (sem subida automática!)
    function digitarTexto() {
      if (indexTexto < mensagem.length) {
        textoMaquina.innerHTML += mensagem.charAt(indexTexto);
        indexTexto++;
        setTimeout(digitarTexto, 35);
      } else {
        // Ao finalizar de digitar o texto, acende suavemente a dica para o cliente clicar
        if(dicaAvancar) dicaAvancar.style.opacity = '1';
      }
    }

    // Função de subida da tela estilo Jarvis
    function subirTelaJarvis() {
      if (subiu) return;
      subiu = true;

      // Se o cliente clicou para subir enquanto o áudio ainda falava, pausa o áudio. 
      // Se o áudio já terminou, isso não afeta nada.
      if (audioVoz) {
        try { audioVoz.pause(); } catch(e){}
      }

      // Sobe a tela com a animação CSS
      hudIntro.classList.add('subir');
      // Destrava o scroll da página principal para a cliente ler a proposta
      document.body.classList.remove('travado');

      // Desliga a tela preta de vez após a animação terminar
      setTimeout(() => {
        hudIntro.style.display = 'none';
      }, 1200);
    }

    // Clique principal da tela
    hudIntro.addEventListener('click', () => {
      if (fase === 0) {
        // Primeiro toque do cliente: Inicia voz, scanner e texto
        fase = 1;
        btnAcao.style.display = 'none';
        hudConteudo.style.display = 'flex';
        tocarAudio();
        digitarTexto();
      } else {
        // Segundo toque do cliente: Sobe para a proposta
        subirTelaJarvis();
      }
    });
