// Search and filter functionality
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput")
  const filterButtons = document.querySelectorAll(".filter-btn")
  const partnerCards = document.querySelectorAll(".partner-card")

  let currentFilter = "all"

  // Search functionality
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase()
    filterPartners(searchTerm, currentFilter)
  })

  // Filter functionality
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      // Add active class to clicked button
      this.classList.add("active")

      currentFilter = this.getAttribute("data-filter")
      const searchTerm = searchInput.value.toLowerCase()
      filterPartners(searchTerm, currentFilter)
    })
  })

  function filterPartners(searchTerm, filter) {
    partnerCards.forEach((card) => { 
      const name = card.getAttribute("data-name").toLowerCase()
      const city = card.getAttribute("data-city").toLowerCase()
      const type = card.getAttribute("data-type")

      // Check if card matches search term
      const matchesSearch = name.includes(searchTerm) || city.includes(searchTerm)

      // Check if card matches filter
      const matchesFilter = filter === "all" || type === filter

      // Show/hide card based on both conditions
      if (matchesSearch && matchesFilter) {
        card.classList.remove("hidden")
      } else {
        card.classList.add("hidden")
      }
    })
  }
})

// Modal handling for partner cards
document.addEventListener("DOMContentLoaded", () => {
  const modalOverlay = document.getElementById("partnerModal")
  const modalTitle = document.getElementById("modalTitle")
  const modalRole = document.getElementById("modalRole")
  const modalEmail = document.getElementById("modalEmail")
  const modalPhone = document.getElementById("modalPhone")
  const modalLocation = document.getElementById("modalLocation")
  const modalAvatar = document.getElementById("modalAvatar")
  const modalClose = document.getElementById("modalClose")
  const modalEmailBtn = document.getElementById("modalEmailBtn")
  const modalCallBtn = document.getElementById("modalCallBtn")
  const partnerCards = document.querySelectorAll(".partner-card")

  function openModal(data) {
    modalTitle.textContent = data.name || "--"
    modalRole.textContent = data.role || "--"

    // Email link
    if (data.email) {
      modalEmail.textContent = data.email
      modalEmail.href = `mailto:${data.email}`
      if (modalEmailBtn) modalEmailBtn.href = `mailto:${data.email}`
    } else {
      modalEmail.textContent = "--"
      modalEmail.removeAttribute('href')
      if (modalEmailBtn) modalEmailBtn.href = '#'
    }

    // Phone link
    if (data.phone) {
      modalPhone.textContent = data.phone
      modalPhone.href = `tel:${data.phone.replace(/\s+/g, '')}`
      if (modalCallBtn) modalCallBtn.href = `tel:${data.phone.replace(/\s+/g, '')}`
    } else {
      modalPhone.textContent = "--"
      modalPhone.removeAttribute('href')
      if (modalCallBtn) modalCallBtn.href = '#'
    }

    modalLocation.textContent = data.city || "--"

    // Avatar: show initials
    if (modalAvatar) {
      const initials = (data.initials || (data.name || '').split(' ').map(n=>n[0]).filter(Boolean).slice(0,2).join('')).toUpperCase()
      modalAvatar.textContent = initials || '--'
    }

    modalOverlay.classList.add("active")
  }

  function closeModal() {
    modalOverlay.classList.remove("active")
  }

  partnerCards.forEach((card) => {
    // populate avatar initials in card
    const nameForAvatar = card.getAttribute('data-name') || ''
    const avatarEl = card.querySelector('.avatar')
    if (avatarEl) {
      const initials = nameForAvatar.split(' ').map(n=>n[0]).filter(Boolean).slice(0,2).join('').toUpperCase()
      avatarEl.textContent = initials
    }

    card.addEventListener("click", (e) => {
      // Avoid triggering when clicking action buttons inside card
  if (e.target.closest("button")) return

      const data = {
        name: card.getAttribute("data-name"),
        email: card.getAttribute("data-email"),
        phone: card.getAttribute("data-phone"),
        city: card.getAttribute("data-city"),
        role: card.querySelector(".partner-role") ? card.querySelector(".partner-role").textContent : card.getAttribute("data-type"),
        initials: nameForAvatar.split(' ').map(n=>n[0]).filter(Boolean).slice(0,2).join('').toUpperCase()
      }

      openModal(data)
    })

  // If user clicks explicit "Voir le profil" button, open the modal too
    const profileBtn = card.querySelector('.profile-btn')
    if (profileBtn) {
      profileBtn.addEventListener('click', (ev) => {
        ev.stopPropagation()
        const data = {
          name: card.getAttribute("data-name"),
          email: card.getAttribute("data-email"),
          phone: card.getAttribute("data-phone"),
          city: card.getAttribute("data-city"),
          role: card.querySelector(".partner-role") ? card.querySelector(".partner-role").textContent : card.getAttribute("data-type"),
      initials: nameForAvatar.split(' ').map(n=>n[0]).filter(Boolean).slice(0,2).join('').toUpperCase()
        }
        openModal(data)
      })
    }
  })

  modalClose.addEventListener("click", closeModal)

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal()
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal()
    }
  })
})
