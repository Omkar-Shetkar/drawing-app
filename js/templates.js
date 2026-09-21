// Built-in vector coloring book templates for kids

const COLORING_TEMPLATES = [
    {
        id: 'dino',
        name: 'Cute Dinosaur',
        emoji: '🦕',
        category: 'Animals',
        render: (ctx, width, height) => {
            const s = Math.min(width, height) / 800;
            const cx = width / 2;
            const cy = height / 2;
            
            ctx.save();
            ctx.translate(cx - 400 * s, cy - 380 * s);
            ctx.scale(s, s);
            ctx.strokeStyle = '#2d3748';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Ground line
            ctx.beginPath();
            ctx.moveTo(80, 680);
            ctx.quadraticCurveTo(400, 660, 720, 680);
            ctx.stroke();

            // Dinosaur Body & Tail
            ctx.beginPath();
            // Start at neck
            ctx.moveTo(320, 320);
            // Back curve down to tail
            ctx.bezierCurveTo(400, 310, 560, 350, 640, 480);
            // Tail tip
            ctx.quadraticCurveTo(730, 520, 760, 460);
            ctx.quadraticCurveTo(720, 560, 590, 570);
            // Back leg
            ctx.lineTo(590, 670);
            ctx.lineTo(540, 670);
            ctx.lineTo(530, 570);
            // Belly
            ctx.quadraticCurveTo(420, 590, 350, 570);
            // Front leg
            ctx.lineTo(350, 670);
            ctx.lineTo(300, 670);
            ctx.lineTo(290, 550);
            // Chest to chin
            ctx.quadraticCurveTo(240, 490, 240, 380);
            // Mouth
            ctx.quadraticCurveTo(170, 360, 160, 300);
            // Snout top
            ctx.quadraticCurveTo(160, 230, 240, 220);
            // Head top to neck
            ctx.quadraticCurveTo(340, 210, 320, 320);
            ctx.stroke();

            // Back Spikes / Plates
            const spikes = [
                [270, 220, 290, 180, 310, 230],
                [330, 250, 360, 200, 380, 270],
                [410, 300, 450, 240, 470, 320],
                [500, 350, 540, 290, 560, 380],
                [600, 430, 640, 380, 650, 460],
                [690, 490, 730, 450, 720, 520]
            ];
            spikes.forEach(([x1, y1, x2, y2, x3, y3]) => {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);
                ctx.stroke();
            });

            // Cute big Eye
            ctx.beginPath();
            ctx.arc(240, 270, 22, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#2d3748';
            ctx.beginPath();
            ctx.arc(244, 270, 12, 0, Math.PI * 2);
            ctx.fill();
            // Eye shine
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(248, 266, 5, 0, Math.PI * 2);
            ctx.fill();

            // Happy Mouth
            ctx.beginPath();
            ctx.moveTo(190, 310);
            ctx.quadraticCurveTo(230, 335, 260, 315);
            ctx.stroke();

            // Cheek blush circle
            ctx.beginPath();
            ctx.arc(275, 335, 14, 0, Math.PI * 2);
            ctx.stroke();

            // Belly spots
            const spots = [[420, 430, 20], [480, 470, 26], [430, 510, 16], [540, 490, 18]];
            spots.forEach(([sx, sy, r]) => {
                ctx.beginPath();
                ctx.arc(sx, sy, r, 0, Math.PI * 2);
                ctx.stroke();
            });

            // Small cute palm tree in background
            ctx.beginPath();
            ctx.moveTo(110, 680);
            ctx.quadraticCurveTo(120, 520, 100, 450);
            ctx.lineTo(125, 450);
            ctx.quadraticCurveTo(145, 520, 135, 680);
            ctx.stroke();

            // Palm leaves
            const leaves = [
                [110, 450, 40, 410, 30, 460],
                [110, 450, 80, 390, 100, 370],
                [115, 450, 160, 390, 180, 440],
                [115, 450, 170, 450, 200, 480]
            ];
            leaves.forEach(([lx1, ly1, lx2, ly2, lx3, ly3]) => {
                ctx.beginPath();
                ctx.moveTo(lx1, ly1);
                ctx.quadraticCurveTo(lx2, ly2, lx3, ly3);
                ctx.stroke();
            });

            // Fluffy clouds
            ctx.beginPath();
            ctx.arc(580, 160, 35, Math.PI * 0.8, Math.PI * 2);
            ctx.arc(630, 140, 45, Math.PI * 1, Math.PI * 2.1);
            ctx.arc(680, 160, 35, 0, Math.PI * 1.2);
            ctx.stroke();

            ctx.restore();
        }
    },
    {
        id: 'rocket',
        name: 'Space Rocket',
        emoji: '🚀',
        category: 'Space',
        render: (ctx, width, height) => {
            const s = Math.min(width, height) / 800;
            const cx = width / 2;
            const cy = height / 2;

            ctx.save();
            ctx.translate(cx - 400 * s, cy - 380 * s);
            ctx.scale(s, s);
            ctx.strokeStyle = '#2d3748';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Rocket Body
            ctx.beginPath();
            ctx.moveTo(400, 140); // Nose tip
            ctx.bezierCurveTo(490, 240, 500, 440, 470, 540); // Right hull
            ctx.lineTo(330, 540); // Bottom
            ctx.bezierCurveTo(300, 440, 310, 240, 400, 140); // Left hull
            ctx.stroke();

            // Rocket Nose Cone line
            ctx.beginPath();
            ctx.moveTo(345, 250);
            ctx.quadraticCurveTo(400, 280, 455, 250);
            ctx.stroke();

            // Porthole Window
            ctx.beginPath();
            ctx.arc(400, 370, 55, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(400, 370, 40, 0, Math.PI * 2);
            ctx.stroke();

            // Left Fin
            ctx.beginPath();
            ctx.moveTo(330, 430);
            ctx.quadraticCurveTo(240, 480, 230, 580);
            ctx.quadraticCurveTo(290, 570, 335, 530);
            ctx.stroke();

            // Right Fin
            ctx.beginPath();
            ctx.moveTo(470, 430);
            ctx.quadraticCurveTo(560, 480, 570, 580);
            ctx.quadraticCurveTo(510, 570, 465, 530);
            ctx.stroke();

            // Thruster Nozzle
            ctx.beginPath();
            ctx.moveTo(360, 540);
            ctx.lineTo(345, 580);
            ctx.lineTo(455, 580);
            ctx.lineTo(440, 540);
            ctx.stroke();

            // Flames
            ctx.beginPath();
            ctx.moveTo(360, 585);
            ctx.quadraticCurveTo(340, 660, 400, 720);
            ctx.quadraticCurveTo(460, 660, 440, 585);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(380, 585);
            ctx.quadraticCurveTo(370, 640, 400, 670);
            ctx.quadraticCurveTo(430, 640, 420, 585);
            ctx.stroke();

            // Planet with ring (Saturn)
            ctx.beginPath();
            ctx.arc(160, 210, 45, 0, Math.PI * 2);
            ctx.stroke();
            // Saturn Ring
            ctx.beginPath();
            ctx.ellipse(160, 210, 75, 20, Math.PI / -6, 0, Math.PI * 2);
            ctx.stroke();

            // Moon with craters
            ctx.beginPath();
            ctx.arc(660, 230, 40, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(650, 220, 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(675, 240, 11, 0, Math.PI * 2);
            ctx.stroke();

            // Twinkling Stars
            const drawStar = (sx, sy, r) => {
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                    const x = sx + r * Math.cos(angle);
                    const y = sy + r * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
            };

            drawStar(150, 420, 25);
            drawStar(670, 440, 28);
            drawStar(230, 110, 20);
            drawStar(580, 120, 22);
            drawStar(660, 640, 24);

            ctx.restore();
        }
    },
    {
        id: 'butterfly',
        name: 'Happy Butterfly',
        emoji: '🦋',
        category: 'Nature',
        render: (ctx, width, height) => {
            const s = Math.min(width, height) / 800;
            const cx = width / 2;
            const cy = height / 2;

            ctx.save();
            ctx.translate(cx - 400 * s, cy - 380 * s);
            ctx.scale(s, s);
            ctx.strokeStyle = '#2d3748';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Butterfly Body
            ctx.beginPath();
            ctx.ellipse(400, 390, 24, 110, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Head
            ctx.beginPath();
            ctx.arc(400, 255, 30, 0, Math.PI * 2);
            ctx.stroke();

            // Antennae
            ctx.beginPath();
            ctx.moveTo(390, 230);
            ctx.bezierCurveTo(360, 170, 320, 160, 330, 140);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(335, 140, 10, 0, Math.PI * 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(410, 230);
            ctx.bezierCurveTo(440, 170, 480, 160, 470, 140);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(465, 140, 10, 0, Math.PI * 2);
            ctx.stroke();

            // Face
            ctx.fillStyle = '#2d3748';
            ctx.beginPath();
            ctx.arc(390, 252, 5, 0, Math.PI * 2);
            ctx.arc(410, 252, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(400, 265, 9, 0, Math.PI);
            ctx.stroke();

            // Top Left Wing
            ctx.beginPath();
            ctx.moveTo(380, 320);
            ctx.bezierCurveTo(280, 150, 130, 200, 160, 360);
            ctx.bezierCurveTo(180, 420, 320, 420, 378, 390);
            ctx.stroke();

            // Wing Patterns Left Top
            ctx.beginPath();
            ctx.arc(260, 300, 32, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(210, 340, 18, 0, Math.PI * 2);
            ctx.stroke();

            // Top Right Wing
            ctx.beginPath();
            ctx.moveTo(420, 320);
            ctx.bezierCurveTo(520, 150, 670, 200, 640, 360);
            ctx.bezierCurveTo(620, 420, 480, 420, 422, 390);
            ctx.stroke();

            // Wing Patterns Right Top
            ctx.beginPath();
            ctx.arc(540, 300, 32, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(590, 340, 18, 0, Math.PI * 2);
            ctx.stroke();

            // Bottom Left Wing
            ctx.beginPath();
            ctx.moveTo(380, 410);
            ctx.bezierCurveTo(240, 440, 210, 560, 290, 600);
            ctx.bezierCurveTo(340, 620, 375, 520, 385, 480);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(295, 520, 22, 0, Math.PI * 2);
            ctx.stroke();

            // Bottom Right Wing
            ctx.beginPath();
            ctx.moveTo(420, 410);
            ctx.bezierCurveTo(560, 440, 590, 560, 510, 600);
            ctx.bezierCurveTo(460, 620, 425, 520, 415, 480);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(505, 520, 22, 0, Math.PI * 2);
            ctx.stroke();

            // Two cute flowers at the bottom
            const drawFlower = (fx, fy, r) => {
                ctx.beginPath();
                ctx.arc(fx, fy, r, 0, Math.PI * 2);
                ctx.stroke();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI) / 5;
                    const px = fx + (r * 1.7) * Math.cos(angle);
                    const py = fy + (r * 1.7) * Math.sin(angle);
                    ctx.beginPath();
                    ctx.arc(px, py, r * 0.8, 0, Math.PI * 2);
                    ctx.stroke();
                }
            };

            drawFlower(140, 660, 20);
            drawFlower(660, 660, 20);

            ctx.restore();
        }
    },
    {
        id: 'car',
        name: 'Speedy Car',
        emoji: '🚗',
        category: 'Vehicles',
        render: (ctx, width, height) => {
            const s = Math.min(width, height) / 800;
            const cx = width / 2;
            const cy = height / 2;

            ctx.save();
            ctx.translate(cx - 400 * s, cy - 380 * s);
            ctx.scale(s, s);
            ctx.strokeStyle = '#2d3748';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Road line
            ctx.beginPath();
            ctx.moveTo(80, 600);
            ctx.lineTo(720, 600);
            ctx.stroke();

            // Main Car Body
            ctx.beginPath();
            // Start behind front bumper
            ctx.moveTo(140, 490);
            // Front bumper curve
            ctx.quadraticCurveTo(110, 490, 110, 440);
            // Hood
            ctx.quadraticCurveTo(130, 400, 240, 390);
            // Windshield
            ctx.lineTo(330, 270);
            // Roof
            ctx.lineTo(530, 270);
            // Rear window
            ctx.lineTo(600, 390);
            // Trunk & rear
            ctx.quadraticCurveTo(690, 400, 690, 470);
            // Under rear bumper
            ctx.lineTo(620, 490);
            // Rear Wheel Arch
            ctx.arc(540, 490, 65, 0, Math.PI, true);
            // Underside
            ctx.lineTo(290, 490);
            // Front Wheel Arch
            ctx.arc(225, 490, 65, 0, Math.PI, true);
            ctx.lineTo(140, 490);
            ctx.stroke();

            // Front Wheel
            ctx.beginPath();
            ctx.arc(225, 490, 48, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(225, 490, 20, 0, Math.PI * 2);
            ctx.stroke();

            // Rear Wheel
            ctx.beginPath();
            ctx.arc(540, 490, 48, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(540, 490, 20, 0, Math.PI * 2);
            ctx.stroke();

            // Windows
            // Front Window
            ctx.beginPath();
            ctx.moveTo(345, 290);
            ctx.lineTo(415, 290);
            ctx.lineTo(415, 380);
            ctx.lineTo(270, 380);
            ctx.closePath();
            ctx.stroke();

            // Rear Window
            ctx.beginPath();
            ctx.moveTo(435, 290);
            ctx.lineTo(515, 290);
            ctx.lineTo(575, 380);
            ctx.lineTo(435, 380);
            ctx.closePath();
            ctx.stroke();

            // Headlight
            ctx.beginPath();
            ctx.ellipse(130, 425, 15, 22, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Taillight
            ctx.beginPath();
            ctx.ellipse(675, 430, 12, 18, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Door handle
            ctx.beginPath();
            ctx.roundRect(435, 415, 40, 12, 6);
            ctx.stroke();

            // Speed lines behind
            ctx.beginPath();
            ctx.moveTo(710, 430);
            ctx.lineTo(760, 430);
            ctx.moveTo(720, 460);
            ctx.lineTo(770, 460);
            ctx.stroke();

            // Smiling Sun
            ctx.beginPath();
            ctx.arc(640, 160, 45, 0, Math.PI * 2);
            ctx.stroke();
            // Sun rays
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4;
                const rx1 = 640 + 55 * Math.cos(angle);
                const ry1 = 160 + 55 * Math.sin(angle);
                const rx2 = 640 + 72 * Math.cos(angle);
                const ry2 = 160 + 72 * Math.sin(angle);
                ctx.beginPath();
                ctx.moveTo(rx1, ry1);
                ctx.lineTo(rx2, ry2);
                ctx.stroke();
            }

            ctx.restore();
        }
    },
    {
        id: 'rainbow',
        name: 'Sun & Rainbow',
        emoji: '🌈',
        category: 'Nature',
        render: (ctx, width, height) => {
            const s = Math.min(width, height) / 800;
            const cx = width / 2;
            const cy = height / 2;

            ctx.save();
            ctx.translate(cx - 400 * s, cy - 380 * s);
            ctx.scale(s, s);
            ctx.strokeStyle = '#2d3748';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Rainbow Arcs (5 bands)
            const radii = [280, 245, 210, 175, 140, 105];
            radii.forEach(r => {
                ctx.beginPath();
                ctx.arc(400, 480, r, Math.PI, 0, false);
                ctx.stroke();
            });

            // Left Cloud
            ctx.beginPath();
            ctx.arc(170, 480, 50, Math.PI * 0.8, Math.PI * 1.8);
            ctx.arc(220, 430, 60, Math.PI * 1.1, Math.PI * 2.1);
            ctx.arc(280, 470, 55, Math.PI * 1.4, Math.PI * 2.4);
            ctx.arc(220, 510, 45, 0, Math.PI * 0.9);
            ctx.stroke();

            // Right Cloud
            ctx.beginPath();
            ctx.arc(520, 480, 50, Math.PI * 0.8, Math.PI * 1.8);
            ctx.arc(580, 430, 60, Math.PI * 1.1, Math.PI * 2.1);
            ctx.arc(640, 470, 55, Math.PI * 1.4, Math.PI * 2.4);
            ctx.arc(580, 510, 45, 0, Math.PI * 0.9);
            ctx.stroke();

            // Cute Happy Sun in top right
            ctx.beginPath();
            ctx.arc(620, 170, 50, 0, Math.PI * 2);
            ctx.stroke();

            // Sun Face
            ctx.fillStyle = '#2d3748';
            ctx.beginPath();
            ctx.arc(605, 160, 6, 0, Math.PI * 2);
            ctx.arc(635, 160, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(620, 175, 14, 0, Math.PI);
            ctx.stroke();

            // Sun rays
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4;
                const rx1 = 620 + 62 * Math.cos(angle);
                const ry1 = 170 + 62 * Math.sin(angle);
                const rx2 = 620 + 82 * Math.cos(angle);
                const ry2 = 170 + 82 * Math.sin(angle);
                ctx.beginPath();
                ctx.moveTo(rx1, ry1);
                ctx.lineTo(rx2, ry2);
                ctx.stroke();
            }

            // Twinkle stars
            const drawStar = (sx, sy, r) => {
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                    const x = sx + r * Math.cos(angle);
                    const y = sy + r * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
            };

            drawStar(170, 180, 22);
            drawStar(270, 130, 18);
            drawStar(400, 110, 24);

            ctx.restore();
        }
    },
    {
        id: 'kitten',
        name: 'Cute Kitten',
        emoji: '🐱',
        category: 'Animals',
        render: (ctx, width, height) => {
            const s = Math.min(width, height) / 800;
            const cx = width / 2;
            const cy = height / 2;

            ctx.save();
            ctx.translate(cx - 400 * s, cy - 380 * s);
            ctx.scale(s, s);
            ctx.strokeStyle = '#2d3748';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Kitten Head
            ctx.beginPath();
            ctx.arc(400, 310, 110, 0, Math.PI * 2);
            ctx.stroke();

            // Left Ear
            ctx.beginPath();
            ctx.moveTo(310, 240);
            ctx.lineTo(280, 140);
            ctx.lineTo(370, 205);
            ctx.stroke();

            // Right Ear
            ctx.beginPath();
            ctx.moveTo(490, 240);
            ctx.lineTo(520, 140);
            ctx.lineTo(430, 205);
            ctx.stroke();

            // Eyes
            ctx.beginPath();
            ctx.arc(355, 300, 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#2d3748';
            ctx.beginPath();
            ctx.arc(358, 300, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(445, 300, 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(442, 300, 12, 0, Math.PI * 2);
            ctx.fill();

            // Nose
            ctx.beginPath();
            ctx.moveTo(390, 335);
            ctx.lineTo(410, 335);
            ctx.lineTo(400, 348);
            ctx.closePath();
            ctx.stroke();

            // Mouth
            ctx.beginPath();
            ctx.moveTo(400, 348);
            ctx.lineTo(400, 360);
            ctx.arc(385, 360, 15, 0, Math.PI);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(400, 360);
            ctx.arc(415, 360, 15, 0, Math.PI);
            ctx.stroke();

            // Whiskers
            ctx.beginPath();
            // Left whiskers
            ctx.moveTo(340, 340);
            ctx.lineTo(250, 325);
            ctx.moveTo(340, 355);
            ctx.lineTo(240, 360);
            ctx.moveTo(340, 370);
            ctx.lineTo(255, 395);
            // Right whiskers
            ctx.moveTo(460, 340);
            ctx.lineTo(550, 325);
            ctx.moveTo(460, 355);
            ctx.lineTo(560, 360);
            ctx.moveTo(460, 370);
            ctx.lineTo(545, 395);
            ctx.stroke();

            // Body
            ctx.beginPath();
            ctx.moveTo(330, 400);
            ctx.quadraticCurveTo(310, 520, 320, 620);
            ctx.lineTo(480, 620);
            ctx.quadraticCurveTo(490, 520, 470, 400);
            ctx.stroke();

            // Paws
            ctx.beginPath();
            ctx.arc(360, 620, 35, Math.PI, 0);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(440, 620, 35, Math.PI, 0);
            ctx.stroke();

            // Tail
            ctx.beginPath();
            ctx.moveTo(480, 580);
            ctx.bezierCurveTo(620, 560, 620, 420, 570, 430);
            ctx.stroke();

            // Ball of yarn
            ctx.beginPath();
            ctx.arc(200, 600, 45, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(200, 600, 30, Math.PI * 0.2, Math.PI * 1.5);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(240, 620);
            ctx.quadraticCurveTo(280, 640, 330, 620);
            ctx.stroke();

            ctx.restore();
        }
    },
    {
        id: 'castle',
        name: 'Magic Castle',
        emoji: '🏰',
        category: 'Fairytale',
        render: (ctx, width, height) => {
            const s = Math.min(width, height) / 800;
            const cx = width / 2;
            const cy = height / 2;

            ctx.save();
            ctx.translate(cx - 400 * s, cy - 380 * s);
            ctx.scale(s, s);
            ctx.strokeStyle = '#2d3748';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Ground hill
            ctx.beginPath();
            ctx.moveTo(80, 680);
            ctx.quadraticCurveTo(400, 630, 720, 680);
            ctx.stroke();

            // Main Central Tower Base
            ctx.beginPath();
            ctx.rect(310, 360, 180, 280);
            ctx.stroke();

            // Main Arch Gate
            ctx.beginPath();
            ctx.arc(400, 580, 45, Math.PI, 0);
            ctx.lineTo(445, 640);
            ctx.lineTo(355, 640);
            ctx.closePath();
            ctx.stroke();

            // Central Tower Roof / Spire
            ctx.beginPath();
            ctx.moveTo(290, 360);
            ctx.lineTo(400, 160);
            ctx.lineTo(510, 360);
            ctx.closePath();
            ctx.stroke();

            // Central Flag
            ctx.beginPath();
            ctx.moveTo(400, 160);
            ctx.lineTo(400, 110);
            ctx.lineTo(450, 130);
            ctx.lineTo(400, 150);
            ctx.stroke();

            // Left Tower
            ctx.beginPath();
            ctx.rect(170, 420, 140, 240);
            ctx.stroke();

            // Left Spire Roof
            ctx.beginPath();
            ctx.moveTo(150, 420);
            ctx.lineTo(240, 250);
            ctx.lineTo(330, 420);
            ctx.closePath();
            ctx.stroke();

            // Left Flag
            ctx.beginPath();
            ctx.moveTo(240, 250);
            ctx.lineTo(240, 205);
            ctx.lineTo(280, 220);
            ctx.lineTo(240, 235);
            ctx.stroke();

            // Right Tower
            ctx.beginPath();
            ctx.rect(490, 420, 140, 240);
            ctx.stroke();

            // Right Spire Roof
            ctx.beginPath();
            ctx.moveTo(470, 420);
            ctx.lineTo(560, 250);
            ctx.lineTo(650, 420);
            ctx.closePath();
            ctx.stroke();

            // Right Flag
            ctx.beginPath();
            ctx.moveTo(560, 250);
            ctx.lineTo(560, 205);
            ctx.lineTo(600, 220);
            ctx.lineTo(560, 235);
            ctx.stroke();

            // Windows
            const drawArchWindow = (wx, wy) => {
                ctx.beginPath();
                ctx.arc(wx, wy, 16, Math.PI, 0);
                ctx.lineTo(wx + 16, wy + 25);
                ctx.lineTo(wx - 16, wy + 25);
                ctx.closePath();
                ctx.stroke();
            };

            drawArchWindow(400, 420);
            drawArchWindow(240, 480);
            drawArchWindow(560, 480);

            // Clouds
            ctx.beginPath();
            ctx.arc(620, 140, 30, Math.PI * 0.8, Math.PI * 2);
            ctx.arc(660, 120, 38, Math.PI * 1, Math.PI * 2.1);
            ctx.arc(700, 140, 30, 0, Math.PI * 1.2);
            ctx.stroke();

            ctx.restore();
        }
    },
    {
        id: 'dolphin',
        name: 'Jumping Dolphin',
        emoji: '🐬',
        category: 'Ocean',
        render: (ctx, width, height) => {
            const s = Math.min(width, height) / 800;
            const cx = width / 2;
            const cy = height / 2;

            ctx.save();
            ctx.translate(cx - 400 * s, cy - 380 * s);
            ctx.scale(s, s);
            ctx.strokeStyle = '#2d3748';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Sea Waves at bottom
            ctx.beginPath();
            ctx.moveTo(50, 580);
            for (let i = 0; i < 6; i++) {
                const wx = 50 + i * 115;
                ctx.quadraticCurveTo(wx + 60, 520, wx + 115, 580);
            }
            ctx.stroke();

            // Dolphin Body
            ctx.beginPath();
            // Beak tip
            ctx.moveTo(170, 380);
            // Forehead to dorsal fin and tail
            ctx.bezierCurveTo(210, 280, 320, 210, 440, 230);
            // Dorsal Fin
            ctx.quadraticCurveTo(460, 160, 490, 150);
            ctx.quadraticCurveTo(485, 220, 520, 250);
            // Back down to flukes (tail)
            ctx.bezierCurveTo(600, 300, 680, 380, 710, 370);
            // Fluke top
            ctx.quadraticCurveTo(740, 330, 750, 320);
            ctx.quadraticCurveTo(730, 380, 700, 400);
            // Fluke bottom
            ctx.quadraticCurveTo(740, 430, 760, 450);
            ctx.quadraticCurveTo(720, 430, 670, 410);
            // Belly back to mouth
            ctx.bezierCurveTo(550, 430, 420, 450, 300, 410);
            // Beak bottom
            ctx.quadraticCurveTo(210, 400, 170, 380);
            ctx.stroke();

            // Pectoral Fin (Flipper)
            ctx.beginPath();
            ctx.moveTo(340, 390);
            ctx.quadraticCurveTo(370, 470, 420, 480);
            ctx.quadraticCurveTo(390, 430, 380, 390);
            ctx.stroke();

            // Eye
            ctx.beginPath();
            ctx.arc(260, 320, 12, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#2d3748';
            ctx.beginPath();
            ctx.arc(262, 320, 7, 0, Math.PI * 2);
            ctx.fill();

            // Water splashes
            const splashes = [
                [200, 520, 12], [220, 490, 8], [630, 510, 14], [670, 490, 10]
            ];
            splashes.forEach(([sx, sy, r]) => {
                ctx.beginPath();
                ctx.arc(sx, sy, r, 0, Math.PI * 2);
                ctx.stroke();
            });

            // Smiling Sun
            ctx.beginPath();
            ctx.arc(160, 160, 42, 0, Math.PI * 2);
            ctx.stroke();

            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4;
                const rx1 = 160 + 52 * Math.cos(angle);
                const ry1 = 160 + 52 * Math.sin(angle);
                const rx2 = 160 + 68 * Math.cos(angle);
                const ry2 = 160 + 68 * Math.sin(angle);
                ctx.beginPath();
                ctx.moveTo(rx1, ry1);
                ctx.lineTo(rx2, ry2);
                ctx.stroke();
            }

            ctx.restore();
        }
    }
];

window.COLORING_TEMPLATES = COLORING_TEMPLATES;
