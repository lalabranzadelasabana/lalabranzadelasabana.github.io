// Cursor Light Trails
const canvas = document.getElementById("cursorTrails")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const particles = []

class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.size = Math.random() * 3 + 1
    this.speedX = Math.random() * 2 - 1
    this.speedY = Math.random() * 2 - 1
    this.life = 100
    // Get current theme color
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
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.life / 100
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 15
    ctx.shadowColor = this.color
  }
}

document.addEventListener("mousemove", (e) => {
  for (let i = 0; i < 3; i++) {
    particles.push(new Particle(e.clientX, e.clientY))
  }
})

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

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

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

// Control Buttons
const menuBtn = document.getElementById("menuBtn")
const musicToggle = document.getElementById("musicToggle")
const soundToggle = document.getElementById("soundToggle")
const infoPopup = document.getElementById("infoPopup")
const closePopup = document.getElementById("closePopup")

let musicEnabled = true
let soundEnabled = true

menuBtn.addEventListener("click", () => {
  infoPopup.classList.remove("hidden")
})

closePopup.addEventListener("click", () => {
  infoPopup.classList.add("hidden")
})

infoPopup.addEventListener("click", (e) => {
  if (e.target === infoPopup) {
    infoPopup.classList.add("hidden")
  }
})

musicToggle.addEventListener("click", () => {
  musicEnabled = !musicEnabled
  musicToggle.classList.toggle("active")

  ambientAudios.forEach((audio) => {
    if (audio) {
      if (musicEnabled) {
        audio.play().catch((err) => console.log("[v0] Audio play error:", err))
      } else {
        audio.pause()
      }
    }
  })

  if (videoAudio) {
    if (musicEnabled) {
      videoAudio.play().catch((err) => console.log("[v0] Audio play error:", err))
    } else {
      videoAudio.pause()
    }
  }
})

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled
  soundToggle.classList.toggle("active")

  if (videoAudio) {
    videoAudio.volume = soundEnabled ? 0.5 : 0
  }
})

// Audio Buttons
const audioButtons = document.querySelectorAll(".audio-btn")

audioButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("playing")
    setTimeout(() => {
      btn.classList.remove("playing")
    }, 3000)
  })
})

// Clickable Image Carousel
const orbImage = document.getElementById("orbImage")
const orbName = document.getElementById("orbName")

const sphereImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-rFGxbbGEF8MNfjPQ27yGufJJ49oQEv.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-9vd99WZvSQwJicf7X3PRF1kfC4HjEB.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-PTSTl1NulzXA3wggRiyqR6g7i6I7hc.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-RoEhFCVYUmKTYXvOc7Vv8RNKjSsVDo.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-W3O6yXelTljE7KSQ4vDjIRXXjHPBIP.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-lArN6ILr2kN8BjdCOoXkqHha1v54Nj.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-n8LpaIJOPHMfkDMB7Q9YJIQNnweC4A.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-gSHNgUbgBC4kUj2svFGyb9PdcNB2BG.png",
]

let currentImageIndex = 0

orbImage.addEventListener("click", () => {
  currentImageIndex = (currentImageIndex + 1) % sphereImages.length
  orbImage.src = sphereImages[currentImageIndex]

  // Show name after first click
  if (currentImageIndex > 0 && orbName.classList.contains("hidden")) {
    orbName.classList.remove("hidden")
    orbName.classList.add("visible")
  }
})

// Earth Info Button
const earthInfoBtn = document.getElementById("earthInfoBtn")
const earthInfo = document.getElementById("earthInfo")
const earthImg = document.querySelector(".earth-img")
const earthImage = document.getElementById("earthImage")

const lastScrollY = 0
const earthContainer = document.querySelector(".earth-container")

window.addEventListener("scroll", () => {
  const earthRect = earthContainer.getBoundingClientRect()
  const earthCenterY = earthRect.top + earthRect.height / 2
  const windowCenterY = window.innerHeight / 2

  // Calculate rotation based on scroll position (0 to 360 degrees)
  const scrollProgress = (window.scrollY % 3000) / 3000 // Completes rotation every 3000px scroll
  const rotationDegree = scrollProgress * 360

  // Apply rotation when image is in viewport
  if (earthRect.top < window.innerHeight && earthRect.bottom > 0) {
    earthImage.style.transform = `rotateZ(${rotationDegree}deg)`
  }
})

earthInfoBtn.addEventListener("click", () => {
  earthInfo.classList.toggle("visible")
  earthImg.classList.toggle("rotated")
})

const rotatingCircles = document.querySelectorAll(".rotating-circle")

rotatingCircles.forEach((circle) => {
  circle.addEventListener("click", () => {
    // Rotate the circle
    let currentRotation = Number.parseInt(circle.dataset.rotation) || 0
    currentRotation += 90
    circle.dataset.rotation = currentRotation
    circle.style.transform = `rotate(${currentRotation}deg)`

    // Change gradient and theme colors based on deity
    const deity = circle.dataset.deity
    if (deity === "sue") {
      // Sué = dark to light (day) with yellow/gold theme
      document.body.className = "gradient-dark-to-light"
      document.body.classList.remove("chia-theme")
    } else if (deity === "chia") {
      // Chía = light to dark (night) with blue theme
      document.body.className = "gradient-light-to-dark chia-theme"
    }
  })
})

// Navigation Progress Bar
const navDots = document.querySelectorAll(".nav-dot")
const sections = document.querySelectorAll(".section")

// Click navigation
navDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const sectionIndex = Number.parseInt(dot.dataset.section)
    sections[sectionIndex].scrollIntoView({ behavior: "smooth" })
  })
})

// Update active dot on scroll
function updateActiveNavDot() {
  const scrollPosition = window.scrollY + window.innerHeight / 2

  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop
    const sectionBottom = sectionTop + section.offsetHeight

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      navDots.forEach((dot) => dot.classList.remove("active"))
      navDots[index].classList.add("active")
    }
  })
}

window.addEventListener("scroll", updateActiveNavDot)
updateActiveNavDot() // Initialize on load

// Scroll Animations
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

const waterCanvas = document.getElementById("waterCanvas")
const waterCtx = waterCanvas.getContext("2d")
waterCanvas.width = window.innerWidth
waterCanvas.height = window.innerHeight

const ripples = []
const flowParticles = []

class Ripple {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.radius = 0
    this.maxRadius = 80 // Reduced from 150
    this.speed = 1.5 // Reduced from 2
    this.opacity = 1
  }

  update() {
    this.radius += this.speed
    this.opacity = 1 - this.radius / this.maxRadius
  }

  draw() {
    waterCtx.beginPath()
    waterCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    waterCtx.strokeStyle = `rgba(100, 200, 255, ${this.opacity * 0.3})` // Reduced opacity from 0.5
    waterCtx.lineWidth = 1.5 // Reduced from 2
    waterCtx.stroke()

    // Inner ripple
    waterCtx.beginPath()
    waterCtx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2)
    waterCtx.strokeStyle = `rgba(150, 220, 255, ${this.opacity * 0.15})` // Reduced opacity from 0.3
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

    // Wrap around
    if (this.y > waterCanvas.height) {
      this.y = 0
      this.x = Math.random() * waterCanvas.width
    }
    if (this.x < 0) this.x = waterCanvas.width
    if (this.x > waterCanvas.width) this.x = 0
  }

  draw() {
    waterCtx.beginPath()
    waterCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    waterCtx.fillStyle = `rgba(150, 220, 255, ${this.opacity})`
    waterCtx.fill()
  }
}

// Initialize flow particles
for (let i = 0; i < 50; i++) {
  flowParticles.push(new FlowParticle())
}

const floodSection = document.getElementById("floodSection")
let isOverFloodSection = false

floodSection.addEventListener("mouseenter", () => {
  isOverFloodSection = true
})

floodSection.addEventListener("mouseleave", () => {
  isOverFloodSection = false
})

let lastRippleTime = 0
document.addEventListener("mousemove", (e) => {
  if (isOverFloodSection) {
    const now = Date.now()
    if (now - lastRippleTime > 100) {
      // Only create ripple every 100ms
      ripples.push(new Ripple(e.clientX, e.clientY))
      lastRippleTime = now
    }
  }
})

function animateWater() {
  waterCtx.clearRect(0, 0, waterCanvas.width, waterCanvas.height)

  const time = Date.now() * 0.0005 // Slower animation
  for (let i = 0; i < 8; i++) {
    const x = (Math.sin(time + i * 0.8) * 0.5 + 0.5) * waterCanvas.width
    const y = (Math.cos(time * 0.5 + i * 0.6) * 0.5 + 0.5) * waterCanvas.height
    const radius = 40 + Math.sin(time * 2 + i * 2) * 15

    waterCtx.beginPath()
    waterCtx.arc(x, y, radius, 0, Math.PI * 2)
    waterCtx.fillStyle = `rgba(100, 200, 255, 0.03)` // More subtle
    waterCtx.fill()
  }

  flowParticles.forEach((particle) => {
    particle.update()
    particle.draw()
  })

  // Draw ripples
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

// Eclipse Toggle Functionality
const eclipseToggle1 = document.getElementById("eclipseToggle1")
const eclipseToggle2 = document.getElementById("eclipseToggle2")
const eclipseText = document.getElementById("eclipseText")

let eclipseVisible = false

function toggleEclipseText() {
  eclipseVisible = !eclipseVisible
  if (eclipseVisible) {
    eclipseText.classList.add("visible")
  } else {
    eclipseText.classList.remove("visible")
  }
}

eclipseToggle1.addEventListener("click", toggleEclipseText)
eclipseToggle2.addEventListener("click", toggleEclipseText)

// Snake Canvas Animation for El Pacto Section
const snakeCanvas = document.getElementById("snakeCanvas")
const snakeCtx = snakeCanvas.getContext("2d")
snakeCanvas.width = window.innerWidth
snakeCanvas.height = window.innerHeight

class Snake {
  constructor(isMirror = false) {
    this.segments = []
    this.maxSegments = 30
    this.isMirror = isMirror

    // Initialize snake in center
    const startX = snakeCanvas.width / 2
    const startY = snakeCanvas.height / 2

    for (let i = 0; i < this.maxSegments; i++) {
      this.segments.push({ x: startX, y: startY })
    }
  }

  update(targetX, targetY) {
    // Add new head position
    if (this.isMirror) {
      // Mirror horizontally
      const mirrorX = snakeCanvas.width - targetX
      this.segments.unshift({ x: mirrorX, y: targetY })
    } else {
      this.segments.unshift({ x: targetX, y: targetY })
    }

    // Remove tail if too long
    if (this.segments.length > this.maxSegments) {
      this.segments.pop()
    }
  }

  draw() {
    // Get current theme color
    const style = getComputedStyle(document.documentElement)
    const accentColor = style.getPropertyValue("--accent-primary").trim() || "#d4af37"

    // Draw snake body
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

    // Draw glow
    snakeCtx.shadowBlur = 20
    snakeCtx.shadowColor = this.isMirror ? "rgba(192, 192, 192, 0.6)" : accentColor
    snakeCtx.stroke()
    snakeCtx.shadowBlur = 0

    // Draw snake head
    const head = this.segments[0]
    snakeCtx.beginPath()
    snakeCtx.arc(head.x, head.y, 10, 0, Math.PI * 2)
    snakeCtx.fillStyle = this.isMirror ? "#c0c0c0" : accentColor
    snakeCtx.fill()

    // Draw eyes
    snakeCtx.fillStyle = "#000"
    snakeCtx.beginPath()
    snakeCtx.arc(head.x - 3, head.y - 3, 2, 0, Math.PI * 2)
    snakeCtx.arc(head.x + 3, head.y - 3, 2, 0, Math.PI * 2)
    snakeCtx.fill()
  }
}

const mainSnake = new Snake(false)
const mirrorSnake = new Snake(true)

let mouseX = snakeCanvas.width / 2
let mouseY = snakeCanvas.height / 2

const pactoSection = document.querySelector(".pacto-section")
let isOverPactoSection = false

pactoSection.addEventListener("mouseenter", () => {
  isOverPactoSection = true
})

pactoSection.addEventListener("mouseleave", () => {
  isOverPactoSection = false
})

document.addEventListener("mousemove", (e) => {
  if (isOverPactoSection) {
    mouseX = e.clientX
    mouseY = e.clientY
  }
})

function animateSnakes() {
  snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height)

  // Update and draw both snakes
  mainSnake.update(mouseX, mouseY)
  mirrorSnake.update(mouseX, mouseY)

  mainSnake.draw()
  mirrorSnake.draw()

  requestAnimationFrame(animateSnakes)
}

animateSnakes()

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  waterCanvas.width = window.innerWidth
  waterCanvas.height = window.innerHeight
  snakeCanvas.width = window.innerWidth
  snakeCanvas.height = window.innerHeight
})

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !infoPopup.classList.contains("hidden")) {
    infoPopup.classList.add("hidden")
  }
})

// Ambient Audio Management
const ambientAudios = [
  document.getElementById("ambientAudio1"),
  document.getElementById("ambientAudio2"),
  document.getElementById("ambientAudio3"),
]

const videoAudio = document.getElementById("videoAudio")

let currentAmbientIndex = 0

// Set all audio elements to loop
ambientAudios.forEach((audio) => {
  if (audio) {
    audio.loop = true
    audio.volume = 0.3
  }
})

if (videoAudio) {
  videoAudio.volume = 0.5
}

function playRandomAmbient() {
  // Stop all ambient sounds
  ambientAudios.forEach((audio) => {
    if (audio) audio.pause()
  })

  // Select random audio
  currentAmbientIndex = Math.floor(Math.random() * ambientAudios.length)
  const selectedAudio = ambientAudios[currentAmbientIndex]

  if (selectedAudio && musicEnabled) {
    selectedAudio.currentTime = 0
    selectedAudio.play().catch((err) => console.log("[v0] Audio play error:", err))
  }
}

// Play first ambient sound on user interaction
document.addEventListener(
  "click",
  () => {
    if (!musicEnabled) return

    const hasPlayed = ambientAudios.some((audio) => audio && audio.played.length > 0)
    if (!hasPlayed && ambientAudios[currentAmbientIndex]) {
      ambientAudios[currentAmbientIndex].play().catch((err) => console.log("[v0] Audio play error:", err))
    }
  },
  { once: true },
)

ambientAudios.forEach((audio) => {
  if (audio) {
    audio.addEventListener("ended", () => {
      if (musicEnabled) {
        // Wait a moment then play random next audio
        setTimeout(playRandomAmbient, 2000)
      }
    })
  }
})
