// Core Drawing Canvas Engine for Vedant Drawing App

class DrawingEngine {
    constructor(containerEl) {
        this.container = containerEl;
        
        // Layers
        this.bgCanvas = document.createElement('canvas'); // Base white background
        this.drawCanvas = document.createElement('canvas'); // Paint & user strokes
        this.templateCanvas = document.createElement('canvas'); // Coloring template outline
        this.previewCanvas = document.createElement('canvas'); // Live preview for shapes & tools

        this.bgCtx = this.bgCanvas.getContext('2d');
        this.drawCtx = this.drawCanvas.getContext('2d', { willReadFrequently: true });
        this.templateCtx = this.templateCanvas.getContext('2d', { willReadFrequently: true });
        this.previewCtx = this.previewCanvas.getContext('2d');

        // Apply classes
        this.bgCanvas.className = 'layer-canvas layer-bg';
        this.drawCanvas.className = 'layer-canvas layer-draw';
        this.templateCanvas.className = 'layer-canvas layer-template';
        this.previewCanvas.className = 'layer-canvas layer-preview';

        this.container.appendChild(this.bgCanvas);
        this.container.appendChild(this.drawCanvas);
        this.container.appendChild(this.templateCanvas);
        this.container.appendChild(this.previewCanvas);

        // State
        this.tool = 'brush'; // 'brush', 'rainbow', 'glow', 'sparkle', 'crayon', 'eraser', 'bucket', 'shape', 'sticker', 'text'
        this.brushSize = 14;
        this.color = '#ff3366'; // Vibrant kid-friendly pink default
        this.shape = 'heart'; // 'heart', 'star', 'circle', 'rectangle', 'triangle', 'cloud', 'sun', 'flower', 'line', 'arrow'
        this.shapeFilled = false;
        this.currentTemplateId = null;
        this.selectedSticker = '⭐';
        
        // Rainbow Hue tracker
        this.rainbowHue = 0;

        // History Stacks
        this.history = [];
        this.redoStack = [];
        this.maxHistory = 30;

        // Pointer Tracking
        this.isDrawing = false;
        this.points = [];
        this.startPos = { x: 0, y: 0 };
        this.lastPos = { x: 0, y: 0 };

        // Active Floating Image Object (for paste/upload transform)
        this.activeImageObj = null;

        // Resize & Retina setup
        this.dpr = window.devicePixelRatio || 1;
        this.width = 0;
        this.height = 0;

        this.initCanvasSize();
        this.bindEvents();
        this.saveState(); // Initial blank state
    }

    initCanvasSize() {
        const rect = this.container.getBoundingClientRect();
        const w = Math.max(rect.width, 320);
        const h = Math.max(rect.height, 320);

        this.width = w;
        this.height = h;

        [this.bgCanvas, this.drawCanvas, this.templateCanvas, this.previewCanvas].forEach(c => {
            c.width = w * this.dpr;
            c.height = h * this.dpr;
            c.style.width = `${w}px`;
            c.style.height = `${h}px`;
        });

        [this.bgCtx, this.drawCtx, this.templateCtx, this.previewCtx].forEach(ctx => {
            ctx.scale(this.dpr, this.dpr);
        });

        // Initialize background to white
        this.bgCtx.fillStyle = '#ffffff';
        this.bgCtx.fillRect(0, 0, this.width, this.height);

        // Redraw template if one was loaded
        if (this.currentTemplateId) {
            this.renderTemplate(this.currentTemplateId);
        }
    }

    handleResize() {
        // Preserve current drawing data during resize
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.drawCanvas.width;
        tempCanvas.height = this.drawCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(this.drawCanvas, 0, 0);

        this.initCanvasSize();

        // Restore drawing onto scaled canvas
        this.drawCtx.save();
        this.drawCtx.setTransform(1, 0, 0, 1, 0, 0);
        this.drawCtx.drawImage(tempCanvas, 0, 0, this.drawCanvas.width, this.drawCanvas.height);
        this.drawCtx.restore();
    }

    bindEvents() {
        const el = this.previewCanvas; // Topmost canvas catches all pointer events

        el.addEventListener('pointerdown', this.onPointerDown.bind(this), { passive: false });
        window.addEventListener('pointermove', this.onPointerMove.bind(this), { passive: false });
        window.addEventListener('pointerup', this.onPointerUp.bind(this), { passive: false });
        window.addEventListener('pointercancel', this.onPointerUp.bind(this), { passive: false });

        // Prevent default touch behaviors like scrolling/zooming on the canvas
        el.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
        el.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

        window.addEventListener('resize', () => {
            clearTimeout(this._resizeTimer);
            this._resizeTimer = setTimeout(() => this.handleResize(), 150);
        });
    }

    getPointerPos(e) {
        const rect = this.container.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    // Setters
    setTool(tool) {
        this.tool = tool;
        if (tool !== 'image') {
            this.commitActiveImage();
        }
    }

    setColor(color) {
        this.color = color;
    }

    setBrushSize(size) {
        this.brushSize = Math.max(2, Math.min(120, size));
    }

    setShape(shape, filled = false) {
        this.shape = shape;
        this.shapeFilled = filled;
    }

    setSticker(sticker) {
        this.selectedSticker = sticker;
    }

    // --- State & History Management ---

    saveState() {
        if (this.history.length >= this.maxHistory) {
            this.history.shift();
        }
        // Save drawing layer snapshot
        const snapshot = this.drawCtx.getImageData(0, 0, this.drawCanvas.width, this.drawCanvas.height);
        this.history.push({
            drawData: snapshot,
            templateId: this.currentTemplateId
        });
        this.redoStack = []; // Clear redo stack on new action
        this.updateHistoryButtons();
    }

    undo() {
        if (this.history.length <= 1) return false;
        
        const currentState = this.history.pop();
        this.redoStack.push(currentState);
        
        const prevState = this.history[this.history.length - 1];
        this.restoreState(prevState);
        this.updateHistoryButtons();
        if (window.soundFx) window.soundFx.swoosh(false);
        return true;
    }

    redo() {
        if (this.redoStack.length === 0) return false;
        
        const nextState = this.redoStack.pop();
        this.history.push(nextState);
        
        this.restoreState(nextState);
        this.updateHistoryButtons();
        if (window.soundFx) window.soundFx.swoosh(true);
        return true;
    }

    restoreState(state) {
        this.drawCtx.save();
        this.drawCtx.setTransform(1, 0, 0, 1, 0, 0);
        this.drawCtx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height);
        this.drawCtx.putImageData(state.drawData, 0, 0);
        this.drawCtx.restore();

        if (this.currentTemplateId !== state.templateId) {
            this.currentTemplateId = state.templateId;
            if (this.currentTemplateId) {
                this.renderTemplate(this.currentTemplateId);
            } else {
                this.clearTemplate();
            }
        }
    }

    updateHistoryButtons() {
        const undoBtn = document.getElementById('btnUndo');
        const redoBtn = document.getElementById('btnRedo');
        if (undoBtn) undoBtn.disabled = this.history.length <= 1;
        if (redoBtn) redoBtn.disabled = this.redoStack.length === 0;
    }

    clearCanvas() {
        this.drawCtx.save();
        this.drawCtx.setTransform(1, 0, 0, 1, 0, 0);
        this.drawCtx.clearRect(0, 0, this.drawCanvas.width, this.drawCanvas.height);
        this.drawCtx.restore();

        this.previewCtx.clearRect(0, 0, this.width, this.height);
        this.commitActiveImage();
        this.saveState();
        if (window.soundFx) window.soundFx.eraser();
    }

    // --- Template Management ---

    loadTemplate(templateId) {
        this.currentTemplateId = templateId;
        this.clearCanvas();
        this.renderTemplate(templateId);
        this.saveState();
        if (window.soundFx) window.soundFx.magicSparkle();
    }

    clearTemplate() {
        this.currentTemplateId = null;
        this.templateCtx.clearRect(0, 0, this.width, this.height);
    }

    renderTemplate(templateId) {
        this.templateCtx.clearRect(0, 0, this.width, this.height);
        if (!templateId || !window.COLORING_TEMPLATES) return;
        
        const tmpl = window.COLORING_TEMPLATES.find(t => t.id === templateId);
        if (tmpl && tmpl.render) {
            tmpl.render(this.templateCtx, this.width, this.height);
        }
    }

    // --- Pointer Events Handlers ---

    onPointerDown(e) {
        e.preventDefault();
        const pos = this.getPointerPos(e);
        this.isDrawing = true;
        this.startPos = pos;
        this.lastPos = pos;
        this.points = [pos];

        // Handle Active Image transform interactions
        if (this.activeImageObj) {
            if (this.handleImagePointerDown(pos)) {
                return;
            } else {
                this.commitActiveImage();
            }
        }

        if (this.tool === 'bucket') {
            this.isDrawing = false;
            this.floodFill(Math.round(pos.x), Math.round(pos.y), this.color);
            this.saveState();
            if (window.soundFx) window.soundFx.splash();
            return;
        }

        if (this.tool === 'sticker') {
            this.isDrawing = false;
            this.stampSticker(pos.x, pos.y, this.selectedSticker, this.brushSize * 3);
            this.saveState();
            if (window.soundFx) window.soundFx.pop(550);
            return;
        }

        if (this.tool === 'eraser') {
            if (window.soundFx) window.soundFx.eraser();
            this.drawDot(pos.x, pos.y, true);
        } else if (this.tool === 'shape') {
            // Shape starts on pointerdown and previews on pointermove
            this.renderShapePreview(this.startPos, pos);
        } else {
            // Regular brush dot
            this.drawDot(pos.x, pos.y);
            if (this.tool === 'rainbow' || this.tool === 'sparkle') {
                if (window.soundFx) window.soundFx.magicSparkle();
            }
        }
    }

    onPointerMove(e) {
        if (!this.isDrawing) {
            this.updateCursorPreview(this.getPointerPos(e));
            return;
        }
        e.preventDefault();
        const pos = this.getPointerPos(e);

        if (this.activeImageObj && this.isTransformingImage) {
            this.handleImagePointerMove(pos);
            return;
        }

        if (this.tool === 'shape') {
            this.renderShapePreview(this.startPos, pos);
            this.lastPos = pos;
            return;
        }

        this.points.push(pos);
        this.drawSmoothStroke(this.points, this.tool === 'eraser');
        this.lastPos = pos;
    }

    onPointerUp(e) {
        if (!this.isDrawing) return;
        this.isDrawing = false;

        if (this.activeImageObj && this.isTransformingImage) {
            this.isTransformingImage = false;
            return;
        }

        if (this.tool === 'shape') {
            const pos = this.getPointerPos(e);
            this.previewCtx.clearRect(0, 0, this.width, this.height);
            this.drawShape(this.drawCtx, this.startPos, pos, this.shape, this.shapeFilled, this.color, this.brushSize);
            this.saveState();
            if (window.soundFx) window.soundFx.pop(480);
            return;
        }

        if (['brush', 'rainbow', 'glow', 'sparkle', 'crayon', 'eraser'].includes(this.tool)) {
            this.points = [];
            this.saveState();
        }
    }

    // --- Drawing Primitives & Brushes ---

    drawDot(x, y, isEraser = false) {
        const ctx = this.drawCtx;
        ctx.save();
        
        if (isEraser) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = this.getCurrentStrokeColor();
            if (this.tool === 'glow') {
                ctx.shadowColor = this.color;
                ctx.shadowBlur = this.brushSize * 1.5;
            }
            ctx.beginPath();
            ctx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
            ctx.fill();

            if (this.tool === 'sparkle') {
                this.drawSparkleParticle(ctx, x, y, this.brushSize);
            }
        }
        ctx.restore();
    }

    drawSmoothStroke(points, isEraser = false) {
        if (points.length < 2) return;
        const ctx = this.drawCtx;
        ctx.save();

        const p1 = points[points.length - 2];
        const p2 = points[points.length - 1];
        const midPoint = {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2
        };

        if (isEraser) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = this.brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        } else {
            ctx.strokeStyle = this.getCurrentStrokeColor();
            ctx.lineWidth = this.brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            if (this.tool === 'glow') {
                ctx.shadowColor = this.color;
                ctx.shadowBlur = this.brushSize * 1.2;
            } else if (this.tool === 'crayon') {
                ctx.globalAlpha = 0.75;
                // Add minor jitter for chalk/crayon feel
                ctx.lineWidth = this.brushSize + (Math.random() * 4 - 2);
            }

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            if (this.tool === 'sparkle' && Math.random() < 0.45) {
                this.drawSparkleParticle(ctx, p2.x, p2.y, this.brushSize);
            }
        }
        ctx.restore();
    }

    getCurrentStrokeColor() {
        if (this.tool === 'rainbow') {
            this.rainbowHue = (this.rainbowHue + 4) % 360;
            return `hsl(${this.rainbowHue}, 95%, 55%)`;
        }
        return this.color;
    }

    drawSparkleParticle(ctx, x, y, size) {
        ctx.save();
        const colors = ['#ffd700', '#ff69b4', '#00ffff', '#7fff00', '#ff4500', '#ffffff'];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 6;

        const sparkR = size * (0.4 + Math.random() * 0.5);
        const jx = x + (Math.random() * size * 1.5 - size * 0.75);
        const jy = y + (Math.random() * size * 1.5 - size * 0.75);

        // Draw 4-point star twinkle
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const r = (i % 2 === 0) ? sparkR : sparkR * 0.3;
            const angle = (i * Math.PI) / 4;
            const px = jx + r * Math.cos(angle);
            const py = jy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // --- Shapes Engine ---

    renderShapePreview(start, end) {
        this.previewCtx.clearRect(0, 0, this.width, this.height);
        this.drawShape(this.previewCtx, start, end, this.shape, this.shapeFilled, this.color, this.brushSize, true);
    }

    drawShape(ctx, p1, p2, shapeType, filled, color, strokeWidth, isPreview = false) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (isPreview) {
            ctx.setLineDash([8, 6]);
            ctx.globalAlpha = 0.85;
        }

        const minX = Math.min(p1.x, p2.x);
        const minY = Math.min(p1.y, p2.y);
        const w = Math.abs(p2.x - p1.x);
        const h = Math.abs(p2.y - p1.y);
        const cx = minX + w / 2;
        const cy = minY + h / 2;

        ctx.beginPath();

        switch (shapeType) {
            case 'rectangle':
                ctx.roundRect(minX, minY, w, h, 14);
                break;

            case 'circle':
            case 'oval':
                ctx.ellipse(cx, cy, Math.max(w / 2, 1), Math.max(h / 2, 1), 0, 0, Math.PI * 2);
                break;

            case 'triangle':
                ctx.moveTo(cx, minY);
                ctx.lineTo(minX + w, minY + h);
                ctx.lineTo(minX, minY + h);
                ctx.closePath();
                break;

            case 'heart': {
                const topCurveHeight = h * 0.3;
                ctx.moveTo(cx, minY + topCurveHeight);
                // top left curve
                ctx.bezierCurveTo(cx, minY, minX, minY, minX, minY + topCurveHeight);
                // bottom left curve
                ctx.bezierCurveTo(minX, minY + (h + topCurveHeight) / 2, cx, minY + (h + topCurveHeight) / 2, cx, minY + h);
                // bottom right curve
                ctx.bezierCurveTo(cx, minY + (h + topCurveHeight) / 2, minX + w, minY + (h + topCurveHeight) / 2, minX + w, minY + topCurveHeight);
                // top right curve
                ctx.bezierCurveTo(minX + w, minY, cx, minY, cx, minY + topCurveHeight);
                ctx.closePath();
                break;
            }

            case 'star': {
                const spikes = 5;
                const outerR = Math.max(w, h) / 2;
                const innerR = outerR * 0.45;
                for (let i = 0; i < spikes * 2; i++) {
                    const r = (i % 2 === 0) ? outerR : innerR;
                    const angle = (i * Math.PI) / spikes - Math.PI / 2;
                    const x = cx + r * Math.cos(angle);
                    const y = cy + r * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                break;
            }

            case 'cloud': {
                const rx = w / 2;
                const ry = h / 2;
                ctx.arc(cx - rx * 0.4, cy + ry * 0.2, ry * 0.6, Math.PI * 0.7, Math.PI * 1.8);
                ctx.arc(cx, cy - ry * 0.3, ry * 0.7, Math.PI * 1.1, Math.PI * 2.1);
                ctx.arc(cx + rx * 0.4, cy + ry * 0.2, ry * 0.6, Math.PI * 1.4, Math.PI * 2.5);
                ctx.arc(cx, cy + ry * 0.5, ry * 0.5, 0, Math.PI);
                ctx.closePath();
                break;
            }

            case 'sun': {
                const r = Math.min(w, h) * 0.32;
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                if (filled) ctx.fill();
                ctx.stroke();

                // Sun Rays
                const numRays = 8;
                for (let i = 0; i < numRays; i++) {
                    const angle = (i * 2 * Math.PI) / numRays;
                    const r1 = r * 1.2;
                    const r2 = r * 1.6;
                    ctx.beginPath();
                    ctx.moveTo(cx + r1 * Math.cos(angle), cy + r1 * Math.sin(angle));
                    ctx.lineTo(cx + r2 * Math.cos(angle), cy + r2 * Math.sin(angle));
                    ctx.stroke();
                }
                ctx.restore();
                return;
            }

            case 'flower': {
                const r = Math.min(w, h) * 0.22;
                const numPetals = 6;
                for (let i = 0; i < numPetals; i++) {
                    const angle = (i * 2 * Math.PI) / numPetals;
                    const px = cx + (r * 1.6) * Math.cos(angle);
                    const py = cy + (r * 1.6) * Math.sin(angle);
                    ctx.beginPath();
                    ctx.arc(px, py, r * 0.9, 0, Math.PI * 2);
                    if (filled) ctx.fill();
                    ctx.stroke();
                }
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                if (filled) ctx.fill();
                ctx.stroke();
                ctx.restore();
                return;
            }

            case 'line':
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                break;

            case 'arrow': {
                const headLen = Math.max(16, strokeWidth * 2.5);
                const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(p2.x, p2.y);
                ctx.lineTo(p2.x - headLen * Math.cos(angle - Math.PI / 6), p2.y - headLen * Math.sin(angle - Math.PI / 6));
                ctx.lineTo(p2.x - headLen * Math.cos(angle + Math.PI / 6), p2.y - headLen * Math.sin(angle + Math.PI / 6));
                ctx.closePath();
                ctx.fill();
                ctx.restore();
                return;
            }
        }

        if (filled) {
            ctx.fill();
        }
        ctx.stroke();
        ctx.restore();
    }

    // --- Stamp Stickers & Text ---

    stampSticker(x, y, sticker, size = 48) {
        const ctx = this.drawCtx;
        ctx.save();
        ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sticker, x, y);
        ctx.restore();
    }

    addText(text, x, y, options = {}) {
        const {
            fontFamily = 'Bubblegum Sans, cursive',
            fontSize = 36,
            color = this.color,
            isFilled = true
        } = options;

        const ctx = this.drawCtx;
        ctx.save();
        ctx.font = `bold ${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (isFilled) {
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
        }
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.strokeText(text, x, y);
        if (isFilled) {
            ctx.fillText(text, x, y);
        }

        ctx.restore();
        this.saveState();
        if (window.soundFx) window.soundFx.pop(600);
    }

    // --- Fast Flood Fill (Bucket Tool) ---

    floodFill(startX, startY, fillColorHex) {
        const dpr = this.dpr;
        const targetCanvas = this.drawCanvas;
        const ctx = this.drawCtx;

        const physicalX = Math.round(startX * dpr);
        const physicalY = Math.round(startY * dpr);
        const w = targetCanvas.width;
        const h = targetCanvas.height;

        if (physicalX < 0 || physicalX >= w || physicalY < 0 || physicalY >= h) return;

        // Parse Fill Color RGB
        const fillRGB = this.hexToRgb(fillColorHex);

        // Get Composite pixel data (Draw layer + Template layer)
        const drawData = ctx.getImageData(0, 0, w, h);
        const drawPixels = drawData.data;

        let templatePixels = null;
        if (this.currentTemplateId) {
            const templateData = this.templateCtx.getImageData(0, 0, w, h);
            templatePixels = templateData.data;
        }

        const startIdx = (physicalY * w + physicalX) * 4;
        const startR = drawPixels[startIdx];
        const startG = drawPixels[startIdx + 1];
        const startB = drawPixels[startIdx + 2];
        const startA = drawPixels[startIdx + 3];

        // If clicking on dark outline lines from the template, ignore fill
        if (templatePixels && templatePixels[startIdx + 3] > 180 && templatePixels[startIdx] < 80) {
            return;
        }

        // Check if already same color
        if (startR === fillRGB.r && startG === fillRGB.g && startB === fillRGB.b && startA === 255) {
            return;
        }

        const tolerance = 42; // Soft tolerance for anti-aliasing edges
        const matchStart = (idx) => {
            // Check if template outline is blocking here
            if (templatePixels && templatePixels[idx + 3] > 150 && templatePixels[idx] < 90) {
                return false;
            }
            const dr = Math.abs(drawPixels[idx] - startR);
            const dg = Math.abs(drawPixels[idx + 1] - startG);
            const db = Math.abs(drawPixels[idx + 2] - startB);
            const da = Math.abs(drawPixels[idx + 3] - startA);
            return (dr + dg + db + da) <= tolerance * 4;
        };

        // Queue-based BFS Scanline Flood Fill
        const queue = [physicalX, physicalY];
        const visited = new Uint8Array(w * h);

        while (queue.length > 0) {
            const cy = queue.pop();
            const cx = queue.pop();

            let left = cx;
            let right = cx;
            let idx = (cy * w + cx) * 4;

            if (visited[cy * w + cx]) continue;

            // Find left bound
            while (left > 0) {
                const nextIdx = (cy * w + (left - 1)) * 4;
                if (!matchStart(nextIdx) || visited[cy * w + (left - 1)]) break;
                left--;
            }

            // Find right bound
            while (right < w - 1) {
                const nextIdx = (cy * w + (right + 1)) * 4;
                if (!matchStart(nextIdx) || visited[cy * w + (right + 1)]) break;
                right++;
            }

            // Fill span
            for (let x = left; x <= right; x++) {
                const pIdx = (cy * w + x) * 4;
                visited[cy * w + x] = 1;
                drawPixels[pIdx] = fillRGB.r;
                drawPixels[pIdx + 1] = fillRGB.g;
                drawPixels[pIdx + 2] = fillRGB.b;
                drawPixels[pIdx + 3] = 255; // Solid fill

                // Scan line above
                if (cy > 0) {
                    const upIdx = ((cy - 1) * w + x) * 4;
                    if (!visited[(cy - 1) * w + x] && matchStart(upIdx)) {
                        queue.push(x, cy - 1);
                    }
                }
                // Scan line below
                if (cy < h - 1) {
                    const downIdx = ((cy + 1) * w + x) * 4;
                    if (!visited[(cy + 1) * w + x] && matchStart(downIdx)) {
                        queue.push(x, cy + 1);
                    }
                }
            }
        }

        ctx.putImageData(drawData, 0, 0);
    }

    hexToRgb(hex) {
        let c = hex.replace('#', '');
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        const num = parseInt(c, 16);
        return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255
        };
    }

    // --- Active Image Paste & Placement Engine ---

    insertImage(imgSrc) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const maxDimension = Math.min(this.width, this.height) * 0.55;
            let imgW = img.naturalWidth || 300;
            let imgH = img.naturalHeight || 300;

            if (imgW > maxDimension || imgH > maxDimension) {
                const scale = maxDimension / Math.max(imgW, imgH);
                imgW *= scale;
                imgH *= scale;
            }

            this.activeImageObj = {
                img: img,
                x: (this.width - imgW) / 2,
                y: (this.height - imgH) / 2,
                width: imgW,
                height: imgH,
                rotation: 0
            };

            this.renderImageOverlay();
            if (window.soundFx) window.soundFx.pop(700);

            // Show transform confirmation floating dock
            const confirmDock = document.getElementById('imageTransformDock');
            if (confirmDock) confirmDock.classList.remove('hidden');
        };
        img.src = imgSrc;
    }

    renderImageOverlay() {
        this.previewCtx.clearRect(0, 0, this.width, this.height);
        if (!this.activeImageObj) return;

        const { img, x, y, width, height } = this.activeImageObj;
        const ctx = this.previewCtx;

        ctx.save();
        ctx.drawImage(img, x, y, width, height);

        // Draw cute bounding box & transform handle
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(x, y, width, height);

        // Draw resize corner bubble
        ctx.setLineDash([]);
        ctx.fillStyle = '#4f46e5';
        ctx.beginPath();
        ctx.arc(x + width, y + height, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    handleImagePointerDown(pos) {
        if (!this.activeImageObj) return false;
        const { x, y, width, height } = this.activeImageObj;

        // Check if clicked resize handle at bottom right
        const handleX = x + width;
        const handleY = y + height;
        const distToHandle = Math.hypot(pos.x - handleX, pos.y - handleY);

        if (distToHandle <= 20) {
            this.isTransformingImage = true;
            this.imageTransformMode = 'resize';
            return true;
        }

        // Check if inside image box for dragging
        if (pos.x >= x && pos.x <= x + width && pos.y >= y && pos.y <= y + height) {
            this.isTransformingImage = true;
            this.imageTransformMode = 'drag';
            this.imageDragOffset = { x: pos.x - x, y: pos.y - y };
            return true;
        }

        return false;
    }

    handleImagePointerMove(pos) {
        if (!this.activeImageObj || !this.isTransformingImage) return;

        if (this.imageTransformMode === 'drag') {
            this.activeImageObj.x = pos.x - this.imageDragOffset.x;
            this.activeImageObj.y = pos.y - this.imageDragOffset.y;
        } else if (this.imageTransformMode === 'resize') {
            const newW = Math.max(40, pos.x - this.activeImageObj.x);
            const newH = Math.max(40, pos.y - this.activeImageObj.y);
            this.activeImageObj.width = newW;
            this.activeImageObj.height = newH;
        }

        this.renderImageOverlay();
    }

    commitActiveImage() {
        if (!this.activeImageObj) return;

        const { img, x, y, width, height } = this.activeImageObj;
        this.drawCtx.drawImage(img, x, y, width, height);

        this.activeImageObj = null;
        this.isTransformingImage = false;
        this.previewCtx.clearRect(0, 0, this.width, this.height);

        const confirmDock = document.getElementById('imageTransformDock');
        if (confirmDock) confirmDock.classList.add('hidden');

        this.saveState();
        if (window.soundFx) window.soundFx.pop(400);
    }

    cancelActiveImage() {
        this.activeImageObj = null;
        this.isTransformingImage = false;
        this.previewCtx.clearRect(0, 0, this.width, this.height);

        const confirmDock = document.getElementById('imageTransformDock');
        if (confirmDock) confirmDock.classList.add('hidden');
    }

    // --- Cursor & Indicator Preview ---

    updateCursorPreview(pos) {
        if (this.isDrawing || this.activeImageObj) return;

        this.previewCtx.clearRect(0, 0, this.width, this.height);
        
        if (['brush', 'rainbow', 'glow', 'crayon', 'eraser'].includes(this.tool)) {
            const ctx = this.previewCtx;
            ctx.save();
            ctx.strokeStyle = this.tool === 'eraser' ? '#ff4d4f' : this.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.brushSize / 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        } else if (this.tool === 'sticker') {
            const ctx = this.previewCtx;
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.font = `${this.brushSize * 3}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.selectedSticker, pos.x, pos.y);
            ctx.restore();
        }
    }

    // --- Export & Print ---

    getMergedCanvas() {
        const merged = document.createElement('canvas');
        merged.width = this.width * this.dpr;
        merged.height = this.height * this.dpr;
        const ctx = merged.getContext('2d');

        // Draw white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, merged.width, merged.height);

        // Draw user artwork
        ctx.drawImage(this.drawCanvas, 0, 0);

        // Draw template outline on top
        if (this.currentTemplateId) {
            ctx.drawImage(this.templateCanvas, 0, 0);
        }

        return merged;
    }

    exportImage(fileName = 'vedant-drawing.png') {
        const merged = this.getMergedCanvas();
        const link = document.createElement('a');
        link.download = fileName;
        link.href = merged.toDataURL('image/png');
        link.click();
        if (window.soundFx) window.soundFx.cheer();
    }

    printCanvas() {
        const merged = this.getMergedCanvas();
        const dataUrl = merged.toDataURL('image/png');
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        printWindow.document.write(`
            <html>
                <head>
                    <title>Vedant Drawing App - Print</title>
                    <style>
                        body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; }
                        img { max-width: 96%; max-height: 96%; object-fit: contain; }
                    </style>
                </head>
                <body>
                    <img src="${dataUrl}" onload="window.print(); window.close();" />
                </body>
            </html>
        `);
        printWindow.document.close();
    }
}

window.DrawingEngine = DrawingEngine;
