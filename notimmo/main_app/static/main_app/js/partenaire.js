// Search and filter functionality
let modalContainer;
document.addEventListener("DOMContentLoaded", () => {
  modalContainer = document.getElementById("partnerModal");
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

function openModal(element){
  
  modalContainer.innerHTML = `
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <button class="close-btn" id="modalClose" aria-label="Fermer" onclick="modalContainer.classList.remove('active')">&times;</button>
        <div class="modal-header">
            <div id="modalAvatar" class="avatar avatar-lg" aria-hidden="true">
            ${element.getAttribute('data-initials').toUpperCase()}
            </div>
            <div>
                <h3 id="modalTitle">${element.getAttribute('data-name')}</h3>
                <p id="modalRole" class="partner-role">${element.getAttribute('data-type')}</p>
            </div>
        </div>
        <div class="modal-body">
            <div class="modal-row"><i class="fas fa-envelope"></i> <strong>Email:</strong> <a href="#"
                    id="modalEmail">${element.getAttribute('data-email')}</a></div>
            <div class="modal-row"><i class="fas fa-phone"></i> <strong>Téléphone:</strong> <a href="#"
                    id="modalPhone">${element.getAttribute('data-phone')}</a></div>
            <div class="modal-row"><i class="fas fa-map-marker-alt"></i> <strong>Localisation:</strong> <span
                    id="modalLocation">${element.getAttribute('data-city')}</span></div>
            <div class="modal-actions" style="margin-top:12px; display:flex; gap:10px;">
                <a id="modalEmailBtn" class="contact-btn" href="mailto:${element.getAttribute('data-email')}}"><i class="fas fa-paper-plane"></i> Envoyer un
                    email</a>
                <a id="modalCallBtn" class="profile-btn" href="tel:${element.getAttribute('data-phone').replace(/\s+/,'')}"><i class="fas fa-phone"></i> Appeler</a>
            </div>
        </div>
    </div>
  
  `;


  modalContainer.classList.add('active');

}

