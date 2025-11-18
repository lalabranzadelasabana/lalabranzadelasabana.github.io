// ============================================================================
// INITIALIZATION & SETUP
// ============================================================================

const canvas = document.getElementById("cursorTrails")
const ctx = canvas ? canvas.getContext("2d") : null

if (canvas && ctx) {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

// ============================================================================
// CURSOR LIGHT TRAILS + FIREWORKS
// ============================================================================

const particles = []

class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.size = Math.random() * 3 + 1
    this.speedX = Math.random() * 2 - 1
    this.speedY = Math.random() * 2 - 1
    this.life = 100

    const style = getComputedStyle(document.documentElement)
    this.color = style.getPropertyValue("--accent-primary").trim() || "#d4af37"
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY
    this.life -= 2
    if (this.size > 0.2) this.size -= 0.05
  }

  draw() {
    if (!ctx) return
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.life / 100
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 15
    ctx.shadowColor = this.color
  }
}

// Fireworks for orbImage
class Firework {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.particles = []
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: 1.5,
        color: `hsl(${Math.random() * 60 + 30}, 100%, 50%)`,
      })
    }
  }

  update(deltaTime) {
    this.particles.forEach((p) => {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.2
      p.life -= deltaTime
    })
  }

  draw(ctx) {
    this.particles.forEach((p) => {
      if (p.life > 0) {
        ctx.globalAlpha = p.life / 1.5
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    })
    ctx.globalAlpha = 1
  }

  isAlive() {
    return this.particles.some((p) => p.life > 0)
  }
}

const fireworks = []

if (canvas && ctx) {
  document.addEventListener("mousemove", (e) => {
    for (let i = 0; i < 3; i++) {
      particles.push(new Particle(e.clientX, e.clientY))
    }
  })

  function animateParticles() {
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const fw = fireworks[i]
      fw.update(0.016) // ~60fps
      fw.draw(ctx)
      if (!fw.isAlive()) {
        fireworks.splice(i, 1)
      }
    }

    // Cursor particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update()
      particles[i].draw()

      if (particles[i].life <= 0) {
        particles.splice(i, 1)
        i--
      }
    }

    requestAnimationFrame(animateParticles)
  }

  animateParticles()
}

// ============================================================================
// CONTROL BUTTONS
// ============================================================================

const menuBtn = document.getElementById("menuBtn")
const musicToggle = document.getElementById("musicToggle")
const soundToggle = document.getElementById("soundToggle")
const infoPopup = document.getElementById("infoPopup")
const closePopup = document.getElementById("closePopup")

let musicEnabled = true
let soundEnabled = true

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    infoPopup?.classList.remove("hidden")
  })
}

if (closePopup) {
  closePopup.addEventListener("click", () => {
    infoPopup?.classList.add("hidden")
  })
}

if (infoPopup) {
  infoPopup.addEventListener("click", (e) => {
    if (e.target === infoPopup) {
      infoPopup.classList.add("hidden")
    }
  })
}

// ============================================================================
// AMBIENT AUDIO MANAGEMENT
// ============================================================================

const ambientAudios = [
  document.getElementById("ambientAudio1"),
  document.getElementById("ambientAudio2"),
  document.getElementById("ambientAudio3"),
].filter(Boolean)

const videoAudio = document.getElementById("videoAudio")

let currentAmbientIndex = 0

ambientAudios.forEach((audio) => {
  audio.loop = true
  audio.volume = 0.3
})

if (videoAudio) {
  videoAudio.volume = 0.5
}

function playRandomAmbient() {
  ambientAudios.forEach((audio) => audio.pause())

  if (!ambientAudios.length) return

  currentAmbientIndex = Math.floor(Math.random() * ambientAudios.length)
  const selectedAudio = ambientAudios[currentAmbientIndex]

  if (selectedAudio && musicEnabled) {
    selectedAudio.currentTime = 0
    selectedAudio.play().catch((err) => console.log("[v0] Audio error:", err))
  }
}

if (musicToggle) {
  musicToggle.addEventListener("click", () => {
    musicEnabled = !musicEnabled
    musicToggle.classList.toggle("active")

    ambientAudios.forEach((audio) => {
      if (musicEnabled) {
        audio.play().catch((err) => console.log("[v0] Audio error:", err))
      } else {
        audio.pause()
      }
    })

    if (videoAudio) {
      if (musicEnabled) {
        videoAudio.play().catch((err) => console.log("[v0] Audio error:", err))
      } else {
        videoAudio.pause()
      }
    }
  })
}

if (soundToggle) {
  soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled
    soundToggle.classList.toggle("active")

    if (videoAudio) {
      videoAudio.volume = soundEnabled ? 0.5 : 0
    }
  })
}

document.addEventListener(
  "click",
  () => {
    if (!musicEnabled || !ambientAudios.length) return
    const hasPlayed = ambientAudios.some((audio) => audio.played.length > 0)
    if (!hasPlayed && ambientAudios[currentAmbientIndex]) {
      ambientAudios[currentAmbientIndex]
        .play()
        .catch((err) => console.log("[v0] Audio error:", err))
    }
  },
  { once: true },
)

ambientAudios.forEach((audio) => {
  audio.addEventListener("ended", () => {
    if (musicEnabled) {
      setTimeout(playRandomAmbient, 2000)
    }
  })
})

// ============================================================================
// AUDIO BUTTONS
// ============================================================================

const audioButtons = document.querySelectorAll(".audio-btn")
audioButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("playing")
    setTimeout(() => {
      btn.classList.remove("playing")
    }, 3000)
  })
})

// ============================================================================
// IMAGE CAROUSEL (ORB) + FIREWORKS TRIGGER
// ============================================================================

const orbImage = document.getElementById("orbImage")

const sphereImages = [
  "./public/images/1.png",
  "./public/images/2.png",
  "./public/images/3.png",
  "./public/images/4.png",
  "./public/images/5.png",
  "./public/images/6.png",
  "./public/images/7.png",
  "./public/images/8.png",
]

let currentImageIndex = 0

if (orbImage) {
  orbImage.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % sphereImages.length
    orbImage.src = sphereImages[currentImageIndex]

    if (currentImageIndex === sphereImages.length - 1 && ctx && canvas) {
      const rect = orbImage.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      
      // Create larger white flash effect
      for (let i = 0; i < 8; i++) {
        const flashFirework = new Firework(x, y)
        flashFirework.particles.forEach(p => {
          p.color = `hsl(0, 0%, ${Math.random() * 30 + 70}%)`
        })
        fireworks.push(flashFirework)
      }

      // Add white background flash
      const flashOverlay = document.createElement('div')
      flashOverlay.style.position = 'fixed'
      flashOverlay.style.top = '0'
      flashOverlay.style.left = '0'
      flashOverlay.style.width = '100%'
      flashOverlay.style.height = '100%'
      flashOverlay.style.background = 'rgba(255, 255, 255, 0.8)'
      flashOverlay.style.zIndex = '10000'
      flashOverlay.style.pointerEvents = 'none'
      document.body.appendChild(flashOverlay)

      setTimeout(() => {
        flashOverlay.style.transition = 'opacity 1.5s ease-out'
        flashOverlay.style.opacity = '0'
        setTimeout(() => flashOverlay.remove(), 1500)
      }, 50)
    }
  })
}

// ============================================================================
// ROTATING CIRCLES (SUÉ & CHÍA THEMES)
// ============================================================================

const rotatingCircles = document.querySelectorAll(".rotating-circle")

rotatingCircles.forEach((circle) => {
  circle.addEventListener("click", () => {

    const deity = circle.dataset.deity
    if (deity === "sue") {
      document.body.className = "gradient-dark-to-light"
      document.body.classList.remove("chia-theme")
    } else if (deity === "chia") {
      document.body.className = "gradient-light-to-dark chia-theme"
    }
  })
})

// ============================================================================
// EARTH ROTATION & INFO (tierra.png)
// ============================================================================

const earthImage = document.getElementById("earthImage")
const earthContainer = document.querySelector(".earth-container")
const earthInfoBtn = document.getElementById("earthInfoBtn")
const earthInfo = document.getElementById("earthInfo")

// Rotación basada en scroll: gira 360° cada 3000px de scroll
window.addEventListener("scroll", () => {
  if (!earthContainer || !earthImage) return

  const earthRect = earthContainer.getBoundingClientRect()

  if (earthRect.top < window.innerHeight && earthRect.bottom > 0) {
    const scrollProgress = (window.scrollY % 3000) / 3000
    const rotationDegree = scrollProgress * 360
    earthImage.style.transform = `rotateZ(${rotationDegree}deg)`
  }
})

if (earthInfoBtn) {
  earthInfoBtn.addEventListener("click", () => {
    earthInfo?.classList.toggle("visible")
  })
}

// ============================================================================
// INFO BUTTONS (BIRDS, BACHUÉ, BOCHICA)
// ============================================================================

const birdsInfoBtn = document.getElementById("birdsInfoBtn")
const birdsInfo = document.getElementById("birdsInfo")

if (birdsInfoBtn && birdsInfo) {
  birdsInfoBtn.addEventListener("click", () => {
    birdsInfo.classList.toggle("visible")
  })
}

const bachueInfoBtn = document.getElementById("bachueInfoBtn")
const bachueInfo = document.getElementById("bachueInfo")

if (bachueInfoBtn && bachueInfo) {
  bachueInfoBtn.addEventListener("click", () => {
    bachueInfo.classList.toggle("visible")
  })
}

const bochicaInfoBtn = document.getElementById("bochicaInfoBtn")
const bochicaInfo = document.getElementById("bochicaInfo")

if (bochicaInfoBtn && bochicaInfo) {
  bochicaInfoBtn.addEventListener("click", () => {
    bochicaInfo.classList.toggle("visible")
  })
}

// ============================================================================
// ECLIPSE TOGGLE
// ============================================================================

const eclipseToggle1 = document.getElementById("eclipseToggle1")
const eclipseToggle2 = document.getElementById("eclipseText")
const eclipseText = document.getElementById("eclipseText")

let eclipseVisible = false

function toggleEclipseText() {
  eclipseVisible = !eclipseVisible
  if (eclipseText) {
    if (eclipseVisible) {
      eclipseText.classList.add("visible")
    } else {
      eclipseText.classList.remove("visible")
    }
  }
}

if (eclipseToggle1) eclipseToggle1.addEventListener("click", toggleEclipseText)
if (eclipseToggle2) eclipseToggle2.addEventListener("click", toggleEclipseText)

// ============================================================================
// NAVIGATION PROGRESS BAR
// ============================================================================

const navDots = document.querySelectorAll(".nav-dot")
const sections = document.querySelectorAll(".section")

navDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const sectionIndex = Number.parseInt(dot.dataset.section)
    sections[sectionIndex]?.scrollIntoView({ behavior: "smooth" })
  })
})

function updateActiveNavDot() {
  const scrollPosition = window.scrollY + window.innerHeight / 2

  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop
    const sectionBottom = sectionTop + section.offsetHeight

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      navDots.forEach((dot) => dot.classList.remove("active"))
      navDots[index]?.classList.add("active")
    }
  })
}

window.addEventListener("scroll", updateActiveNavDot)
updateActiveNavDot()

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")
    }
  })
}, observerOptions)

const fadeElements = document.querySelectorAll(".fade-in-scroll")
fadeElements.forEach((el) => observer.observe(el))

// ============================================================================
// WATER EFFECT (FLOOD SECTION)
// ============================================================================

const waterCanvas = document.getElementById("waterCanvas")
const waterCtx = waterCanvas ? waterCanvas.getContext("2d") : null

if (waterCanvas && waterCtx) {
  waterCanvas.width = window.innerWidth
  waterCanvas.height = window.innerHeight
}

const ripples = []
const flowParticles = []

class Ripple {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.radius = 0
    this.maxRadius = 80
    this.speed = 1.5
    this.opacity = 1
  }

  update() {
    this.radius += this.speed
    this.opacity = 1 - this.radius / this.maxRadius
  }

  draw() {
    if (!waterCtx) return

    waterCtx.beginPath()
    waterCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    waterCtx.strokeStyle = `rgba(2, 88, 164, ${this.opacity * 0.3})`
    waterCtx.lineWidth = 1.5
    waterCtx.stroke()

    waterCtx.beginPath()
    waterCtx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2)
    waterCtx.strokeStyle = `rgba(4, 70, 145, ${this.opacity * 0.15})`
    waterCtx.lineWidth = 1
    waterCtx.stroke()
  }
}

class FlowParticle {
  constructor() {
    this.x = Math.random() * waterCanvas.width
    this.y = Math.random() * waterCanvas.height
    this.size = Math.random() * 2 + 1
    this.speedX = (Math.random() - 0.5) * 0.5
    this.speedY = Math.random() * 0.3 + 0.2
    this.opacity = Math.random() * 0.3 + 0.1
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY

    if (this.y > waterCanvas.height) {
      this.y = 0
      this.x = Math.random() * waterCanvas.width
    }
    if (this.x < 0) this.x = waterCanvas.width
    if (this.x > waterCanvas.width) this.x = 0
  }

  draw() {
    if (!waterCtx) return
    waterCtx.beginPath()
    waterCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    waterCtx.fillStyle = `rgba(150, 220, 255, ${this.opacity})`
    waterCtx.fill()
  }
}

if (waterCanvas && waterCtx) {
  for (let i = 0; i < 50; i++) {
    flowParticles.push(new FlowParticle())
  }

  const floodSection = document.getElementById("floodSection")
  let isOverFloodSection = false

  if (floodSection) {
    floodSection.addEventListener("mouseenter", () => {
      isOverFloodSection = true
    })

    floodSection.addEventListener("mouseleave", () => {
      isOverFloodSection = false
    })
  }

  let lastRippleTime = 0
  document.addEventListener("mousemove", (e) => {
    if (isOverFloodSection) {
      const now = Date.now()
      if (now - lastRippleTime > 100) {
        ripples.push(new Ripple(e.clientX, e.clientY))
        lastRippleTime = now
      }
    }
  })

  function animateWater() {
    waterCtx.clearRect(0, 0, waterCanvas.width, waterCanvas.height)

    const time = Date.now() * 0.0005
    for (let i = 0; i < 8; i++) {
      const x = (Math.sin(time + i * 0.8) * 0.5 + 0.5) * waterCanvas.width
      const y = (Math.cos(time * 0.5 + i * 0.6) * 0.5 + 0.5) * waterCanvas.height
      const radius = 40 + Math.sin(time * 2 + i * 2) * 15

      waterCtx.beginPath()
      waterCtx.arc(x, y, radius, 0, Math.PI * 2)
      waterCtx.fillStyle = `rgba(100, 200, 255, 0.03)`
      waterCtx.fill()
    }

    flowParticles.forEach((particle) => {
      particle.update()
      particle.draw()
    })

    for (let i = 0; i < ripples.length; i++) {
      ripples[i].update()
      ripples[i].draw()
      if (ripples[i].radius >= ripples[i].maxRadius) {
        ripples.splice(i, 1)
        i--
      }
    }

    requestAnimationFrame(animateWater)
  }

  animateWater()
}

// ============================================================================
// SNAKE CANVAS (EL PACTO)
// ============================================================================

const snakeCanvas = document.getElementById("snakeCanvas")
const snakeCtx = snakeCanvas ? snakeCanvas.getContext("2d") : null

if (snakeCanvas && snakeCtx) {
  snakeCanvas.width = window.innerWidth
  snakeCanvas.height = window.innerHeight
}

class Snake {
  constructor(isMirror = false) {
    this.segments = []
    this.maxSegments = 30
    this.isMirror = isMirror

    const startX = snakeCanvas.width / 2
    const startY = snakeCanvas.height / 2

    for (let i = 0; i < this.maxSegments; i++) {
      this.segments.push({ x: startX, y: startY })
    }
  }

  update(targetX, targetY) {
    if (this.isMirror) {
      const mirrorX = snakeCanvas.width - targetX
      this.segments.unshift({ x: mirrorX, y: targetY })
    } else {
      this.segments.unshift({ x: targetX, y: targetY })
    }

    if (this.segments.length > this.maxSegments) {
      this.segments.pop()
    }
  }

  draw() {
    if (!snakeCtx) return

    const style = getComputedStyle(document.documentElement)
    const accentColor = style.getPropertyValue("--accent-primary").trim() || "#d4af37"

    snakeCtx.beginPath()
    snakeCtx.moveTo(this.segments[0].x, this.segments[0].y)

    for (let i = 1; i < this.segments.length; i++) {
      snakeCtx.lineTo(this.segments[i].x, this.segments[i].y)
    }

    snakeCtx.strokeStyle = this.isMirror ? `rgba(192, 192, 192, 0.8)` : accentColor
    snakeCtx.lineWidth = 8
    snakeCtx.lineCap = "round"
    snakeCtx.lineJoin = "round"
    snakeCtx.stroke()

    snakeCtx.shadowBlur = 20
    snakeCtx.shadowColor = this.isMirror ? "rgba(192, 192, 192, 0.6)" : accentColor
    snakeCtx.stroke()
    snakeCtx.shadowBlur = 0

    const head = this.segments[0]
    snakeCtx.beginPath()
    snakeCtx.arc(head.x, head.y, 10, 0, Math.PI * 2)
    snakeCtx.fillStyle = this.isMirror ? "#c0c0c0" : accentColor
    snakeCtx.fill()

    snakeCtx.fillStyle = "#000"
    snakeCtx.beginPath()
    snakeCtx.arc(head.x - 3, head.y - 3, 2, 0, Math.PI * 2)
    snakeCtx.arc(head.x + 3, head.y - 3, 2, 0, Math.PI * 2)
    snakeCtx.fill()
  }
}

if (snakeCanvas && snakeCtx) {
  const mainSnake = new Snake(false)
  const mirrorSnake = new Snake(true)

  let mouseX = snakeCanvas.width / 2
  let mouseY = snakeCanvas.height / 2

  const pactoSection = document.querySelector(".pacto-section")
  let isOverPactoSection = false

  if (pactoSection) {
    pactoSection.addEventListener("mouseenter", () => {
      isOverPactoSection = true
    })

    pactoSection.addEventListener("mouseleave", () => {
      isOverPactoSection = false
    })
  }

  document.addEventListener("mousemove", (e) => {
    if (isOverPactoSection) {
      mouseX = e.clientX
      mouseY = e.clientY
    }
  })

  function animateSnakes() {
    snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height)

    mainSnake.update(mouseX, mouseY)
    mirrorSnake.update(mouseX, mouseY)

    mainSnake.draw()
    mirrorSnake.draw()

    requestAnimationFrame(animateSnakes)
  }

  animateSnakes()
}

// ============================================================================
// WINDOW RESIZE HANDLER
// ============================================================================

window.addEventListener("resize", () => {
  if (canvas && ctx) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  if (waterCanvas && waterCtx) {
    waterCanvas.width = window.innerWidth
    waterCanvas.height = window.innerHeight
  }
  if (snakeCanvas && snakeCtx) {
    snakeCanvas.width = window.innerWidth
    snakeCanvas.height = window.innerHeight
  }
})

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && infoPopup && !infoPopup.classList.contains("hidden")) {
    infoPopup.classList.add("hidden")
  }
})
