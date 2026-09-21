// Application Orchestrator & UI Controller for Vedant Drawing App

document.addEventListener('DOMContentLoaded', () => {
    const canvasContainer = document.getElementById('canvasContainer');
    const engine = new DrawingEngine(canvasContainer);
    window.drawingEngine = engine;

    // Palette Colors
    const PALETTE_COLORS = [
        '#ff3366', // Hot Pink
        '#ff5964', // Coral Red
        '#ff9233', // Bright Orange
        '#ffcc00', // Sunny Yellow
        '#70e000', // Lime Green
        '#38b000', // Grass Green
        '#00b4d8', // Sky Blue
        '#0077b6', // Deep Blue
        '#7209b7', // Purple
        '#b5179e', // Magenta
        '#f72585', // Neon Pink
        '#8338ec', // Violet
        '#9c6644', // Warm Brown
        '#2d3748', // Dark Slate / Black
        '#a0aec0', // Grey
        '#ffffff'  // Pure White
    ];

    // Fun Emojis for Stickers
    const STICKERS = [
        '⭐', '🌟', '💖', '🦄', '🦕', '🐱', '🐶', '🦁', '🚀', '🌈',
        '🍦', '🍭', '🧁', '🍕', '🍓', '🚗', '✈️', '👑', '🎈', '🎉',
        '🌸', '🌻', '🎨', '🔥', '☀️', '🌙', '🌊', '🍀', '🍎', '🧸'
    ];

    // Initialize UI Elements
    initColorPalette();
    initStickerGrid();
    initShapeGrid();
    initTemplateModal();
    initToolButtons();
    initSizeControls();
    initActionButtons();
    initTextToolModal();
    initImageHandlers();
    initKeyboardShortcuts();
    initConfetti();

    // --- Color Palette Initialization ---
    function initColorPalette() {
        const paletteEl = document.getElementById('colorsPalette');
        if (!paletteEl) return;

        paletteEl.innerHTML = '';
        PALETTE_COLORS.forEach((color, idx) => {
            const btn = document.createElement('button');
            btn.className = `color-bubble ${idx === 0 ? 'active' : ''}`;
            btn.style.backgroundColor = color;
            btn.title = color;
            btn.setAttribute('data-color', color);

            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-bubble').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                engine.setColor(color);
                if (window.soundFx) window.soundFx.colorChime(idx * 25);
            });

            paletteEl.appendChild(btn);
        });

        // Custom Color Picker
        const customColorInput = document.getElementById('customColorInput');
        if (customColorInput) {
            customColorInput.addEventListener('input', (e) => {
                document.querySelectorAll('.color-bubble').forEach(b => b.classList.remove('active'));
                const chosenColor = e.target.value;
                engine.setColor(chosenColor);
            });
            customColorInput.addEventListener('change', (e) => {
                if (window.soundFx) window.soundFx.colorChime(180);
            });
        }
    }

    // --- Tools Setup ---
    function initToolButtons() {
        const toolBtns = document.querySelectorAll('.tool-btn[data-tool]');
        const shapesPanel = document.getElementById('shapesPanel');
        const stickersPanel = document.getElementById('stickersPanel');

        toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.getAttribute('data-tool');

                // Toggle subpanels
                if (tool === 'shape') {
                    const isOpen = shapesPanel.classList.contains('active');
                    closeAllSubPanels();
                    if (!isOpen) shapesPanel.classList.add('active');
                } else if (tool === 'sticker') {
                    const isOpen = stickersPanel.classList.contains('active');
                    closeAllSubPanels();
                    if (!isOpen) stickersPanel.classList.add('active');
                } else {
                    closeAllSubPanels();
                }

                // If clicking text tool, open text modal
                if (tool === 'text') {
                    openModal('textModal');
                    return;
                }

                // If clicking image upload, trigger hidden file input
                if (tool === 'image-upload') {
                    const fileInput = document.getElementById('imageFileInput');
                    if (fileInput) fileInput.click();
                    return;
                }

                toolBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                engine.setTool(tool);

                if (window.soundFx) window.soundFx.pop(500);
            });
        });
    }

    function closeAllSubPanels() {
        document.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
    }

    // --- Stickers Setup ---
    function initStickerGrid() {
        const grid = document.getElementById('stickersGrid');
        if (!grid) return;

        grid.innerHTML = '';
        STICKERS.forEach((emoji, idx) => {
            const btn = document.createElement('button');
            btn.className = `sub-item-btn ${idx === 0 ? 'active' : ''}`;
            btn.textContent = emoji;

            btn.addEventListener('click', () => {
                document.querySelectorAll('#stickersGrid .sub-item-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                engine.setSticker(emoji);
                engine.setTool('sticker');
                
                // Activate sticker tool button in dock
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                document.querySelector('.tool-btn[data-tool="sticker"]')?.classList.add('active');
                
                closeAllSubPanels();
                if (window.soundFx) window.soundFx.pop(600);
            });

            grid.appendChild(btn);
        });
    }

    // --- Shapes Setup ---
    function initShapeGrid() {
        const shapeBtns = document.querySelectorAll('#shapesGrid .sub-item-btn');
        const fillToggle = document.getElementById('shapeFillToggle');

        shapeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                shapeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const shape = btn.getAttribute('data-shape');
                const isFilled = fillToggle ? fillToggle.checked : false;
                
                engine.setShape(shape, isFilled);
                engine.setTool('shape');

                // Activate shapes tool button in dock
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                document.querySelector('.tool-btn[data-tool="shape"]')?.classList.add('active');

                closeAllSubPanels();
                if (window.soundFx) window.soundFx.pop(480);
            });
        });

        if (fillToggle) {
            fillToggle.addEventListener('change', () => {
                const activeShapeBtn = document.querySelector('#shapesGrid .sub-item-btn.active');
                const shape = activeShapeBtn ? activeShapeBtn.getAttribute('data-shape') : 'heart';
                engine.setShape(shape, fillToggle.checked);
            });
        }
    }

    // --- Size Controls Setup ---
    function initSizeControls() {
        const sizePills = document.querySelectorAll('.size-pill');
        const sizeSlider = document.getElementById('brushSizeSlider');

        sizePills.forEach(pill => {
            pill.addEventListener('click', () => {
                sizePills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const size = parseInt(pill.getAttribute('data-size'), 10);
                engine.setBrushSize(size);
                if (sizeSlider) sizeSlider.value = size;
                if (window.soundFx) window.soundFx.pop(400);
            });
        });

        if (sizeSlider) {
            sizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value, 10);
                engine.setBrushSize(size);
                sizePills.forEach(p => p.classList.remove('active'));
            });
        }
    }

    // --- Action Buttons (Undo, Redo, Clear, Save, Print, Sound) ---
    function initActionButtons() {
        // Undo / Redo
        const btnUndo = document.getElementById('btnUndo');
        const btnRedo = document.getElementById('btnRedo');

        if (btnUndo) btnUndo.addEventListener('click', () => engine.undo());
        if (btnRedo) btnRedo.addEventListener('click', () => engine.redo());

        // Clear Canvas Modal Confirmation
        const btnClear = document.getElementById('btnClear');
        if (btnClear) {
            btnClear.addEventListener('click', () => openModal('clearConfirmModal'));
        }

        const btnConfirmClear = document.getElementById('btnConfirmClear');
        if (btnConfirmClear) {
            btnConfirmClear.addEventListener('click', () => {
                engine.clearCanvas();
                closeModal('clearConfirmModal');
            });
        }

        // Save / Download
        const btnSave = document.getElementById('btnSave');
        if (btnSave) {
            btnSave.addEventListener('click', () => {
                engine.exportImage('vedant-drawing.png');
                triggerConfettiBurst();
            });
        }

        // Print
        const btnPrint = document.getElementById('btnPrint');
        if (btnPrint) {
            btnPrint.addEventListener('click', () => engine.printCanvas());
        }

        // Coloring Templates Modal trigger
        const btnTemplates = document.getElementById('btnTemplates');
        if (btnTemplates) {
            btnTemplates.addEventListener('click', () => openModal('templatesModal'));
        }

        // Sound Toggle
        const btnSound = document.getElementById('btnSound');
        if (btnSound) {
            btnSound.addEventListener('click', () => {
                const isEnabled = window.soundFx.toggle();
                btnSound.innerHTML = isEnabled ? '🔊' : '🔇';
                btnSound.classList.toggle('active', isEnabled);
                if (isEnabled) window.soundFx.pop(600);
            });
        }

        // Confetti Party button
        const btnParty = document.getElementById('btnParty');
        if (btnParty) {
            btnParty.addEventListener('click', () => {
                triggerConfettiBurst();
                if (window.soundFx) window.soundFx.cheer();
            });
        }

        // Image Transform Confirmation Buttons
        const btnCommitImage = document.getElementById('btnCommitImage');
        const btnCancelImage = document.getElementById('btnCancelImage');
        if (btnCommitImage) btnCommitImage.addEventListener('click', () => engine.commitActiveImage());
        if (btnCancelImage) btnCancelImage.addEventListener('click', () => engine.cancelActiveImage());

        // Modal Close buttons
        document.querySelectorAll('.modal-close, .btn-modal-cancel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                if (modal) modal.classList.remove('open');
            });
        });

        // Close subpanels when clicking anywhere on canvas
        canvasContainer.addEventListener('pointerdown', () => closeAllSubPanels());
    }

    // --- Templates Modal Setup ---
    function initTemplateModal() {
        const grid = document.getElementById('templatesGrid');
        if (!grid || !window.COLORING_TEMPLATES) return;

        grid.innerHTML = '';

        // Blank Canvas Card Option
        const blankCard = document.createElement('div');
        blankCard.className = 'template-card';
        blankCard.innerHTML = `
            <div class="template-emoji">📄</div>
            <div class="template-name">Blank Canvas</div>
        `;
        blankCard.addEventListener('click', () => {
            engine.clearTemplate();
            engine.clearCanvas();
            closeModal('templatesModal');
            if (window.soundFx) window.soundFx.pop(500);
        });
        grid.appendChild(blankCard);

        // Render Coloring Book Templates
        window.COLORING_TEMPLATES.forEach(tmpl => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.innerHTML = `
                <div class="template-emoji">${tmpl.emoji}</div>
                <div class="template-name">${tmpl.name}</div>
            `;
            card.addEventListener('click', () => {
                engine.loadTemplate(tmpl.id);
                closeModal('templatesModal');
                triggerConfettiBurst();
            });
            grid.appendChild(card);
        });
    }

    // --- Text Tool Setup ---
    function initTextToolModal() {
        const textInput = document.getElementById('textToolInput');
        const fontBtns = document.querySelectorAll('.font-option-btn');
        const btnAddText = document.getElementById('btnAddText');
        let selectedFont = "'Bubblegum Sans', cursive";

        fontBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                fontBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedFont = btn.getAttribute('data-font');
            });
        });

        if (btnAddText) {
            btnAddText.addEventListener('click', () => {
                const text = textInput ? textInput.value.trim() : '';
                if (text) {
                    const cx = engine.width / 2;
                    const cy = engine.height / 2;
                    engine.addText(text, cx, cy, {
                        fontFamily: selectedFont,
                        fontSize: engine.brushSize * 2.5 + 24,
                        color: engine.color
                    });
                    if (textInput) textInput.value = '';
                }
                closeModal('textModal');
            });
        }
    }

    // --- Image Handling (Clipboard Paste, Drag-and-Drop, File Upload) ---
    function initImageHandlers() {
        const fileInput = document.getElementById('imageFileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (evt) => engine.insertImage(evt.target.result);
                    reader.readAsDataURL(file);
                }
                fileInput.value = ''; // Reset input
            });
        }

        // Paste Event (Clipboard Ctrl+V / Cmd+V)
        window.addEventListener('paste', (e) => {
            const items = (e.clipboardData || window.clipboardData).items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    const reader = new FileReader();
                    reader.onload = (evt) => engine.insertImage(evt.target.result);
                    reader.readAsDataURL(blob);
                    e.preventDefault();
                    break;
                }
            }
        });

        // Drag & Drop
        window.addEventListener('dragover', (e) => e.preventDefault());
        window.addEventListener('drop', (e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (evt) => engine.insertImage(evt.target.result);
                    reader.readAsDataURL(file);
                }
            }
        });
    }

    // --- Keyboard Shortcuts ---
    function initKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            // Ignore if typing in text input
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                if (e.shiftKey) engine.redo();
                else engine.undo();
                e.preventDefault();
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                engine.redo();
                e.preventDefault();
            } else if (e.key === 'Escape') {
                closeAllSubPanels();
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
                engine.cancelActiveImage();
            } else if (e.key === 'Enter' && engine.activeImageObj) {
                engine.commitActiveImage();
            }
        });
    }

    // --- Modal Helpers ---
    function openModal(modalId) {
        closeAllSubPanels();
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
            if (window.soundFx) window.soundFx.pop(450);
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('open');
    }

    // --- Confetti Celebration Particles ---
    function initConfetti() {
        const confettiCanvas = document.getElementById('confettiCanvas');
        if (!confettiCanvas) return;

        const ctx = confettiCanvas.getContext('2d');
        let particles = [];
        let animationId = null;

        function resizeConfetti() {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeConfetti);
        resizeConfetti();

        window.triggerConfettiBurst = function() {
            const count = 120;
            const colors = ['#ff3366', '#ff9233', '#ffcc00', '#70e000', '#00b4d8', '#7209b7', '#f72585'];

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: window.innerWidth / 2 + (Math.random() * 80 - 40),
                    y: window.innerHeight / 2 + (Math.random() * 80 - 40),
                    vx: (Math.random() - 0.5) * 18,
                    vy: (Math.random() - 0.7) * 22,
                    size: Math.random() * 10 + 6,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rotation: Math.random() * 360,
                    vRot: (Math.random() - 0.5) * 12,
                    alpha: 1,
                    decay: Math.random() * 0.015 + 0.008
                });
            }

            if (!animationId) {
                renderConfetti();
            }
        };

        function renderConfetti() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.45; // gravity
                p.rotation += p.vRot;
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }

            if (particles.length > 0) {
                animationId = requestAnimationFrame(renderConfetti);
            } else {
                animationId = null;
                ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            }
        }
    }
});
