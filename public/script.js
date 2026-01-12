// Estado da aplicação
let currentContent = null;
let currentElementIndex = 0;
let isPresentationMode = false;
let charts = [];

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
    switch (element.type) {
        case 'text':
            return `Texto: ${element.content.substring(0, 30)}...`;
        case 'chart':
            return `Gráfico: ${element.title || element.chartType}`;
        case 'table':
            return 'Tabela';
        case 'list':
            return 'Lista';
        case 'math':
            return `Matemática: ${element.content}`;
        default:
            return 'Elemento';
    }
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
    elements.progressFill.style.width = '0%';
    
    showStatus('📺 Modo Apresentação: Pressione ENTER para avançar', 'success');
}

// Resetar apresentação
function resetPresentation() {
    isPresentationMode = false;
    currentElementIndex = 0;
    elements.contentDisplay.innerHTML = '';
    elements.progressFill.style.width = '0%';
    elements.playBtn.classList.remove('hidden');
    elements.pauseBtn.classList.add('hidden');
    
    // Limpar gráficos anteriores
    charts.forEach(chart => chart.destroy());
    charts = [];
}

// Mostrar próximo elemento
function showNextElement() {
    if (!isPresentationMode || !currentContent || currentElementIndex >= currentContent.elements.length) {
        if (currentElementIndex >= currentContent.elements.length) {
            isPresentationMode = false;
            showStatus('✅ Apresentação concluída!', 'success');
            elements.playBtn.classList.remove('hidden');
            elements.pauseBtn.classList.add('hidden');
        }
        return;
    }
    
    const element = currentContent.elements[currentElementIndex];
    renderElement(element);
    
    // Atualizar barra de progresso
    const progress = ((currentElementIndex + 1) / currentContent.elements.length) * 100;
    elements.progressFill.style.width = `${progress}%`;
    
    currentElementIndex++;
}

// Renderizar elemento
function renderElement(element) {
    const container = document.createElement('div');
    container.className = 'content-element';
    
    // Aplicar animações baseadas no tipo
    const animationDuration = element.animation?.duration || (element.type === 'text' ? 1.5 : 2.5);
    container.style.setProperty('--animation-duration', `${animationDuration}s`);
    
    switch (element.type) {
        case 'text':
            container.classList.add('fade-slide-animation');
            renderText(element, container);
            break;
        case 'chart':
            renderChart(element, container, animationDuration);
            break;
        case 'table':
            container.classList.add('fade-slide-animation');
            renderTable(element, container);
            break;
        case 'list':
            container.classList.add('fade-slide-animation');
            renderList(element, container);
            break;
        case 'math':
            container.classList.add('fade-slide-animation');
            renderMath(element, container);
            break;
        default:
            container.innerHTML = `<p>${element.content}</p>`;
    }
    
    elements.contentDisplay.appendChild(container);
    
    // Scroll para o novo elemento
    container.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

// Renderizar texto com destaques
function renderText(element, container) {
    let content = element.content;
    const highlights = element.highlights || [];
    const colors = ['highlight-yellow', 'highlight-green', 'highlight-pink', 'highlight-blue'];
    
    highlights.forEach((word, index) => {
        const color = colors[index % colors.length];
        const regex = new RegExp(`(${escapeRegex(word)})`, 'gi');
        content = content.replace(regex, `<span class="highlight ${color}">$1</span>`);
    });
    
    container.innerHTML = `<div class="content-text">${content}</div>`;
}

// Renderizar gráfico com animação progressiva
function renderChart(element, container, animationDuration) {
    const { chartType, data, title } = element;
    
    if (title) {
        const titleElement = document.createElement('div');
        titleElement.className = 'chart-title fade-slide-animation';
        titleElement.style.setProperty('--animation-duration', `${animationDuration * 0.3}s`);
        titleElement.textContent = title;
        container.appendChild(titleElement);
    }
    
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    
    const canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);
    container.appendChild(chartContainer);
    
    // Cores hand-drawn
    const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)'
    ];
    
    const borderColors = colors.map(c => c.replace('0.7', '1'));
    
    // Configuração de animação do Chart.js
    const animationConfig = {
        duration: animationDuration * 1000,
        easing: 'easeInOutQuart',
        delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default') {
                delay = context.dataIndex * (animationDuration * 100);
            }
            return delay;
        }
    };
    
    const chartConfig = {
        type: chartType || 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: title || 'Dados',
                data: data.values,
                backgroundColor: colors.slice(0, data.values.length),
                borderColor: borderColors.slice(0, data.values.length),
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: animationConfig,
            plugins: {
                legend: {
                    display: chartType === 'pie',
                    labels: {
                        font: {
                            family: "'Patrick Hand', cursive",
                            size: 16
                        }
                    }
                }
            },
            scales: chartType !== 'pie' ? {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: "'Patrick Hand', cursive",
                            size: 14
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: "'Patrick Hand', cursive",
                            size: 14
                        }
                    }
                }
            } : {}
        }
    };
    
    const chart = new Chart(canvas, chartConfig);
    charts.push(chart);
}

// Renderizar tabela
function renderTable(element, container) {
    const { headers, rows } = element.data;
    
    let html = '<div class="table-container"><table>';
    
    // Cabeçalho
    html += '<thead><tr>';
    headers.forEach(header => {
        html += `<th>${header}</th>`;
    });
    html += '</tr></thead>';
    
    // Linhas
    html += '<tbody>';
    rows.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
            html += `<td>${cell}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table></div>';
    
    container.innerHTML = html;
}

// Renderizar lista
function renderList(element, container) {
    const items = element.items || [];
    
    let html = '<div class="list-container"><ul>';
    items.forEach(item => {
        html += `<li>${item}</li>`;
    });
    html += '</ul></div>';
    
    container.innerHTML = html;
}

// Renderizar expressão matemática
function renderMath(element, container) {
    container.innerHTML = `<div class="math-expression">${element.content}</div>`;
}

// Escapar caracteres especiais para regex
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Log inicial
console.log('🎨 Dashboard Educacional carregado!');
console.log('📝 Digite seu conteúdo e deixe a IA criar visualizações incríveis!');
