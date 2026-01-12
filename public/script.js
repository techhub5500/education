// Estado da aplicação
let currentContent = null;
let currentElementIndex = 0;
let currentLineIndex = 0; // Controla qual linha do elemento atual está sendo mostrada
let isPresentationMode = false;
let charts = [];
let currentElementContainer = null; // Container do elemento atual

// Elementos do DOM
const elements = {
    textInput: document.getElementById('textInput'),
    processBtn: document.getElementById('processBtn'),
    statusMessage: document.getElementById('statusMessage'),
    timeControls: document.getElementById('timeControls'),
    timingList: document.getElementById('timingList'),
    playBtn: document.getElementById('playBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    resetBtn: document.getElementById('resetBtn'),
    contentDisplay: document.getElementById('contentDisplay'),
    progressFill: document.getElementById('progressFill')
};

// Event Listeners
elements.processBtn.addEventListener('click', processContent);
elements.playBtn.addEventListener('click', startPresentation);
elements.resetBtn.addEventListener('click', resetPresentation);

// Listener para tecla ENTER
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && isPresentationMode) {
        event.preventDefault();
        showNextElement();
    }
});

// Listener para toque na tela (mobile)
elements.contentDisplay.addEventListener('click', (event) => {
    if (!isPresentationMode) return;
    
    // Prevenir comportamento padrão (scroll, zoom, etc)
    event.preventDefault();
    event.stopPropagation();
    
    const clickX = event.clientX || event.touches?.[0]?.clientX;
    const screenWidth = window.innerWidth;
    const clickPosition = clickX / screenWidth;
    
    // Lado esquerdo (0 a 0.3) = Voltar
    if (clickPosition < 0.3) {
        showPreviousElement();
    }
    // Lado direito (0.3 a 1.0) = Avançar
    else {
        showNextElement();
    }
});

// Prevenir scroll durante toque no content display
elements.contentDisplay.addEventListener('touchmove', (event) => {
    if (isPresentationMode) {
        event.preventDefault();
    }
}, { passive: false });

// Função para processar o conteúdo
async function processContent() {
    const text = elements.textInput.value.trim();
    
    if (!text) {
        showStatus('Por favor, digite algum conteúdo!', 'error');
        return;
    }

    showStatus('🤖 Processando com IA... Aguarde!', 'loading');
    elements.processBtn.disabled = true;

    try {
        // Usa a URL atual para API (funciona tanto localmente quanto no Render)
        const apiUrl = window.location.origin + '/api/process';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }

        const data = await response.json();
        currentContent = data;
        
        showStatus('✅ Conteúdo gerado com sucesso!', 'success');
        setupTimeControls();
        
    } catch (error) {
        console.error('Erro:', error);
        showStatus('❌ Erro ao processar: ' + error.message, 'error');
    } finally {
        elements.processBtn.disabled = false;
    }
}

// Mostrar mensagem de status
function showStatus(message, type) {
    elements.statusMessage.textContent = message;
    elements.statusMessage.className = `status-message ${type}`;
    elements.statusMessage.classList.remove('hidden');
    
    if (type === 'success') {
        setTimeout(() => {
            elements.statusMessage.classList.add('hidden');
        }, 3000);
    }
}

// Configurar controles após processamento
function setupTimeControls() {
    if (!currentContent || !currentContent.elements) return;

    // Mostrar informações sobre os elementos
    elements.timingList.innerHTML = '';
    
    currentContent.elements.forEach((element, index) => {
        const timingItem = document.createElement('div');
        timingItem.className = 'timing-item';
        
        const label = document.createElement('label');
        label.textContent = `${index + 1}. ${getElementDescription(element)}`;
        
        // Input para controlar duração da animação
        const durationLabel = document.createElement('label');
        durationLabel.textContent = 'Duração da animação (segundos):';
        durationLabel.style.fontSize = '0.9em';
        durationLabel.style.marginTop = '5px';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0.5';
        input.step = '0.1';
        input.max = '5';
        input.value = element.animation?.duration || (element.type === 'text' ? 1.5 : 2.5);
        input.dataset.index = index;
        input.addEventListener('change', updateAnimationDuration);
        
        timingItem.appendChild(label);
        timingItem.appendChild(durationLabel);
        timingItem.appendChild(input);
        elements.timingList.appendChild(timingItem);
    });
    
    elements.timeControls.classList.remove('hidden');
    resetPresentation();
}

// Obter descrição do elemento
function getElementDescription(element) {
    return `Texto: ${element.content.substring(0, 40)}...`;
}

// Atualizar duração da animação
function updateAnimationDuration(event) {
    const index = parseInt(event.target.dataset.index);
    const duration = parseFloat(event.target.value);
    if (currentContent && currentContent.elements[index]) {
        if (!currentContent.elements[index].animation) {
            currentContent.elements[index].animation = {};
        }
        currentContent.elements[index].animation.duration = duration;
    }
}

// Iniciar apresentação
function startPresentation() {
    if (!currentContent || !currentContent.elements) return;
    
    isPresentationMode = true;
    elements.playBtn.classList.add('hidden');
    elements.pauseBtn.classList.remove('hidden');
    
    elements.contentDisplay.innerHTML = '';
    currentElementIndex = 0;
    currentLineIndex = 0;
    currentElementContainer = null;
    elements.progressFill.style.width = '0%';
    
    // Ativar fullscreen no mobile
    enterFullscreen();
    
    showStatus('📺 Modo Apresentação: Pressione ENTER para avançar', 'success');
    
    // Mostrar primeira linha do primeiro elemento
    showNextLine();
}

// Resetar apresentação
function resetPresentation() {
    isPresentationMode = false;
    currentElementIndex = 0;
    currentLineIndex = 0;
    currentElementContainer = null;
    elements.contentDisplay.innerHTML = '';
    elements.progressFill.style.width = '0%';
    elements.playBtn.classList.remove('hidden');
    elements.pauseBtn.classList.add('hidden');
    
    // Sair do fullscreen
    exitFullscreen();
    
    // Limpar gráficos anteriores
    charts.forEach(chart => chart.destroy());
    charts = [];
}

// Mostrar próxima linha
function showNextLine() {
    if (!isPresentationMode || !currentContent) return;
    
    // Verificar se chegou ao fim
    if (currentElementIndex >= currentContent.elements.length) {
        isPresentationMode = false;
        showStatus('✅ Apresentação concluída!', 'success');
        elements.playBtn.classList.remove('hidden');
        elements.pauseBtn.classList.add('hidden');
        return;
    }
    
    const element = currentContent.elements[currentElementIndex];
    const lines = element.content.split('\n').filter(line => line.trim() !== '');
    
    // Se não há container ou é um novo elemento, criar container
    if (!currentElementContainer || currentLineIndex === 0) {
        currentElementContainer = createElementContainer(element);
        elements.contentDisplay.appendChild(currentElementContainer);
    }
    
    // Mostrar linha atual
    if (currentLineIndex < lines.length) {
        renderLine(lines[currentLineIndex], currentElementContainer, element.highlights || []);
        currentLineIndex++;
    }
    
    // Se terminou as linhas deste elemento, preparar para próximo
    if (currentLineIndex >= lines.length) {
        currentElementIndex++;
        currentLineIndex = 0;
        currentElementContainer = null;
        
        // Atualizar barra de progresso
        const progress = (currentElementIndex / currentContent.elements.length) * 100;
        elements.progressFill.style.width = `${progress}%`;
    }
}

// Mostrar próximo elemento (mantido para compatibilidade)
function showNextElement() {
    showNextLine();
}

// Mostrar linha anterior
function showPreviousElement() {
    if (!isPresentationMode || !currentContent) return;
    
    // Se está na primeira linha do primeiro elemento, não faz nada
    if (currentElementIndex === 0 && currentLineIndex === 0) return;
    
    // Se está no meio de um elemento, voltar uma linha
    if (currentLineIndex > 0) {
        // Remove a última linha renderizada
        const lastLine = currentElementContainer?.lastElementChild;
        if (lastLine && lastLine.classList.contains('content-line')) {
            lastLine.remove();
            currentLineIndex--;
        }
    } else {
        // Está no início de um elemento, voltar para o elemento anterior
        if (currentElementIndex > 0) {
            // Remover container atual
            if (currentElementContainer) {
                currentElementContainer.remove();
                currentElementContainer = null;
            }
            
            currentElementIndex--;
            
            // Encontrar quantas linhas tem o elemento anterior
            const prevElement = currentContent.elements[currentElementIndex];
            const prevLines = prevElement.content.split('\n').filter(line => line.trim() !== '');
            
            // Voltar para o container anterior e remover última linha
            currentElementContainer = elements.contentDisplay.lastElementChild;
            if (currentElementContainer) {
                const lastLine = currentElementContainer.lastElementChild;
                if (lastLine) {
                    lastLine.remove();
                    currentLineIndex = prevLines.length - 1;
                }
            }
            
            // Atualizar barra de progresso
            const progress = (currentElementIndex / currentContent.elements.length) * 100;
            elements.progressFill.style.width = `${progress}%`;
        }
    }
}

// Criar container para elemento
function createElementContainer(element) {
    const container = document.createElement('div');
    container.className = 'content-element';
    
    const animationDuration = element.animation?.duration || 1.5;
    container.style.setProperty('--animation-duration', `${animationDuration}s`);
    
    return container;
}

// Renderizar uma linha individual
function renderLine(lineText, container, highlights) {
    const lineDiv = document.createElement('div');
    lineDiv.className = 'content-line line-animation';
    
    let content = lineText;
    const colors = ['highlight-yellow', 'highlight-green', 'highlight-pink', 'highlight-blue'];
    
    // Aplicar destaques
    highlights.forEach((word, index) => {
        const color = colors[index % colors.length];
        const regex = new RegExp(`(${escapeRegex(word)})`, 'gi');
        content = content.replace(regex, `<span class="highlight ${color}">$1</span>`);
    });
    
    lineDiv.innerHTML = content;
    container.appendChild(lineDiv);
    
    // Scroll suave e inteligente para a nova linha
    setTimeout(() => {
        scrollToNewLine(lineDiv);
    }, 50);
}

// Renderizar elemento (mantido para compatibilidade)
function renderElement(element) {
    const container = document.createElement('div');
    container.className = 'content-element fade-slide-animation';
    
    // Aplicar animações
    const animationDuration = element.animation?.duration || 1.5;
    container.style.setProperty('--animation-duration', `${animationDuration}s`);
    
    renderText(element, container);
    
    elements.contentDisplay.appendChild(container);
    
    // Scroll para o novo elemento
    container.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

// Renderizar texto com destaques
function renderText(element, container) {
    let content = element.content;
    const highlights = element.highlights || [];
    const colors = ['highlight-yellow', 'highlight-green', 'highlight-pink', 'highlight-blue'];
    
    // Preservar quebras de linha
    content = content.replace(/\n/g, '<br>');
    
    highlights.forEach((word, index) => {
        const color = colors[index % colors.length];
        const regex = new RegExp(`(${escapeRegex(word)})`, 'gi');
        content = content.replace(regex, `<span class="highlight ${color}">$1</span>`);
    });
    
    container.innerHTML = `<div class="content-text">${content}</div>`;
}

// Escapar caracteres especiais para regex
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Scroll inteligente para nova linha
function scrollToNewLine(lineElement) {
    const canvasContainer = document.querySelector('.canvas-container');
    const containerRect = canvasContainer.getBoundingClientRect();
    const lineRect = lineElement.getBoundingClientRect();
    
    // Calcular posição relativa ao container
    const lineTop = lineRect.top - containerRect.top + canvasContainer.scrollTop;
    const lineBottom = lineTop + lineRect.height;
    
    // Margem de segurança (pixels) - aumenta com mais conteúdo
    const totalContentHeight = canvasContainer.scrollHeight;
    const margin = Math.min(100, totalContentHeight * 0.1); // Máximo 100px ou 10% do conteúdo
    
    // Verificar se a linha está completamente visível
    const containerTop = canvasContainer.scrollTop;
    const containerBottom = containerTop + containerRect.height;
    
    // Se a linha não está completamente visível, fazer scroll
    if (lineTop < containerTop + margin || lineBottom > containerBottom - margin) {
        // Calcular posição ideal (linha no centro da tela, mas não ultrapassar o topo)
        const idealScrollTop = Math.max(0, lineTop - (containerRect.height / 2) + (lineRect.height / 2));
        
        // Usar requestAnimationFrame para melhor performance
        requestAnimationFrame(() => {
            canvasContainer.scrollTo({
                top: idealScrollTop,
                behavior: 'smooth'
            });
        });
    }
}

// Entrar em fullscreen (mobile)
function enterFullscreen() {
    const presentationArea = document.querySelector('.presentation-area');
    
    // Prevenir scroll no body
    document.body.classList.add('presentation-active');
    
    // Adicionar classe fullscreen
    presentationArea.classList.add('fullscreen');
    
    // Tentar usar Fullscreen API (funciona melhor em alguns navegadores)
    if (presentationArea.requestFullscreen) {
        presentationArea.requestFullscreen().catch(err => {
            console.log('Fullscreen API não disponível:', err);
        });
    } else if (presentationArea.webkitRequestFullscreen) {
        presentationArea.webkitRequestFullscreen();
    } else if (presentationArea.mozRequestFullScreen) {
        presentationArea.mozRequestFullScreen();
    } else if (presentationArea.msRequestFullscreen) {
        presentationArea.msRequestFullscreen();
    }
}

// Sair do fullscreen
function exitFullscreen() {
    const presentationArea = document.querySelector('.presentation-area');
    
    // Remover prevenção de scroll
    document.body.classList.remove('presentation-active');
    
    // Remover classe fullscreen
    presentationArea.classList.remove('fullscreen');
    
    // Sair do Fullscreen API
    if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
            console.log('Não estava em fullscreen:', err);
        });
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// Listener para sair do fullscreen quando ESC é pressionado
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        resetPresentation();
    }
});

document.addEventListener('webkitfullscreenchange', () => {
    if (!document.webkitFullscreenElement) {
        resetPresentation();
    }
});

// Log inicial
console.log('🎨 Dashboard Educacional carregado!');
console.log('📝 Digite seu conteúdo e deixe a IA criar visualizações incríveis!');
