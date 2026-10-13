import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CharacterId, LevelData, PlayerState, CompanionState, Particle, Projectile, Collectible, Enemy, Platform } from '../types/game';
import { getLevelData } from './levels';
import { soundManager } from '../audio/soundManager';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ArrowLeft, Heart, Coins, Star, Shield, Zap, Sparkles } from 'lucide-react';

interface PlatformerCanvasProps {
  stageId: number;
  characterId: CharacterId;
  onExit: () => void;
  onStageClear: (data: { score: number; coins: number; stars: number; timeSec: number }) => void;
  onGameOver: () => void;
  bgImageUrl?: string;
}

export const PlatformerCanvas: React.FC<PlatformerCanvasProps> = ({
  stageId,
  characterId,
  onExit,
  onStageClear,
  onGameOver,
  bgImageUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);

  // Game flow states
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [hudState, setHudState] = useState({
    lives: 3,
    coins: 0,
    score: 0,
    stars: 0,
    bossHp: 0,
    bossMaxHp: 0,
    activePowerUp: 'none' as string,
    powerUpTimeLeft: 0,
  });

  // Touch control inputs
  const keysRef = useRef<{
    left: boolean;
    right: boolean;
    jump: boolean;
    action: boolean;
  }>({
    left: false,
    right: false,
    jump: false,
    action: false,
  });

  // Game-feel helpers: coyote time, jump buffer, stomp combo, floating texts
  const coyoteRef = useRef(0);
  const jumpBufferRef = useRef(0);
  const comboRef = useRef(0);
  const floatersRef = useRef<{ x: number; y: number; text: string; color: string; life: number }[]>([]);
  const addFloater = (x: number, y: number, text: string, color = '#FDE047') => {
    floatersRef.current.push({ x, y, text, color, life: 55 });
  };

  // Track start time for level time calculation
  const levelStartTimeRef = useRef<number>(Date.now());

  // Game internal entities ref
  const gameStateRef = useRef<{
    level: LevelData;
    player: PlayerState;
    companion: CompanionState;
    particles: Particle[];
    projectiles: Projectile[];
    cameraX: number;
    cameraY: number;
    lastCheckpoint: { x: number; y: number };
    cleared: boolean;
    gameOver: boolean;
    shake: number;
  } | null>(null);

  // Initialize level
  const initLevel = useCallback((id: number, char: CharacterId) => {
    const level = getLevelData(id);
    const isNena = char === 'nena' || char === 'duo';
    const isPepe = char === 'pepe';

    gameStateRef.current = {
      level,
      player: {
        x: level.spawnPoint.x,
        y: level.spawnPoint.y,
        vx: 0,
        vy: 0,
        width: 38,
        height: 52,
        isGrounded: false,
        facing: 'right',
        lives: 3,
        maxLives: 3,
        coins: 0,
        score: 0,
        stars: 0,
        isInvulnerable: false,
        invulnerabilityTimer: 0,
        hasDoubleJump: isNena,
        doubleJumpUsed: false,
        powerUp: 'none',
        powerUpTimer: 0,
        isAttacking: false,
        attackTimer: 0,
      },
      companion: {
        x: level.spawnPoint.x - 35,
        y: level.spawnPoint.y + 16,
        vx: 0,
        vy: 0,
        facing: 'right',
        isGrounded: false,
        barkTimer: 0,
        sniffing: false,
      },
      particles: [],
      projectiles: [],
      cameraX: 0,
      cameraY: 0,
      lastCheckpoint: { ...level.spawnPoint },
      cleared: false,
      gameOver: false,
      shake: 0,
    };

    coyoteRef.current = 0;
    jumpBufferRef.current = 0;
    comboRef.current = 0;
    floatersRef.current = [];
    levelStartTimeRef.current = Date.now();
    soundManager.startMusic();
  }, []);

  // Preload background image
  useEffect(() => {
    if (bgImageUrl) {
      const img = new Image();
      img.src = bgImageUrl;
      img.onload = () => {
        bgImgRef.current = img;
      };
    }
  }, [bgImageUrl]);

  // Initial setup & stage change
  useEffect(() => {
    initLevel(stageId, characterId);
    return () => {
      soundManager.stopMusic();
    };
  }, [stageId, characterId, initLevel]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Spacebar'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.repeat) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = true;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ' || e.key === 'Spacebar') {
        if (!keysRef.current.jump) {
          triggerJump();
        }
        keysRef.current.jump = true;
      }
      if (e.key === 'z' || e.key === 'Z' || e.key === 'j' || e.key === 'J' || e.key === 'Enter') {
        triggerAction();
        keysRef.current.action = true;
      }
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        setIsPaused((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = false;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ' || e.key === 'Spacebar') {
        keysRef.current.jump = false;
        const ps = gameStateRef.current?.player;
        if (ps && ps.vy < -4.5) ps.vy *= 0.5; // short hop when released early
      }
      if (e.key === 'z' || e.key === 'Z' || e.key === 'j' || e.key === 'J' || e.key === 'Enter') {
        keysRef.current.action = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const triggerJump = () => {
    const s = gameStateRef.current;
    if (!s || s.cleared || s.gameOver || isPaused) return;
    const p = s.player;

    const jumpForce = p.powerUp === 'high_jump' ? -15.5 : -13;

    if (p.isGrounded || coyoteRef.current > 0) {
      p.vy = jumpForce;
      p.isGrounded = false;
      p.doubleJumpUsed = false;
      coyoteRef.current = 0;
      jumpBufferRef.current = 0;
      soundManager.playJump();
      spawnDust(p.x + p.width / 2, p.y + p.height, 6, '#cbd5e1');
    } else if (p.hasDoubleJump && !p.doubleJumpUsed) {
      p.vy = jumpForce * 0.92;
      p.doubleJumpUsed = true;
      soundManager.playDoubleJump();
      spawnSparkles(p.x + p.width / 2, p.y + p.height, 8, '#F43F5E');
    } else {
      // Pressed slightly before landing: remember the jump for a few frames
      jumpBufferRef.current = 7;
    }
  };

  const triggerAction = () => {
    const s = gameStateRef.current;
    if (!s || s.cleared || s.gameOver || isPaused) return;
    const p = s.player;
    const c = s.companion;

    // Bidu companion bark action
    c.barkTimer = 35;
    soundManager.playBark();

    // Spawn sound wave particles
    for (let i = 0; i < 10; i++) {
      s.particles.push({
        x: c.x + (c.facing === 'right' ? 24 : 0),
        y: c.y + 12,
        vx: (c.facing === 'right' ? 1 : -1) * (2 + Math.random() * 3),
        vy: (Math.random() - 0.5) * 2,
        color: '#FBBF24',
        size: 4 + Math.random() * 3,
        life: 25,
        maxLife: 25,
        shape: 'spark',
      });
    }

    // Bark effect: Attract nearby coins and stun/damage slimes
    s.level.collectibles.forEach((col) => {
      if (!col.collected && col.type === 'coin') {
        const dx = (col.x + 12) - c.x;
        const dy = (col.y + 12) - c.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
          col.x -= dx * 0.25;
          col.y -= dy * 0.25;
        }
      }
    });

    s.level.enemies.forEach((enemy) => {
      if (enemy.alive) {
        const dx = (enemy.x + enemy.width / 2) - c.x;
        const dy = (enemy.y + enemy.height / 2) - c.y;
        if (Math.hypot(dx, dy) < 160) {
          enemy.vx = (enemy.x > c.x ? 2.5 : -2.5);
          spawnSparkles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 6, '#FBBF24');
        }
      }
    });
  };

  const spawnDust = (x: number, y: number, count: number, color = '#E2E8F0') => {
    const s = gameStateRef.current;
    if (!s) return;
    for (let i = 0; i < count; i++) {
      s.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2,
        size: 3 + Math.random() * 3,
        color,
        life: 20,
        maxLife: 20,
        shape: 'smoke',
      });
    }
  };

  const spawnSparkles = (x: number, y: number, count: number, color = '#FDE047') => {
    const s = gameStateRef.current;
    if (!s) return;
    for (let i = 0; i < count; i++) {
      s.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        size: 3 + Math.random() * 4,
        color,
        life: 25,
        maxLife: 25,
        shape: 'star',
      });
    }
  };

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to full resolution
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || 960;
      canvas.height = canvas.parentElement?.clientHeight || 540;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const updatePhysics = () => {
      const s = gameStateRef.current;
      if (!s || isPaused || s.gameOver || s.cleared) return;
      const p = s.player;
      const c = s.companion;
      const level = s.level;

      // Update Invulnerability and PowerUp timers
      if (p.isInvulnerable) {
        p.invulnerabilityTimer--;
        if (p.invulnerabilityTimer <= 0) p.isInvulnerable = false;
      }
      if (p.powerUpTimer > 0) {
        p.powerUpTimer--;
        if (p.powerUpTimer <= 0) p.powerUp = 'none';
      }
      if (c.barkTimer > 0) c.barkTimer--;

      // Movement input
      const speed = p.powerUp === 'speed' ? 6.5 : 4.8;
      const accel = 0.6;
      const friction = 0.82;

      if (keysRef.current.left) {
        p.vx -= accel;
        p.facing = 'left';
      } else if (keysRef.current.right) {
        p.vx += accel;
        p.facing = 'right';
      } else {
        p.vx *= friction;
      }

      // Max horizontal speed clamp
      if (p.vx > speed) p.vx = speed;
      if (p.vx < -speed) p.vx = -speed;
      if (Math.abs(p.vx) < 0.05) p.vx = 0;

      // Gravity
      p.vy += 0.62;
      if (p.vy > 14) p.vy = 14;

      // Proposed new positions
      let newX = p.x + p.vx;
      let newY = p.y + p.vy;

      // Boundary clamp
      if (newX < 0) newX = 0;
      if (newX > level.width - p.width) newX = level.width - p.width;

      p.isGrounded = false;

      // Platform Collisions
      level.platforms.forEach((plat) => {
        // Moving platform update
        if (plat.type === 'moving' && plat.moveRange && plat.moveSpeed) {
          plat.currentOffset = (plat.currentOffset || 0) + plat.moveSpeed;
          if (Math.abs(plat.currentOffset) > plat.moveRange) {
            plat.moveSpeed = -plat.moveSpeed;
          }
        }

        // Crumbly platform update
        if (plat.type === 'crumbly' && plat.crumbled) {
          plat.crumbleTimer = (plat.crumbleTimer || 0) - 1;
          if (plat.crumbleTimer <= 0) {
            plat.crumbled = false;
          }
          return; // inactive while crumbled
        }

        const platX = plat.x + (plat.type === 'moving' ? (plat.currentOffset || 0) : 0);
        const platY = plat.y;
        const platW = plat.width;
        const platH = plat.height;

        // Check if player lands on platform from above
        const prevBottom = p.y + p.height;
        const newBottom = newY + p.height;

        if (
          newX + p.width > platX + 4 &&
          newX < platX + platW - 4 &&
          prevBottom <= platY + 6 &&
          newBottom >= platY
        ) {
          // Landed on top
          newY = platY - p.height;
          p.vy = 0;
          p.isGrounded = true;
          p.doubleJumpUsed = false;

          // Carry player with moving platform
          if (plat.type === 'moving' && plat.moveSpeed) {
            newX += plat.moveSpeed;
          }

          // Handle Spring
          if (plat.type === 'spring') {
            p.vy = -18;
            p.isGrounded = false;
            soundManager.playDoubleJump();
            spawnSparkles(platX + platW / 2, platY, 12, '#38BDF8');
          }

          // Handle Crumbly
          if (plat.type === 'crumbly' && !plat.crumbled) {
            spawnDust(platX + platW / 2, platY, 4, '#F59E0B');
            setTimeout(() => {
              plat.crumbled = true;
              plat.crumbleTimer = 140;
            }, 350);
          }
        }
      });

      p.x = newX;
      p.y = newY;

      // Coyote time + buffered jump + combo reset
      if (p.isGrounded) {
        coyoteRef.current = 6;
        comboRef.current = 0;
        if (jumpBufferRef.current > 0) {
          jumpBufferRef.current = 0;
          const jf = p.powerUp === 'high_jump' ? -15.5 : -13;
          p.vy = jf;
          p.isGrounded = false;
          coyoteRef.current = 0;
          soundManager.playJump();
          spawnDust(p.x + p.width / 2, p.y + p.height, 6, '#cbd5e1');
        }
      } else if (coyoteRef.current > 0) {
        coyoteRef.current--;
      }
      if (jumpBufferRef.current > 0) jumpBufferRef.current--;

      // Floating score texts
      floatersRef.current.forEach((fl) => { fl.y -= 0.9; fl.life--; });
      floatersRef.current = floatersRef.current.filter((fl) => fl.life > 0);

      // Pit fall detection
      if (p.y > level.height) {
        handlePlayerDamage('Caiu no precipício!');
      }

      // Companion AI (Bidu follows smoothly)
      const targetCompanionX = p.facing === 'right' ? p.x - 36 : p.x + p.width + 12;
      const companionDiffX = targetCompanionX - c.x;
      c.vx = companionDiffX * 0.12;
      c.facing = p.vx > 0.2 ? 'right' : p.vx < -0.2 ? 'left' : p.facing;
      c.vy += 0.55;
      if (c.vy > 12) c.vy = 12;

      let compNewY = c.y + c.vy;
      let compNewX = c.x + c.vx;

      // Platform collision for companion
      level.platforms.forEach((plat) => {
        const platX = plat.x + (plat.type === 'moving' ? (plat.currentOffset || 0) : 0);
        if (
          compNewX + 24 > platX &&
          compNewX < platX + plat.width &&
          c.y + 24 <= plat.y + 6 &&
          compNewY + 24 >= plat.y
        ) {
          compNewY = plat.y - 24;
          c.vy = 0;
          c.isGrounded = true;
        }
      });
      c.x = compNewX;
      c.y = compNewY;

      // Checkpoint verification
      level.checkpoints.forEach((cp) => {
        if (!cp.activated && Math.abs(p.x - cp.x) < 40 && Math.abs(p.y - cp.y) < 70) {
          cp.activated = true;
          s.lastCheckpoint = { x: cp.x, y: cp.y - 10 };
          soundManager.playCheckpoint();
          spawnSparkles(cp.x, cp.y - 30, 20, '#F59E0B');
        }
      });

      // Goal detection
      const distToGoal = Math.hypot(p.x - level.goalPoint.x, p.y - level.goalPoint.y);
      if (distToGoal < 65 && (!level.boss || !level.enemies.find(e => e.type === 'dragon' && e.alive))) {
        s.cleared = true;
        soundManager.playVictory();
        const timeSec = Math.floor((Date.now() - levelStartTimeRef.current) / 1000);
        onStageClear({
          score: p.score + 500,
          coins: p.coins,
          stars: p.stars,
          timeSec,
        });
      }

      // Collectibles Collision
      level.collectibles.forEach((item) => {
        if (item.collected) return;
        item.bobOffset += 0.05;

        const itemX = item.x;
        const itemY = item.y + Math.sin(item.bobOffset) * 4;
        const itemW = item.type === 'chest' ? 32 : 24;
        const itemH = item.type === 'chest' ? 28 : 24;

        if (
          p.x + p.width > itemX &&
          p.x < itemX + itemW &&
          p.y + p.height > itemY &&
          p.y < itemY + itemH
        ) {
          item.collected = true;

          if (item.type === 'coin') {
            p.coins += 1;
            p.score += item.value;
            soundManager.playCoin();
            spawnSparkles(itemX + 12, itemY + 12, 6, '#FBBF24');
            if (p.coins % 50 === 0 && p.lives < p.maxLives) {
              p.lives++;
              soundManager.playHeart();
            }
          } else if (item.type === 'star') {
            p.stars += 1;
            p.score += item.value;
            soundManager.playStar();
            spawnSparkles(itemX + 12, itemY + 12, 16, '#F59E0B');
          } else if (item.type === 'heart') {
            if (p.lives < p.maxLives) p.lives++;
            p.score += 50;
            soundManager.playHeart();
            spawnSparkles(itemX + 12, itemY + 12, 10, '#EF4444');
          } else if (item.type === 'potion_jump') {
            p.powerUp = 'high_jump';
            p.powerUpTimer = 600; // ~10 seconds
            soundManager.playPotion();
            spawnSparkles(itemX + 12, itemY + 12, 12, '#38BDF8');
          } else if (item.type === 'potion_speed') {
            p.powerUp = 'speed';
            p.powerUpTimer = 600;
            soundManager.playPotion();
            spawnSparkles(itemX + 12, itemY + 12, 12, '#10B981');
          } else if (item.type === 'potion_shield') {
            p.powerUp = 'shield';
            p.powerUpTimer = 700;
            soundManager.playPotion();
            spawnSparkles(itemX + 12, itemY + 12, 12, '#A855F7');
          } else if (item.type === 'chest') {
            p.score += item.value;
            p.coins += 15;
            soundManager.playChest();
            spawnSparkles(itemX + 16, itemY + 14, 25, '#F59E0B');
          }
        }
      });

      // Enemies Updates & Collision
      level.enemies.forEach((enemy) => {
        if (!enemy.alive) return;

        // Boss Dragon AI logic
        if (enemy.type === 'dragon') {
          enemy.x += enemy.vx;
          if (enemy.x > enemy.maxX || enemy.x < enemy.minX) {
            enemy.vx = -enemy.vx;
          }

          // Dragon undulating hovering movement
          enemy.y = 360 + Math.sin(Date.now() / 400) * 50;

          // Dragon attack timer
          enemy.attackTimer = (enemy.attackTimer || 0) + 1;
          if (enemy.attackTimer > 130) {
            enemy.attackTimer = 0;
            soundManager.playBossRoar();
            // Shoot fireball towards player
            const dx = (p.x + p.width / 2) - (enemy.x + 30);
            const dy = (p.y + p.height / 2) - (enemy.y + 40);
            const len = Math.hypot(dx, dy) || 1;
            s.projectiles.push({
              x: enemy.x + (enemy.vx > 0 ? enemy.width : 0),
              y: enemy.y + 40,
              vx: (dx / len) * 4.5,
              vy: (dy / len) * 4.5,
              radius: 12,
              color: '#EF4444',
              fromBoss: true,
            });
          }
        } else {
          // Standard enemies patrol
          enemy.x += enemy.vx;
          if (enemy.x > enemy.maxX || enemy.x < enemy.minX) {
            enemy.vx = -enemy.vx;
          }
        }

        // Enemy vs Player collision
        if (
          p.x + p.width > enemy.x &&
          p.x < enemy.x + enemy.width &&
          p.y + p.height > enemy.y &&
          p.y < enemy.y + enemy.height
        ) {
          // Check if player lands on top of enemy (Stomp!)
          const prevBottom = p.y + p.height - p.vy;
          const isStomp = prevBottom <= enemy.y + 14 && p.vy > 0;

          if (isStomp) {
            // Player bounced on top
            p.vy = -11;
            enemy.health -= 1;
            soundManager.playStomp();
            spawnSparkles(enemy.x + enemy.width / 2, enemy.y, 10, '#F59E0B');

            if (enemy.type === 'dragon') {
              soundManager.playBossHit();
              s.shake = 12;
              if (enemy.health <= 0) {
                enemy.alive = false;
                p.score += 2000;
                soundManager.playVictory();
                spawnSparkles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 40, '#FBBF24');
              }
            } else {
              enemy.alive = false;
              comboRef.current += 1;
              const pts = 100 * comboRef.current;
              p.score += pts;
              addFloater(enemy.x + enemy.width / 2, enemy.y - 6, comboRef.current > 1 ? `+${pts}  COMBO x${comboRef.current}!` : `+${pts}`, comboRef.current > 1 ? '#F472B6' : '#FDE047');
              if (comboRef.current > 1) s.shake = Math.max(s.shake, 6);
            }
          } else {
            // Player takes hit
            if (!p.isInvulnerable && p.powerUp !== 'shield') {
              handlePlayerDamage('Atingido por um inimigo!');
            } else if (p.powerUp === 'shield') {
              // Shield absorbs hit
              p.powerUp = 'none';
              p.isInvulnerable = true;
              p.invulnerabilityTimer = 60;
              soundManager.playHit();
              s.shake = 8;
            }
          }
        }
      });

      // Projectiles update
      for (let i = s.projectiles.length - 1; i >= 0; i--) {
        const proj = s.projectiles[i];
        proj.x += proj.vx;
        proj.y += proj.vy;

        // Player collision
        if (
          p.x + p.width > proj.x - proj.radius &&
          p.x < proj.x + proj.radius &&
          p.y + p.height > proj.y - proj.radius &&
          p.y < proj.y + proj.radius
        ) {
          s.projectiles.splice(i, 1);
          if (!p.isInvulnerable && p.powerUp !== 'shield') {
            handlePlayerDamage('Atingido por bola de fogo!');
          }
          continue;
        }

        // Out of bounds
        if (proj.x < 0 || proj.x > level.width || proj.y > level.height) {
          s.projectiles.splice(i, 1);
        }
      }

      // Update particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const pt = s.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        if (pt.life <= 0) {
          s.particles.splice(i, 1);
        }
      }

      // Smooth Camera tracking
      const targetCamX = p.x - canvas.width / 2 + p.width / 2;
      const targetCamY = p.y - canvas.height / 2 + p.height / 2;
      s.cameraX += (targetCamX - s.cameraX) * 0.1;
      s.cameraY += (targetCamY - s.cameraY) * 0.08;

      // Camera limits
      if (s.cameraX < 0) s.cameraX = 0;
      if (s.cameraX > level.width - canvas.width) s.cameraX = level.width - canvas.width;
      if (s.cameraY < 0) s.cameraY = 0;
      if (s.cameraY > level.height - canvas.height) s.cameraY = level.height - canvas.height;

      // Screen shake decay
      if (s.shake > 0) s.shake *= 0.85;

      // Sync state to UI HUD
      const dragonEnemy = level.enemies.find((e) => e.type === 'dragon');
      setHudState({
        lives: p.lives,
        coins: p.coins,
        score: p.score,
        stars: p.stars,
        bossHp: dragonEnemy?.health || 0,
        bossMaxHp: dragonEnemy?.maxHealth || 0,
        activePowerUp: p.powerUp,
        powerUpTimeLeft: Math.ceil(p.powerUpTimer / 60),
      });
    };

    const handlePlayerDamage = (reason: string) => {
      const s = gameStateRef.current;
      if (!s) return;
      const p = s.player;

      p.lives--;
      soundManager.playHit();
      s.shake = 10;
      p.isInvulnerable = true;
      p.invulnerabilityTimer = 90;

      if (p.lives <= 0) {
        s.gameOver = true;
        soundManager.playGameOver();
        onGameOver();
      } else {
        // Respawn at checkpoint
        p.x = s.lastCheckpoint.x;
        p.y = s.lastCheckpoint.y;
        p.vx = 0;
        p.vy = 0;
        spawnDust(p.x + p.width / 2, p.y + p.height, 10, '#38BDF8');
      }
    };

    const render = () => {
      const s = gameStateRef.current;
      if (!s) return;
      const p = s.player;
      const c = s.companion;
      const level = s.level;

      ctx.save();

      // Screen shake offset
      const shakeOffsetX = (Math.random() - 0.5) * s.shake;
      const shakeOffsetY = (Math.random() - 0.5) * s.shake;
      ctx.translate(shakeOffsetX, shakeOffsetY);

      // Clear screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Parallax Background
      const tNow = performance.now() / 1000;
      const useImage = level.bgTheme !== 'volcano' && bgImgRef.current && bgImgRef.current.complete && bgImgRef.current.naturalWidth > 0;
      if (useImage) {
        // Cover-fit (no stretching) + horizontal parallax tiling
        const img = bgImgRef.current as HTMLImageElement;
        const scale = canvas.height / img.naturalHeight;
        const drawW = Math.max(canvas.width, img.naturalWidth * scale);
        const off = -((s.cameraX * 0.2) % drawW);
        for (let x = off; x < canvas.width; x += drawW) {
          ctx.drawImage(img, x, 0, drawW, canvas.height);
        }
        // Soft vignette for depth
        const vg = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.height * 0.35, canvas.width / 2, canvas.height / 2, canvas.width * 0.75);
        vg.addColorStop(0, 'rgba(0,0,0,0)');
        vg.addColorStop(1, 'rgba(0,0,0,0.38)');
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (level.bgTheme === 'volcano') {
        // Procedural volcano scene: fiery sky, parallax cones, glowing lava horizon
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#1c0505');
        grad.addColorStop(0.55, '#7f1d1d');
        grad.addColorStop(1, '#f97316');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const sun = ctx.createRadialGradient(canvas.width * 0.7, canvas.height * 0.78, 10, canvas.width * 0.7, canvas.height * 0.78, canvas.height * 0.7);
        sun.addColorStop(0, 'rgba(253,224,71,0.55)');
        sun.addColorStop(1, 'rgba(253,224,71,0)');
        ctx.fillStyle = sun;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        [[0.12, '#2a0a0a', 0.55], [0.3, '#180505', 0.4]].forEach(([speed, color, h]) => {
          ctx.fillStyle = color as string;
          const period = 520;
          const offv = -((s.cameraX * (speed as number)) % period);
          for (let x = offv - period; x < canvas.width + period; x += period) {
            ctx.beginPath();
            ctx.moveTo(x, canvas.height);
            ctx.lineTo(x + period * 0.28, canvas.height * (1 - (h as number)));
            ctx.lineTo(x + period * 0.36, canvas.height * (1 - (h as number)) + 14);
            ctx.lineTo(x + period * 0.46, canvas.height * (1 - (h as number)));
            ctx.lineTo(x + period * 0.8, canvas.height);
            ctx.closePath();
            ctx.fill();
          }
        });
      } else {
        // Solid theme gradient fallback (while the image loads)
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        if (level.bgTheme === 'forest') {
          grad.addColorStop(0, '#064E3B');
          grad.addColorStop(1, '#065F46');
        } else if (level.bgTheme === 'clouds') {
          grad.addColorStop(0, '#0284C7');
          grad.addColorStop(1, '#7DD3FC');
        } else if (level.bgTheme === 'crystals') {
          grad.addColorStop(0, '#1E1B4B');
          grad.addColorStop(1, '#4C1D95');
        } else {
          grad.addColorStop(0, '#0F172A');
          grad.addColorStop(1, '#312E81');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Ambient atmosphere per theme (fireflies, embers, sparkles, drifting petals)
      {
        const amb: Record<string, [string, number, number]> = {
          forest: ['#FDE68A', -0.25, 0.35],
          clouds: ['#FFFFFF', 0.4, 0.15],
          crystals: ['#C4B5FD', -0.2, 0.3],
          volcano: ['#FB923C', -1.0, 0.5],
          castle: ['#F472B6', -0.3, 0.25],
        };
        const [col, riseSpeed, drift] = amb[level.bgTheme] || amb.forest;
        ctx.save();
        for (let i = 0; i < 38; i++) {
          const seed = i * 97.13;
          const bx = ((seed * 7.7) % canvas.width);
          const by = ((seed * 3.1) % canvas.height);
          const x = (bx + Math.sin(tNow * drift + i) * 30 - s.cameraX * (0.05 + (i % 4) * 0.03) + canvas.width * 4) % canvas.width;
          const y = ((by + tNow * riseSpeed * 28) % canvas.height + canvas.height) % canvas.height;
          ctx.globalAlpha = 0.25 + 0.35 * Math.abs(Math.sin(tNow * 1.5 + i));
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(x, y, 1.5 + (i % 3), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // World Camera Space
      ctx.save();
      ctx.translate(-Math.floor(s.cameraX), -Math.floor(s.cameraY));

      // Draw Checkpoints
      level.checkpoints.forEach((cp) => {
        ctx.save();
        ctx.fillStyle = '#64748B';
        ctx.fillRect(cp.x, cp.y - 45, 6, 45); // flagpole
        // Flag banner
        ctx.fillStyle = cp.activated ? '#10B981' : '#EF4444';
        ctx.beginPath();
        ctx.moveTo(cp.x + 6, cp.y - 45);
        ctx.lineTo(cp.x + 32, cp.y - 32);
        ctx.lineTo(cp.x + 6, cp.y - 20);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // Draw Goal Portal
      ctx.save();
      const goalX = level.goalPoint.x;
      const goalY = level.goalPoint.y;
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(goalX, goalY, 40, 0, Math.PI * 2);
      ctx.stroke();

      // Spinning inner portal
      const rot = Date.now() / 300;
      ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
      ctx.beginPath();
      ctx.arc(goalX, goalY, 35, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★', goalX, goalY + 8);
      ctx.restore();

      // Draw Platforms (themed, with gradients, highlights and details)
      level.platforms.forEach((plat) => {
        if (plat.type === 'crumbly' && plat.crumbled) return;

        const platX = plat.x + (plat.type === 'moving' ? (plat.currentOffset || 0) : 0);
        const platY = plat.y;
        const platW = plat.width;
        const platH = plat.height;
        const visH = Math.min(platH, 420);

        // Depth treatment: soft contact shadow, beveled front edge and a
        // light-catching top rim create a polished 2.5D platformer look.
        const depth = plat.type === 'cloud' ? 8 : 11;
        ctx.save();
        ctx.globalAlpha = 0.26;
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.roundRect(platX + 5, platY + depth + 4, Math.max(8, platW - 1), Math.min(platH, 22), 8);
        ctx.fill();
        ctx.restore();

        const sideColors: Record<string, string> = {
          stone: '#241b16', wood: '#451a03', cloud: '#60a5fa',
          crystal: '#4c1d95', basalt: '#09090b', spring: '#075985',
          crumbly: '#78350f', moving: '#334155',
        };
        // Right-hand extrusion is deliberately decorative: collision geometry stays unchanged.
        ctx.save();
        ctx.fillStyle = sideColors[plat.type] || '#1e293b';
        ctx.beginPath();
        ctx.moveTo(platX + platW - 2, platY + 5);
        ctx.lineTo(platX + platW + depth, platY - 1);
        ctx.lineTo(platX + platW + depth, platY + Math.min(visH, 34));
        ctx.lineTo(platX + platW - 2, platY + Math.min(visH, 40));
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        const body = (c1: string, c2: string, radius = 6) => {
          const g = ctx.createLinearGradient(0, platY, 0, platY + Math.min(visH, 120));
          g.addColorStop(0, c1);
          g.addColorStop(1, c2);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.roundRect(platX, platY, platW, visH, [radius, radius, 0, 0]);
          ctx.fill();
        };

        ctx.save();
        if (plat.type === 'stone') {
          body('#5b4a36', '#2b2118');
          // dirt speckles
          ctx.fillStyle = 'rgba(0,0,0,0.18)';
          for (let x = platX + 14; x < platX + platW - 8; x += 38) {
            for (let y = platY + 22; y < platY + Math.min(visH, 130); y += 30) {
              ctx.beginPath();
              ctx.ellipse(x + ((y * 7) % 11), y, 6, 3.5, 0, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          // grass cap with tufts
          const gg = ctx.createLinearGradient(0, platY, 0, platY + 12);
          gg.addColorStop(0, '#4ade80');
          gg.addColorStop(1, '#16a34a');
          ctx.fillStyle = gg;
          ctx.beginPath();
          ctx.roundRect(platX - 2, platY - 2, platW + 4, 12, 6);
          ctx.fill();
          ctx.fillStyle = '#86efac';
          for (let x = platX + 6; x < platX + platW - 4; x += 14) {
            ctx.beginPath();
            ctx.moveTo(x, platY - 1);
            ctx.lineTo(x + 3, platY - 7 - ((x * 3) % 4));
            ctx.lineTo(x + 6, platY - 1);
            ctx.fill();
          }
        } else if (plat.type === 'wood') {
          body('#b45309', '#78350f', 5);
          ctx.strokeStyle = 'rgba(0,0,0,0.3)';
          ctx.lineWidth = 2;
          for (let x = platX + 24; x < platX + platW; x += 24) {
            ctx.beginPath();
            ctx.moveTo(x, platY + 2);
            ctx.lineTo(x, platY + visH - 2);
            ctx.stroke();
          }
          ctx.fillStyle = 'rgba(255,255,255,0.28)';
          ctx.fillRect(platX + 3, platY + 2, platW - 6, 3);
        } else if (plat.type === 'cloud') {
          // Puffy cloud made of overlapping circles
          ctx.shadowColor = 'rgba(186,230,253,0.9)';
          ctx.shadowBlur = 14;
          ctx.fillStyle = '#F0F9FF';
          ctx.beginPath();
          ctx.roundRect(platX, platY + 4, platW, platH - 4, 14);
          ctx.fill();
          ctx.shadowBlur = 0;
          for (let x = platX + 10; x < platX + platW; x += 26) {
            ctx.beginPath();
            ctx.arc(x + 8, platY + 6, 10 + ((x * 5) % 5), 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = 'rgba(125,211,252,0.55)';
          ctx.fillRect(platX + 6, platY + platH - 8, platW - 12, 6);
        } else if (plat.type === 'crystal') {
          ctx.shadowColor = '#A78BFA';
          ctx.shadowBlur = 16 + Math.sin(tNow * 2 + platX) * 5;
          body('#a78bfa', '#5b21b6', 8);
          ctx.shadowBlur = 0;
          ctx.fillStyle = 'rgba(255,255,255,0.45)';
          ctx.fillRect(platX + 6, platY + 2, platW - 12, 3);
          ctx.fillStyle = '#e9d5ff';
          for (let x = platX + 14; x < platX + platW - 10; x += 36) {
            ctx.beginPath();
            ctx.moveTo(x, platY + visH);
            ctx.lineTo(x + 6, platY + visH + 10);
            ctx.lineTo(x + 12, platY + visH);
            ctx.fill();
          }
        } else if (plat.type === 'basalt') {
          body('#44403c', '#0c0a09', 4);
          // glowing lava cracks + hot top edge
          const pulse = 0.55 + 0.45 * Math.sin(tNow * 3 + platX * 0.01);
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(249,115,22,${0.7 + 0.3 * pulse})`;
          ctx.fillRect(platX, platY, platW, 5);
          ctx.shadowBlur = 0;
          ctx.strokeStyle = `rgba(251,146,60,${0.35 + 0.4 * pulse})`;
          ctx.lineWidth = 2;
          for (let x = platX + 20; x < platX + platW - 10; x += 52) {
            ctx.beginPath();
            ctx.moveTo(x, platY + 8);
            ctx.lineTo(x + 8, platY + 24);
            ctx.lineTo(x + 2, platY + 40);
            ctx.stroke();
          }
        } else if (plat.type === 'spring') {
          const squash = 3 * Math.sin(tNow * 8);
          ctx.fillStyle = '#0369a1';
          ctx.fillRect(platX + 6, platY + 10, platW - 12, platH - 10);
          ctx.strokeStyle = '#7dd3fc';
          ctx.lineWidth = 2;
          for (let y = platY + 14; y < platY + platH - 2; y += 5) {
            ctx.beginPath();
            ctx.moveTo(platX + 8, y);
            ctx.lineTo(platX + platW - 8, y + 2);
            ctx.stroke();
          }
          const tg = ctx.createLinearGradient(0, platY + squash, 0, platY + 12);
          tg.addColorStop(0, '#7dd3fc');
          tg.addColorStop(1, '#0ea5e9');
          ctx.fillStyle = tg;
          ctx.beginPath();
          ctx.roundRect(platX, platY + squash, platW, 12, 5);
          ctx.fill();
        } else if (plat.type === 'crumbly') {
          body('#f59e0b', '#92400e', 4);
          ctx.strokeStyle = 'rgba(0,0,0,0.4)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(platX + platW * 0.3, platY);
          ctx.lineTo(platX + platW * 0.4, platY + platH * 0.5);
          ctx.lineTo(platX + platW * 0.33, platY + platH);
          ctx.moveTo(platX + platW * 0.7, platY);
          ctx.lineTo(platX + platW * 0.62, platY + platH * 0.6);
          ctx.stroke();
        } else {
          // Castle stonework with bricks
          body('#475569', '#1e293b', 3);
          ctx.strokeStyle = 'rgba(0,0,0,0.35)';
          ctx.lineWidth = 1.5;
          const rowH = 16;
          for (let y = platY + rowH, r = 0; y < platY + Math.min(visH, 110); y += rowH, r++) {
            ctx.beginPath();
            ctx.moveTo(platX, y);
            ctx.lineTo(platX + platW, y);
            ctx.stroke();
            for (let x = platX + (r % 2 ? 20 : 0); x < platX + platW; x += 40) {
              ctx.beginPath();
              ctx.moveTo(x, y - rowH);
              ctx.lineTo(x, y);
              ctx.stroke();
            }
          }
          ctx.fillStyle = 'rgba(255,255,255,0.18)';
          ctx.fillRect(platX, platY, platW, 3);
        }
        // Small specular rim gives each platform a toy-like, dimensional finish.
        ctx.save();
        ctx.globalAlpha = 0.34;
        ctx.strokeStyle = plat.type === 'cloud' ? '#ffffff' : '#f8fafc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(platX + 8, platY + 1);
        ctx.lineTo(platX + Math.max(8, platW - 8), platY + 1);
        ctx.stroke();
        ctx.restore();
        ctx.restore();
      });

      // Draw Collectibles
      level.collectibles.forEach((item) => {
        if (item.collected) return;

        const itemX = item.x;
        const itemY = item.y + Math.sin(item.bobOffset) * 4;

        ctx.save();
        if (item.type === 'coin') {
          // Rotating coin
          const scaleX = Math.abs(Math.sin(item.bobOffset * 1.5)) * 0.6 + 0.4;
          ctx.translate(itemX + 12, itemY + 12);
          ctx.scale(scaleX, 1);
          ctx.fillStyle = '#FBBF24';
          ctx.beginPath();
          ctx.arc(0, 0, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('$', 0, 4);
        } else if (item.type === 'star') {
          // Star
          ctx.fillStyle = '#F59E0B';
          ctx.font = '24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⭐', itemX + 12, itemY + 18);
        } else if (item.type === 'heart') {
          // Heart
          ctx.fillStyle = '#EF4444';
          ctx.font = '22px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('❤️', itemX + 12, itemY + 18);
        } else if (item.type.startsWith('potion')) {
          // Potion bottle
          ctx.fillStyle = '#38BDF8';
          ctx.font = '22px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🧪', itemX + 12, itemY + 18);
        } else if (item.type === 'chest') {
          // Chest
          ctx.fillStyle = '#F59E0B';
          ctx.font = '26px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🧰', itemX + 16, itemY + 22);
        }
        ctx.restore();
      });

      // Draw Enemies
      level.enemies.forEach((enemy) => {
        if (!enemy.alive) return;
        ctx.save();

        if (enemy.type === 'dragon') {
          // The Boss: O Dragão das Sombras
          const dw = enemy.width;
          const dh = enemy.height;
          ctx.translate(enemy.x + dw / 2, enemy.y + dh / 2);
          if (enemy.vx > 0) ctx.scale(-1, 1);

          // Dragon Body (Dark obsidian red)
          ctx.fillStyle = '#7F1D1D';
          ctx.beginPath();
          ctx.ellipse(0, 10, 55, 35, 0, 0, Math.PI * 2);
          ctx.fill();

          // Dragon Wings flapping
          const wingAngle = Math.sin(Date.now() / 150) * 0.4;
          ctx.save();
          ctx.rotate(wingAngle);
          ctx.fillStyle = '#991B1B';
          ctx.beginPath();
          ctx.moveTo(-20, 0);
          ctx.lineTo(-55, -50);
          ctx.lineTo(-10, -35);
          ctx.lineTo(25, -60);
          ctx.lineTo(10, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // Dragon Head & Horns
          ctx.fillStyle = '#991B1B';
          ctx.beginPath();
          ctx.ellipse(45, -10, 24, 18, 0.2, 0, Math.PI * 2);
          ctx.fill();

          // Horns
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.moveTo(40, -22);
          ctx.lineTo(55, -45);
          ctx.lineTo(35, -25);
          ctx.fill();

          // Glowing Dragon Eye
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(52, -14, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.fillRect(52, -16, 2, 5);

          // Dragon Tail
          ctx.fillStyle = '#7F1D1D';
          ctx.beginPath();
          ctx.moveTo(-45, 10);
          ctx.quadraticCurveTo(-75, 20, -85, 5);
          ctx.lineTo(-50, 18);
          ctx.fill();
        } else if (enemy.type === 'slime') {
          // Bouncy Slime
          const squish = Math.sin(Date.now() / 120) * 3;
          ctx.fillStyle = '#10B981';
          ctx.beginPath();
          ctx.ellipse(
            enemy.x + enemy.width / 2,
            enemy.y + enemy.height / 2 + squish / 2,
            enemy.width / 2 + squish / 2,
            enemy.height / 2 - squish / 2,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
          // Eyes
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(enemy.x + 12, enemy.y + 12, 4, 0, Math.PI * 2);
          ctx.arc(enemy.x + 24, enemy.y + 12, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#064E3B';
          ctx.beginPath();
          ctx.arc(enemy.x + 13, enemy.y + 12, 2, 0, Math.PI * 2);
          ctx.arc(enemy.x + 25, enemy.y + 12, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (enemy.type === 'bird') {
          // Bird
          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.ellipse(enemy.x + 16, enemy.y + 12, 14, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          // Beak
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.moveTo(enemy.x + 28, enemy.y + 10);
          ctx.lineTo(enemy.x + 36, enemy.y + 14);
          ctx.lineTo(enemy.x + 28, enemy.y + 16);
          ctx.fill();
        } else if (enemy.type === 'crab') {
          // Crystal Crab
          ctx.fillStyle = '#8B5CF6';
          ctx.beginPath();
          ctx.roundRect(enemy.x, enemy.y + 8, enemy.width, enemy.height - 8, 6);
          ctx.fill();
          ctx.fillStyle = '#C084FC';
          ctx.beginPath();
          ctx.moveTo(enemy.x + 4, enemy.y + 8);
          ctx.lineTo(enemy.x + 14, enemy.y);
          ctx.lineTo(enemy.x + 24, enemy.y + 8);
          ctx.fill();
        } else {
          // Bat / Knight
          ctx.fillStyle = '#64748B';
          ctx.beginPath();
          ctx.roundRect(enemy.x, enemy.y, enemy.width, enemy.height, 4);
          ctx.fill();
        }
        ctx.restore();
      });

      // Draw Projectiles
      s.projectiles.forEach((proj) => {
        ctx.save();
        ctx.fillStyle = proj.color;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.fill();
        // Inner core
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Companion: Bidu!
      ctx.save();
      const biduX = c.x;
      const biduY = c.y;
      ctx.translate(biduX + 16, biduY + 12);
      if (c.facing === 'left') ctx.scale(-1, 1);

      // Puppy body
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.ellipse(0, 4, 14, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // White chest patch
      ctx.fillStyle = '#FFFBEB';
      ctx.beginPath();
      ctx.ellipse(5, 4, 6, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Puppy Head
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(10, -4, 9, 0, Math.PI * 2);
      ctx.fill();

      // Puppy Ear
      ctx.fillStyle = '#92400E';
      ctx.beginPath();
      ctx.ellipse(4, -8, 4, 7, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Eye & Nose
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(13, -5, 2, 0, Math.PI * 2);
      ctx.arc(17, -3, 2, 0, Math.PI * 2);
      ctx.fill();

      // Red Collar
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(6, 2, 7, 3);

      // Wagging Tail
      const tailAngle = Math.sin(Date.now() / 90) * 0.5;
      ctx.save();
      ctx.translate(-12, 0);
      ctx.rotate(tailAngle);
      ctx.fillStyle = '#D97706';
      ctx.fillRect(-2, -8, 4, 8);
      ctx.restore();

      ctx.restore();

      // Draw Player Character (Nena or Pepê)
      ctx.save();
      if (p.isInvulnerable && Math.floor(Date.now() / 80) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }

      ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
      if (p.facing === 'left') ctx.scale(-1, 1);

      // PowerUp Aura
      if (p.powerUp === 'shield') {
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.powerUp === 'speed') {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.fill();
      }

      const isNena = characterId === 'nena' || (characterId === 'duo' && Math.floor(Date.now() / 8000) % 2 === 0);

      // Legs / Running cycle
      const runCycle = Math.sin(Date.now() / 70) * (Math.abs(p.vx) > 0.5 ? 6 : 0);
      ctx.fillStyle = isNena ? '#1E3A8A' : '#78350F'; // Denim shorts vs brown pants
      ctx.fillRect(-8 + runCycle, 12, 6, 12);
      ctx.fillRect(2 - runCycle, 12, 6, 12);

      // Shoes
      ctx.fillStyle = '#78350F';
      ctx.fillRect(-9 + runCycle, 22, 9, 5);
      ctx.fillRect(1 - runCycle, 22, 9, 5);

      // Jacket / Body
      ctx.fillStyle = isNena ? '#FB7185' : '#3B82F6'; // Pink jacket vs Blue hoodie
      ctx.beginPath();
      ctx.roundRect(-12, -8, 24, 22, 6);
      ctx.fill();

      // Backpack
      ctx.fillStyle = isNena ? '#DC2626' : '#2563EB';
      ctx.fillRect(-16, -5, 5, 14);

      // Head
      ctx.fillStyle = '#FED7AA'; // Skin tone
      ctx.beginPath();
      ctx.arc(0, -16, 12, 0, Math.PI * 2);
      ctx.fill();

      // Face (Eyes & Smile)
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(4, -17, 2.5, 0, Math.PI * 2);
      ctx.arc(9, -17, 2.5, 0, Math.PI * 2);
      ctx.fill();
      // Smile
      ctx.strokeStyle = '#9A3412';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(6, -14, 4, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();

      if (isNena) {
        // Brown Hair & Pigtails
        ctx.fillStyle = '#5C382A';
        ctx.beginPath();
        ctx.arc(0, -19, 13, Math.PI * 0.9, Math.PI * 2.1);
        ctx.fill();

        // Pigtail left & right with ribbons
        ctx.fillStyle = '#5C382A';
        ctx.beginPath();
        ctx.arc(-11, -18, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F43F5E'; // Ribbon
        ctx.fillRect(-13, -19, 4, 4);
      } else {
        // Pepê's Blue Cap
        ctx.fillStyle = '#1D4ED8';
        ctx.beginPath();
        ctx.ellipse(0, -22, 13, 8, 0, Math.PI, Math.PI * 2);
        ctx.fill();
        // Cap Visor
        ctx.fillRect(2, -22, 12, 4);
      }

      ctx.restore();

      // Draw Particles
      s.particles.forEach((pt) => {
        ctx.save();
        ctx.globalAlpha = pt.life / pt.maxLife;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Floating texts
      floatersRef.current.forEach((fl) => {
        ctx.save();
        ctx.globalAlpha = Math.min(1, fl.life / 20);
        ctx.font = 'bold 18px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(15,23,42,0.85)';
        ctx.strokeText(fl.text, fl.x, fl.y);
        ctx.fillStyle = fl.color;
        ctx.fillText(fl.text, fl.x, fl.y);
        ctx.restore();
      });

      ctx.restore(); // End world space
      ctx.restore(); // End shake space

      // Next frame
      animationFrameId = requestAnimationFrame(loop);
    };

    // Fixed 60Hz simulation, independent from monitor refresh rate
    const STEP = 1000 / 60;
    let lastT = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      acc += Math.min(100, now - lastT);
      lastT = now;
      let steps = 0;
      while (acc >= STEP && steps < 5) {
        updatePhysics();
        acc -= STEP;
        steps++;
      }
      render();
    };
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [characterId, isPaused, onGameOver, onStageClear]);

  // Restart handler
  const handleRestart = () => {
    initLevel(stageId, characterId);
    setIsPaused(false);
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-full h-[620px] max-h-[85vh] bg-slate-950 rounded-2xl overflow-hidden shadow-[0_28px_90px_rgba(0,0,0,0.58)] ring-1 ring-white/15 border border-slate-800/80 flex flex-col select-none">
      {/* Top Game HUD Bar matching mockup */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2.5 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
          <div className="text-sm font-bold tracking-tight text-amber-400">
            Fase {stageId}
          </div>
        </div>

        {/* Boss Health Bar if present */}
        {hudState.bossMaxHp > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-red-950/70 border border-red-800 rounded-lg">
            <span className="text-xs font-bold text-red-300">Dragão das Sombras</span>
            <div className="w-28 h-2.5 bg-red-950 rounded-full overflow-hidden border border-red-700">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-200"
                style={{ width: `${(hudState.bossHp / hudState.bossMaxHp) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-red-200 tabular-nums">
              {hudState.bossHp} HP
            </span>
          </div>
        )}

        {/* Meters (Stars, Coins, Lives, Score) */}
        <div className="flex items-center gap-3 md:gap-4 text-xs font-bold">
          {hudState.activePowerUp !== 'none' && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-900/80 text-purple-200 border border-purple-700">
              <Zap className="w-3 h-3 text-purple-300 animate-pulse" />
              <span>{hudState.powerUpTimeLeft}s</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="tabular-nums font-mono">{hudState.stars}</span>
          </div>

          <div className="flex items-center gap-1 text-yellow-400">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="tabular-nums font-mono">{hudState.coins}</span>
          </div>

          <div className="flex items-center gap-1 text-red-400">
            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            <span className="tabular-nums font-mono">{hudState.lives}</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-slate-300">
            <span className="text-slate-400 font-normal">Pontos:</span>
            <span className="tabular-nums font-mono text-emerald-400">{hudState.score}</span>
          </div>

          <button
            onClick={toggleSound}
            aria-label="Som"
            className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label="Pausar"
            className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="relative flex-1 w-full h-full bg-gradient-to-b from-sky-500/10 via-slate-950 to-slate-950 overflow-hidden cursor-crosshair">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-white p-6">
            <h3 className="text-2xl font-black text-amber-400 tracking-wide">JOGO PAUSADO</h3>
            <p className="text-xs text-slate-300 max-w-sm text-center">
              Respire fundo! Use as teclas direcionais para mover e Espaço para pular. Chame o Bidu com a tecla Z para farejar ou afastar ameaças!
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <button
                onClick={() => setIsPaused(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                Continuar
              </button>
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center gap-2 border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
                Reiniciar Fase
              </button>
              <button
                onClick={onExit}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
              >
                Menu Principal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* On-Screen Touch / Mobile Controls matching the screenshot UI */}
      <div className="relative z-20 flex items-center justify-between px-6 py-3 bg-slate-950/90 border-t border-slate-800/80">
        {/* D-Pad Left / Right */}
        <div className="flex items-center gap-2.5">
          <button
            onPointerDown={() => { keysRef.current.left = true; }}
            onPointerUp={() => { keysRef.current.left = false; }}
            onPointerLeave={() => { keysRef.current.left = false; }}
            className="w-13 h-13 rounded-2xl bg-slate-800/90 active:bg-slate-700 border border-slate-700/80 flex items-center justify-center text-slate-200 shadow-lg active:scale-95 transition-transform"
            aria-label="Mover para esquerda"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            onPointerDown={() => { keysRef.current.right = true; }}
            onPointerUp={() => { keysRef.current.right = false; }}
            onPointerLeave={() => { keysRef.current.right = false; }}
            className="w-13 h-13 rounded-2xl bg-slate-800/90 active:bg-slate-700 border border-slate-700/80 flex items-center justify-center text-slate-200 shadow-lg active:scale-95 transition-transform"
            aria-label="Mover para direita"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>

        {/* Keyboard helper hint */}
        <div className="hidden sm:flex flex-col items-center text-[11px] text-slate-400">
          <span>Teclado: <b>← →</b> ou <b>A/D</b> para andar</span>
          <span><b>Espaço / ↑</b> Pular · <b>Z</b> Latido do Bidu</span>
        </div>

        {/* Action Buttons: Bidu Action & Jump */}
        <div className="flex items-center gap-3">
          <button
            onClick={triggerAction}
            className="w-13 h-13 rounded-2xl bg-purple-600/90 active:bg-purple-500 border border-purple-500/80 flex flex-col items-center justify-center text-white shadow-lg shadow-purple-900/40 active:scale-95 transition-transform"
            aria-label="Ação do Bidu"
            title="Ação do Bidu (Z)"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase">Bidu</span>
          </button>
          <button
            onClick={triggerJump}
            className="w-15 h-15 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 border border-emerald-400/80 flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-900/50 active:scale-95 transition-transform"
            aria-label="Pular"
            title="Pular (Espaço)"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
            </svg>
            <span className="text-[10px] font-black uppercase">Pular</span>
          </button>
        </div>
      </div>
    </div>
  );
};
