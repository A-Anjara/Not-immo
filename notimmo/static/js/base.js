// Global state
let currentPropertyData = null
let galleryImages = []
let currentImageIndex = 0

// Toggle mobile menu
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu")
  const menuBtn = document.querySelector(".mobile-menu-btn")
  const header = document.querySelector(".header")
  if (!mobileMenu || !menuBtn || !header) return

  // Met à jour la hauteur du header pour positionner le panneau
  const h = header.offsetHeight || 64
  document.documentElement.style.setProperty("--header-height", h + "px")

  const willShow = !mobileMenu.classList.contains("show")
  mobileMenu.classList.toggle("show", willShow)
  menuBtn.classList.toggle("active", willShow)
  menuBtn.setAttribute("aria-expanded", String(willShow))
  document.body.classList.toggle("nav-open", willShow)
}

// Close mobile menu
function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu")
  const menuBtn = document.querySelector(".mobile-menu-btn")
  if (!mobileMenu || !menuBtn) return
  mobileMenu.classList.remove("show")
  menuBtn.classList.remove("active")
  menuBtn.setAttribute("aria-expanded", "false")
  document.body.classList.remove("nav-open")
}

// Toggle advanced filters
function toggleAdvancedFilters() {
  const advancedFilters = document.getElementById("advancedFilters")
  advancedFilters.classList.toggle("show")
}

// Open property modal with rich design
function openPropertyDetails(propertyId) {
  const propertyCard = document.querySelector(`[data-id="${propertyId}"]`)
  if (!propertyCard) return

  currentPropertyData = {
    id: propertyCard.dataset.id,
    title: propertyCard.dataset.title || "",
    location: propertyCard.dataset.location || "",
    price: Number.parseInt(propertyCard.dataset.price || "0", 10),
    bedrooms: propertyCard.dataset.bedrooms || "",
    bathrooms: propertyCard.dataset.bathrooms || "",
    area: propertyCard.dataset.area || "",
    type: propertyCard.dataset.type || "",
    amenities: (propertyCard.dataset.amenities || "")
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean),
    description: propertyCard.dataset.description || "",
    owner: propertyCard.dataset.owner || "",
    ownerPhone: propertyCard.dataset.ownerPhone || "",
    ownerEmail: propertyCard.dataset.ownerEmail || "",
    // fallback depuis l'image de la carte si data-images n'est pas fourni
    fallbackImage: propertyCard.querySelector("img")?.src || "/placeholder.svg?height=600&width=960",
  }

  const imagesData = propertyCard.dataset.images
  if (imagesData && imagesData.includes("http")) {
    galleryImages = imagesData
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
  } else {
    galleryImages = [currentPropertyData.fallbackImage]
  }
  currentImageIndex = 0

  // Marque le modal "single" si une seule image (pour cacher flèches/vignettes)
  const modalContent = document.getElementById("propertyModal").querySelector(".modal-content")
  if (galleryImages.length < 2) {
    modalContent.classList.add("single")
  } else {
    modalContent.classList.remove("single")
  }

  populateModal(currentPropertyData)
  renderThumbnails()
  showImage(0)
  syncFavoriteState()
  setupGallerySwipe()

  const modal = document.getElementById("propertyModal")
  modal.classList.add("show")
  modal.setAttribute("aria-hidden", "false")
  document.body.style.overflow = "hidden"

  setTimeout(() => {
    document.querySelector(".modal-close")?.focus()
  }, 10)
}

// Close modal
function closePropertyDetails() {
  const modal = document.getElementById("propertyModal")
  modal.classList.remove("show")
  modal.setAttribute("aria-hidden", "true")
  document.body.style.overflow = "auto"
  currentPropertyData = null
  galleryImages = []
  currentImageIndex = 0
}

// Populate modal static fields
function populateModal(data) {
  const modalImage = document.getElementById("modalImage")
  const modalBadge = document.getElementById("modalBadge")
  const modalTitle = document.getElementById("modalTitle")
  const modalPrice = document.getElementById("modalPrice")
  const modalPriceChip = document.getElementById("modalPriceChip")
  const modalTypeChip = document.getElementById("modalTypeChip")
  const modalLocationSpan = document.querySelector("#modalLocation span")
  const modalBedrooms = document.querySelector(".modal-details .bedrooms")
  const modalBathrooms = document.querySelector(".modal-details .bathrooms")
  const modalArea = document.querySelector(".modal-details .area")
  const modalDesc = document.getElementById("modalDescriptionText")
  const modalOwnerName = document.getElementById("modalOwnerName")
  const modalOwnerPhone = document.getElementById("modalOwnerPhone")
  const modalOwnerEmail = document.getElementById("modalOwnerEmail")

  modalImage.src = galleryImages[0] || "/placeholder.svg?height=600&width=960"
  modalImage.alt = data.title
  modalBadge.textContent = data.type || "Bien"
  modalTitle.textContent = data.title
  modalPrice.textContent = formatPrice(data.price)
  modalPriceChip.textContent = formatPrice(data.price)
  modalTypeChip.textContent = data.type || "Bien"
  modalLocationSpan.textContent = data.location

  modalBedrooms.textContent = `${data.bedrooms} chambres`
  modalBathrooms.textContent = `${data.bathrooms} salles de bain`
  modalArea.textContent = `${data.area} m²`

  modalDesc.textContent = data.description
  modalOwnerName.textContent = data.owner
  modalOwnerPhone.textContent = data.ownerPhone
  modalOwnerEmail.textContent = data.ownerEmail

  renderAmenities(data.amenities)

  document.getElementById("contactOwnerBtn").onclick = contactOwner
  document.getElementById("ownerEmailBtn").onclick = contactOwner
  document.getElementById("ownerCallBtn").onclick = callOwner

  document.getElementById("galleryPrev").onclick = () => showImage(currentImageIndex - 1)
  document.getElementById("galleryNext").onclick = () => showImage(currentImageIndex + 1)

  document.getElementById("favoriteToggleBtn").onclick = toggleFavorite
}

// Thumbnails render
function renderThumbnails() {
  const thumbs = document.getElementById("modalThumbs")
  thumbs.innerHTML = ""
  galleryImages.forEach((src, idx) => {
    const btn = document.createElement("button")
    btn.className = "gallery-thumb" + (idx === currentImageIndex ? " active" : "")
    btn.setAttribute("aria-label", `Voir l'image ${idx + 1}`)
    btn.innerHTML = `<img src="${src}" alt="Vignette ${idx + 1}" />`
    btn.onclick = () => showImage(idx)
    thumbs.appendChild(btn)
  })
  updateCounter()
}

// Show image by index
function showImage(nextIndex) {
  if (!galleryImages.length) return
  if (nextIndex < 0) nextIndex = galleryImages.length - 1
  if (nextIndex >= galleryImages.length) nextIndex = 0
  currentImageIndex = nextIndex

  const img = document.getElementById("modalImage")
  img.style.opacity = "0"
  setTimeout(() => {
    img.src = galleryImages[currentImageIndex]
    img.onload = () => {
      img.style.opacity = "1"
    }
    updateThumbActive()
    updateCounter()
  }, 120)
}

function updateThumbActive() {
  const thumbs = document.querySelectorAll(".gallery-thumb")
  thumbs.forEach((t, i) => t.classList.toggle("active", i === currentImageIndex))
}

function updateCounter() {
  const counter = document.getElementById("modalImageCounter")
  counter.textContent = `${galleryImages.length ? currentImageIndex + 1 : 0} / ${galleryImages.length || 0}`
}

// Price formatter
function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Amenities renderer
function renderAmenities(list) {
  const wrap = document.getElementById("modalAmenities")
  wrap.innerHTML = ""
  const items = (list && list.length ? list : []).slice(0, 12)
  if (!items.length) {
    wrap.innerHTML = '<span class="amenity-pill">Aucun atout renseigné</span>'
    return
  }
  items.forEach((a) => {
    const span = document.createElement("span")
    span.className = "amenity-pill"
    span.textContent = a
    wrap.appendChild(span)
  })
}

// Contact actions
function contactOwner() {
  if (!currentPropertyData) return
  const subject = `Demande de visite - ${currentPropertyData.title}`
  const message = `Bonjour ${currentPropertyData.owner},

Je suis intéressé(e) par votre propriété "${currentPropertyData.title}" située à ${currentPropertyData.location}.

Pourrions-nous organiser une visite ? 

Cordialement`
  const mailto = `mailto:${currentPropertyData.ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
  window.location.href = mailto
}

function callOwner() {
  if (!currentPropertyData) return
  const tel = `tel:${(currentPropertyData.ownerPhone || "").replace(/\s+/g, "")}`
  window.location.href = tel
}

// Favorites
function toggleFavorite() {
  const btn = document.getElementById("favoriteToggleBtn")
  btn.classList.toggle("favorited")
  const svg = btn.querySelector("svg")
  if (btn.classList.contains("favorited")) {
    svg.setAttribute("fill", "currentColor")
  } else {
    svg.setAttribute("fill", "none")
  }
  if (currentPropertyData) {
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    const id = currentPropertyData.id
    if (btn.classList.contains("favorited")) {
      if (!favorites.includes(id)) favorites.push(id)
    } else {
      favorites = favorites.filter((x) => x !== id)
    }
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }
}

function syncFavoriteState() {
  const btn = document.getElementById("favoriteToggleBtn")
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
  const isFav = currentPropertyData && favorites.includes(currentPropertyData.id)
  btn.classList.toggle("favorited", !!isFav)
  const svg = btn.querySelector("svg")
  if (isFav) svg.setAttribute("fill", "currentColor")
  else svg.setAttribute("fill", "none")
}

/* Page interactions */
document.addEventListener("click", (event) => {
  const mobileMenu = document.getElementById("mobileMenu")
  const menuBtn = document.querySelector(".mobile-menu-btn")
  if (!mobileMenu || !menuBtn) return
  const isOpen = mobileMenu.classList.contains("show")
  if (!isOpen) return
  const target = event.target
  if (menuBtn.contains(target) || mobileMenu.contains(target)) {
    // Clic à l’intérieur du bouton ou du panneau: ne rien faire
    return
  }
  closeMobileMenu()
})

window.addEventListener("resize", () => {
  const mobileMenu = document.getElementById("mobileMenu")
  const menuBtn = document.querySelector(".mobile-menu-btn")
  const header = document.querySelector(".header")
  if (header) {
    const h = header.offsetHeight || 64
    document.documentElement.style.setProperty("--header-height", h + "px")
  }
  if (window.innerWidth > 1024) {
    closeMobileMenu()
  }
})

// Keyboard shortcuts (Esc to close, arrows for gallery)
document.addEventListener("keydown", (event) => {
  const isOpen = document.getElementById("propertyModal")?.classList.contains("show")
  if (!isOpen) return
  if (event.key === "Escape") closePropertyDetails()
  if (event.key === "ArrowRight") showImage(currentImageIndex + 1)
  if (event.key === "ArrowLeft") showImage(currentImageIndex - 1)
})

let touchStartX = 0
let touchEndX = 0
function setupGallerySwipe() {
  const main = document.querySelector(".gallery-main")
  if (!main || main.dataset.swipeBound === "true") return
  main.dataset.swipeBound = "true"

  main.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].clientX
    },
    { passive: true },
  )

  main.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].clientX
      const dx = touchEndX - touchStartX
      if (Math.abs(dx) > 50) {
        if (dx < 0) showImage(currentImageIndex + 1)
        else showImage(currentImageIndex - 1)
      }
    },
    { passive: true },
  )
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header")
  if (header) {
    const h = header.offsetHeight || 64
    document.documentElement.style.setProperty("--header-height", h + "px")
  }

  // Reveal-on-scroll for property cards
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" },
  )

  const cards = document.querySelectorAll(".property-card")
  cards.forEach((c, i) => {
    c.style.opacity = "0"
    c.style.transform = "translateY(28px)"
    c.style.transition = `opacity .6s ease ${i * 0.06}s, transform .6s ease ${i * 0.06}s`
    observer.observe(c)
  })

  // // Search
  // const searchInput = document.querySelector(".search-input")
  // if (searchInput) {
  //   searchInput.addEventListener("input", function () {
  //     const term = this.value.toLowerCase()
  //     const cards = document.querySelectorAll(".property-card")
  //     cards.forEach((card) => {
  //       const title = (card.dataset.title || "").toLowerCase()
  //       const location = (card.dataset.location || "").toLowerCase()
  //       const show = title.includes(term) || location.includes(term) || term === ""
  //       card.style.display = show ? "block" : "none"
  //     })
  //     updateResultsCount()
  //   })
  // }

  // // Sort
  // const sortSelect = document.querySelector(".sort-select")
  // if (sortSelect) {
  //   sortSelect.addEventListener("change", function () {
  //     const sortValue = this.value
  //     const grid = document.querySelector(".properties-grid")
  //     const cards = Array.from(document.querySelectorAll(".property-card"))
  //     cards.sort((a, b) => {
  //       const priceA = Number.parseInt(a.dataset.price || "0", 10)
  //       const priceB = Number.parseInt(b.dataset.price || "0", 10)
  //       const areaA = Number.parseInt(a.dataset.area || "0", 10)
  //       const areaB = Number.parseInt(b.dataset.area || "0", 10)
  //       switch (sortValue) {
  //         case "price-asc":
  //           return priceA - priceB
  //         case "price-desc":
  //           return priceB - priceA
  //         case "surface-desc":
  //           return areaB - areaA
  //         default:
  //           return priceB - priceA
  //       }
  //     })
  //     cards.forEach((c) => grid.appendChild(c))
  //   })
  // }

  // // Pagination demo buttons
  // const paginationBtns = document.querySelectorAll(".pagination-btn:not(.pagination-prev):not(.pagination-next)")
  // paginationBtns.forEach((btn) => {
  //   btn.addEventListener("click", function () {
  //     paginationBtns.forEach((b) => b.classList.remove("pagination-active"))
  //     this.classList.add("pagination-active")
  //     document.querySelector(".results-header")?.scrollIntoView({ behavior: "smooth" })
  //   })
  // })

  // Extra style for ripple/animations (optional)
  const style = document.createElement("style")
  style.textContent = `
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`
  document.head.appendChild(style)

  document.querySelectorAll("#mobileMenu a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu()
    })
  })

  console.log("NOT'IMMO modal prêt avec design premium ✨")
})
