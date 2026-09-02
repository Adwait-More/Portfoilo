import kaboom from 'kaboom';
import { portfolioData } from '../../data/portfolioData';
import characterImg from '../../assets/sprites/character_sheet2-Photoroom.png';
import chestImg from '../../assets/sprites/chest.png';
import bgImg from '../../assets/sprites/background.jpg';


// Shared mobile input state — GameMode.jsx writes to this via touch buttons
export const mobileInput = {
  left: false,
  right: false,
  jump: false,
  interact: false,
};

export const initGame = (container) => {
  const W = window.innerWidth;
  const H = window.innerHeight;

  const k = kaboom({
    global: false,
    root: container,
    background: [10, 10, 26],
    width: W,
    height: H,
    scale: 1,
    stretch: true,
    letterbox: false,
    crisp: true,
  });

  // ──────────────────────────────────────
  // LOAD SPRITES
  // ──────────────────────────────────────
  k.loadSprite('character', characterImg, {
    sliceX: 4,
    sliceY: 2,
    anims: {
      run: { from: 0, to: 7, loop: true, speed: 12 },
    },
  });
  k.loadSprite('chest', chestImg);
  k.loadSprite('bg', bgImg);

  // ──────────────────────────────────────
  // CONSTANTS
  // ──────────────────────────────────────
  const GRAVITY = 1800;
  const SPEED = 300;
  const JUMP = 720;
  const GROUND_Y = H - 60;
  const PLAYER_SIZE = 160;

  // Colors
  const C = {
    accent: k.rgb(100, 255, 218),
    accentDim: k.rgb(30, 80, 65),
    groundCol: k.rgb(22, 34, 22),
    groundTop: k.rgb(50, 180, 70),
    platCol: k.rgb(28, 48, 28),
    platTop: k.rgb(50, 170, 70),
    white: k.rgb(255, 255, 255),
    muted: k.rgb(120, 120, 150),
    dark: k.rgb(16, 16, 32),
    panelBg: k.rgb(12, 12, 28),
  };

  // ──────────────────────────────────────
  // GAME SCENE
  // ──────────────────────────────────────
  k.scene('game', () => {
    k.setGravity(GRAVITY);

    // State
    let nearChest = null;
    let panelOpen = false;
    let panelObjects = [];
    let facingRight = true;

    // ── Background (parallax) ──
    const bgSprite = k.add([
      k.sprite('bg', { width: W * 2, height: H }),
      k.pos(0, 0),
      k.fixed(),
      k.z(-100),
      k.opacity(0.7),
    ]);

    // ── Stars ──
    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * W * 8 - W,
      y: Math.random() * (H * 0.55),
      r: Math.random() * 1.6 + 0.3,
      speed: Math.random() * 0.12 + 0.04,
      phase: Math.random() * Math.PI * 2,
    }));

    // ── Ground ──
    k.add([
      k.rect(W * 100, 60),
      k.pos(-W * 20, GROUND_Y),
      k.color(C.groundCol),
      k.area(),
      k.body({ isStatic: true }),
      'ground',
    ]);
    k.add([
      k.rect(W * 100, 3),
      k.pos(-W * 20, GROUND_Y),
      k.color(C.groundTop),
      k.z(1),
    ]);

    // ── Platform Builder ──
    function makePlatform(x, y, w) {
      k.add([
        k.rect(w, 18),
        k.pos(x, y),
        k.color(C.platCol),
        k.area(),
        k.body({ isStatic: true }),
        'platform',
      ]);
      k.add([
        k.rect(w, 3),
        k.pos(x, y),
        k.color(C.platTop),
      ]);
    }

    // ── Chest Builder ──
    const chests = [];
    function makeChest(x, y, id, label) {
      const chest = k.add([
        k.sprite('chest'),
        k.pos(x, y),
        k.scale(0.1),
        k.area({ scale: k.vec2(0.8, 0.8) }),
        k.anchor('bot'),
        k.z(10),
        { chestId: id, opened: false },
        'chest',
      ]);

      // Floating label
      const lbl = k.add([
        k.text(label, { size: 13, font: 'monospace' }),
        k.pos(x + 28, y - 75),
        k.anchor('center'),
        k.color(C.accent),
        k.z(11),
        { baseY: y - 75 },
      ]);

      // "Press E" prompt (hidden by default)
      const prompt = k.add([
        k.text('[E] Open', { size: 11, font: 'monospace' }),
        k.pos(x + 28, y - 55),
        k.anchor('center'),
        k.color(C.muted),
        k.opacity(0),
        k.z(11),
      ]);

      // Glow particles
      for (let i = 0; i < 3; i++) {
        k.add([
          k.circle(3),
          k.pos(x + 15 + i * 15, y - 10),
          k.color(C.accent),
          k.opacity(0.5),
          k.z(9),
          { phase: i * 2, baseX: x + 15 + i * 15, baseY: y - 10 },
          'glow_particle',
        ]);
      }

      chests.push({ chest, lbl, prompt, id });
      return chest;
    }

    // ──────────────────────────────────────
    // HUB MAP LAYOUT
    // ──────────────────────────────────────
    // The world is a left-to-right adventure with 5 zones.
    // Each zone has platforms leading to a chest.

    // === ZONE 1: ABOUT ME (near spawn) ===
    makePlatform(350, GROUND_Y - 100, 200);
    makeChest(420, GROUND_Y - 100, 'about', '⟩ ABOUT ME');

    // === ZONE 2: SKILLS (upper platforms) ===
    makePlatform(700, GROUND_Y - 80, 140);
    makePlatform(880, GROUND_Y - 160, 160);
    makePlatform(1080, GROUND_Y - 230, 200);
    makeChest(1150, GROUND_Y - 230, 'skills', '⟩ SKILLS');

    // === ZONE 3: PROJECTS (the big one) ===
    makePlatform(1450, GROUND_Y - 100, 120);
    makePlatform(1620, GROUND_Y - 180, 150);
    makePlatform(1820, GROUND_Y - 140, 280);
    makeChest(1920, GROUND_Y - 140, 'projects', '⟩ PROJECTS');

    // === ZONE 4: EDUCATION ===
    makePlatform(2300, GROUND_Y - 120, 180);
    makePlatform(2520, GROUND_Y - 200, 200);
    makeChest(2590, GROUND_Y - 200, 'education', '⟩ EDUCATION');

    // === ZONE 5: CONTACT ===
    makePlatform(2900, GROUND_Y - 90, 140);
    makePlatform(3080, GROUND_Y - 170, 160);
    makePlatform(3280, GROUND_Y - 120, 240);
    makeChest(3370, GROUND_Y - 120, 'contact', '⟩ CONTACT');

    // Ambient decoration platforms
    for (let i = 0; i < 20; i++) {
      const px = 3600 + i * 280 + Math.random() * 80;
      const py = GROUND_Y - 80 - Math.random() * 180;
      makePlatform(px, py, 100 + Math.random() * 120);
    }

    // ── Welcome Sign ──
    k.add([
      k.text(`Welcome, `, { size: 16, font: 'monospace' }),
      k.pos(60, GROUND_Y - 40),
      k.color(C.accent),
      k.z(5),
    ]);
    k.add([
      k.text('Walk right → Find chests → Press [E] to explore', { size: 11, font: 'monospace' }),
      k.pos(60, GROUND_Y - 20),
      k.color(C.muted),
      k.z(5),
    ]);

    // ──────────────────────────────────────
    // PLAYER
    // ──────────────────────────────────────
    const player = k.add([
      k.sprite('character', { frame: 0 }),
      k.pos(100, GROUND_Y),
      k.scale(0.3),
      k.anchor('bot'),
      k.area({ scale: k.vec2(0.4, 0.8), offset: k.vec2(0, 0) }),
      k.body(),
      k.z(50),
      'player',
    ]);

    // ── Input helpers ──
    let isMoving = false;

    function startRunning() {
      if (!isMoving) {
        isMoving = true;
        player.play('run');
      }
    }

    function stopRunning() {
      // Only stop if no movement keys/touch are active
      const keysHeld = k.isKeyDown('left') || k.isKeyDown('right') || k.isKeyDown('a') || k.isKeyDown('d');
      const touchHeld = mobileInput.left || mobileInput.right;
      if (!keysHeld && !touchHeld) {
        isMoving = false;
        player.stop();
        player.frame = 0;
      }
    }

    // Keyboard movement
    k.onKeyDown('right', () => { player.move(SPEED, 0); facingRight = true; startRunning(); });
    k.onKeyDown('d', () => { player.move(SPEED, 0); facingRight = true; startRunning(); });
    k.onKeyDown('left', () => { player.move(-SPEED, 0); facingRight = false; startRunning(); });
    k.onKeyDown('a', () => { player.move(-SPEED, 0); facingRight = false; startRunning(); });

    k.onKeyRelease(['left', 'right', 'a', 'd'], stopRunning);

    k.onKeyPress('space', () => { if (player.isGrounded()) player.jump(JUMP); });
    k.onKeyPress('up', () => { if (player.isGrounded()) player.jump(JUMP); });
    k.onKeyPress('w', () => { if (player.isGrounded()) player.jump(JUMP); });

    // ── Mobile touch input (polled each frame) ──
    let prevMobileJump = false;
    let prevMobileInteract = false;
    k.onUpdate(() => {
      if (mobileInput.left) { player.move(-SPEED, 0); facingRight = false; startRunning(); }
      if (mobileInput.right) { player.move(SPEED, 0); facingRight = true; startRunning(); }
      if (!mobileInput.left && !mobileInput.right) { stopRunning(); }

      // Jump on press (edge detect)
      if (mobileInput.jump && !prevMobileJump && player.isGrounded()) {
        player.jump(JUMP);
      }
      prevMobileJump = mobileInput.jump;

      // Interact on press (edge detect)
      if (mobileInput.interact && !prevMobileInteract) {
        if (nearChest && !panelOpen) {
          panelOpen = true;
          showPanel(nearChest);
        } else if (panelOpen) {
          closePanel();
        }
      }
      prevMobileInteract = mobileInput.interact;
    });

    // Interact
    k.onKeyPress('e', () => {
      if (nearChest && !panelOpen) {
        panelOpen = true;
        showPanel(nearChest);
      } else if (panelOpen) {
        closePanel();
      }
    });
    k.onKeyPress('escape', closePanel);

    // ── Camera follow ──
    k.onUpdate(() => {
      const targetX = player.pos.x - W * 0.3;
      const camX = Math.max(0, targetX);
      k.camPos(k.vec2(camX + W / 2, H / 2));

      // Flip character
      if (facingRight) {
        player.scaleTo(0.3);
      } else {
        player.scaleTo(-0.3, 0.3);
      }

      // Respawn on fall
      if (player.pos.y > H + 200) {
        player.pos = k.vec2(100, GROUND_Y);
      }

      // Parallax BG
      bgSprite.pos.x = -camX * 0.05;
    });

    // ── Chest proximity ──
    player.onCollide('chest', (c) => {
      nearChest = c.chestId;
      const ch = chests.find(x => x.id === c.chestId);
      if (ch) ch.prompt.opacity = 1;
    });
    player.onCollideEnd('chest', (c) => {
      if (nearChest === c.chestId) {
        nearChest = null;
        const ch = chests.find(x => x.id === c.chestId);
        if (ch) ch.prompt.opacity = 0;
        if (panelOpen) closePanel();
      }
    });

    // ── Glow animation ──
    k.onUpdate('glow_particle', (p) => {
      p.pos.y = p.baseY + Math.sin(k.time() * 2 + p.phase) * 8;
      p.opacity = 0.3 + 0.4 * Math.sin(k.time() * 3 + p.phase);
    });

    // ── Chest bobbing ──
    k.onUpdate(() => {
      chests.forEach(({ lbl }) => {
        lbl.pos.y = lbl.baseY + Math.sin(k.time() * 2) * 4;
      });
    });

    // ── Custom bg draw (stars + moon on top of BG sprite) ──
    k.onDraw(() => {
      const ox = k.camPos().x - W / 2;

      stars.forEach(s => {
        const sx = ((s.x - ox * s.speed) % (W * 3) + W * 3) % (W * 3);
        if (sx > -10 && sx < W + 10) {
          k.drawCircle({
            pos: k.vec2(sx + ox, s.y),
            radius: s.r,
            color: k.rgb(200, 200, 255),
            opacity: (0.4 + 0.4 * Math.sin(k.time() * 0.6 + s.phase)),
          });
        }
      });

      // Moon
      k.drawCircle({
        pos: k.vec2(ox + W * 0.82, H * 0.1),
        radius: 35,
        color: k.rgb(200, 200, 240),
        opacity: 0.4,
      });
      k.drawCircle({
        pos: k.vec2(ox + W * 0.82 + 12, H * 0.1 - 6),
        radius: 30,
        color: k.rgb(10, 10, 26),
        opacity: 0.9,
      });
    });

    // ──────────────────────────────────────
    // PANEL SYSTEM (HUD overlays)
    // ──────────────────────────────────────
    function closePanel() {
      panelOpen = false;
      panelObjects.forEach(o => { try { k.destroy(o); } catch (_) { } });
      // Remove contact DOM overlay if present
      if (panelObjects._contactOverlay) {
        try { panelObjects._contactOverlay.remove(); } catch (_) { }
      }
      panelObjects = [];
    }

    function showPanel(chestId) {
      const PW = Math.min(680, W * 0.82);
      const PH = Math.min(380, H * 0.7);
      const PX = (W - PW) / 2;
      const PY = H * 0.08;
      const pad = 28;

      // Bg
      panelObjects.push(k.add([
        k.rect(PW, PH, { radius: 12 }),
        k.pos(PX, PY),
        k.color(C.panelBg),
        k.opacity(0.96),
        k.fixed(),
        k.z(200),
      ]));

      // Border
      panelObjects.push(k.add([
        k.rect(PW, PH, { radius: 12 }),
        k.pos(PX, PY),
        k.outline(2, C.accent),
        k.color(C.panelBg),
        k.opacity(0),
        k.fixed(),
        k.z(199),
      ]));

      const content = getContent(chestId);
      let ly = PY + pad;

      // Title
      panelObjects.push(k.add([
        k.text(content.title, { size: 20, font: 'monospace' }),
        k.pos(PX + pad, ly),
        k.color(C.accent),
        k.fixed(),
        k.z(201),
      ]));
      ly += 32;

      // Divider
      panelObjects.push(k.add([
        k.rect(PW - pad * 2, 1),
        k.pos(PX + pad, ly),
        k.color(C.accent),
        k.opacity(0.3),
        k.fixed(),
        k.z(201),
      ]));
      ly += 14;

      // Lines
      content.lines.forEach(line => {
        if (ly > PY + PH - 40) return;
        const isHighlight = line.startsWith('▸') || line.startsWith('★');
        panelObjects.push(k.add([
          k.text(line, { size: 13, font: 'monospace', width: PW - pad * 2 }),
          k.pos(PX + pad, ly),
          k.color(isHighlight ? C.accent : C.white),
          k.fixed(),
          k.z(201),
        ]));
        ly += line.length > 50 ? 36 : 20;
      });

      // Close hint
      panelObjects.push(k.add([
        k.text('[E] or [ESC] to close', { size: 10, font: 'monospace' }),
        k.pos(PX + PW / 2, PY + PH - 14),
        k.anchor('center'),
        k.color(C.muted),
        k.fixed(),
        k.z(201),
      ]));
    }

    function getContent(id) {
      const d = portfolioData;

      if (id === 'about') {
        return {
          title: '> ABOUT ME',
          lines: [
            `★ ${d.name} — ${d.title}`,
            '',
            ...d.about.map(p => p.length > 80 ? p.substring(0, 80) + '...' : p),
          ],
        };
      }
      if (id === 'skills') {
        return {
          title: '> SKILLS & TOOLS',
          lines: d.skills.map(s => `▸ ${s.name}`),
        };
      }
      if (id === 'projects') {
        const lines = [];
        d.projects.forEach((p, i) => {
          lines.push(`▸ ${i + 1}. ${p.title}`);
          lines.push(`  ${p.description.substring(0, 65)}...`);
          lines.push(`  [${p.tags.join(', ')}]`);
          lines.push('');
        });
        return { title: '> PROJECTS CHEST', lines };
      }
      if (id === 'education') {
        const edu = d.education[0];
        return {
          title: '> EDUCATION',
          lines: [
            `★ ${edu.degree}`,
            `  @ ${edu.institution}`,

            '',
            edu.description,
          ],
        };
      }
      if (id === 'contact') {
        // Create clickable DOM overlay for contact links
        const overlay = document.createElement('div');
        overlay.id = 'gm-contact-overlay';
        const PW = Math.min(680, W * 0.82);
        const PX = (W - PW) / 2;
        const PY = H * 0.08;
        const pad = 28;

        overlay.style.cssText = `
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 9999;
          pointer-events: none;
        `;
        const linksBox = document.createElement('div');
        linksBox.style.cssText = `
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: absolute;
          top: ${PY + 84}px;
          left: ${PX + pad}px;
        `;

        const contactItems = [
          { label: `📧  ${d.email}`, href: `mailto:${d.email}` },
          { label: `🔗  GitHub`, href: d.socials.github },
          { label: `🔗  LinkedIn`, href: d.socials.linkedin },
        ];
        contactItems.forEach(item => {
          const a = document.createElement('a');
          a.href = item.href;
          a.target = '_blank';
          a.rel = 'noreferrer';
          a.textContent = item.label;
          a.style.cssText = `
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            color: rgb(100, 255, 218);
            text-decoration: none;
            padding: 10px 20px;
            border: 1px solid rgba(100, 255, 218, 0.3);
            border-radius: 8px;
            background: rgba(12, 12, 28, 0.9);
            transition: background 0.2s, border-color 0.2s;
            cursor: pointer;
          `;
          a.addEventListener('mouseenter', () => {
            a.style.background = 'rgba(100, 255, 218, 0.15)';
            a.style.borderColor = 'rgb(100, 255, 218)';
          });
          a.addEventListener('mouseleave', () => {
            a.style.background = 'rgba(12, 12, 28, 0.9)';
            a.style.borderColor = 'rgba(100, 255, 218, 0.3)';
          });
          linksBox.appendChild(a);
        });
        overlay.appendChild(linksBox);
        container.appendChild(overlay);

        // Store reference so we can clean it up on close
        panelObjects._contactOverlay = overlay;

        return {
          title: '> CONTACT',
          lines: [
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            `"Let's build something together."`,
          ],
        };
      }
      return { title: id, lines: [] };
    }

    // ── HUD ──
    k.add([
      k.text(portfolioData.name, { size: 14, font: 'monospace' }),
      k.pos(24, 24),
      k.color(C.accent),
      k.fixed(),
      k.z(300),
    ]);
    k.add([
      k.text(portfolioData.title, { size: 10, font: 'monospace' }),
      k.pos(24, 42),
      k.color(C.muted),
      k.fixed(),
      k.z(300),
    ]);
  });

  k.go('game');
  return k;
};
