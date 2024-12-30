(function () {
    class BookingPlugin {
      constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.container = null;
        this.selectedSlot = null;
        this.selectedDate = null;
        this.name = "";
        this.phone = "";
      }
  
      async init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
          console.error("Container not found!");
          return;
        }
  
        this.container.innerHTML = `
          <div class="booking-container">
              <div class="booking-header">
                  <h3>Book Your Appointment</h3>
              </div>
  
              <!-- Step 1: User inputs their details -->
              <div id="user-details">
                  <div class="booking-form">
                      <input type="text" id="name" placeholder="Your Name" required />
                      <input type="tel" id="phone" placeholder="Phone Number" required />
                      <input type="date" id="date" name="date" required />
                      <button id="next-step-btn">Next</button>
                  </div>
              </div>
  
              <!-- Step 2: Available slots for selected date -->
              <div id="slots-container" style="display:none;">
                  <h4>Select a Time Slot</h4>
                  <div id="slots"></div>
                  <button id="book-now-btn" style="display:none;">Book Now</button>
                  <button id="back-btn" style="display:inline-block; margin-top: 10px;">Back</button>
              </div>
  
          </div>
        `;
  
        this.setupEventListeners();
      }
  
      setupEventListeners() {
        // Set min date to today to prevent past date selection
        const dateInput = this.container.querySelector("#date");
        dateInput.setAttribute("min", this.getCurrentDate());
  
        // Handle Next button click (to move to step 2)
        const nextStepBtn = this.container.querySelector("#next-step-btn");
        nextStepBtn.addEventListener("click", async () => {
          this.name = this.container.querySelector("#name").value;
          this.phone = this.container.querySelector("#phone").value;
          this.selectedDate = this.container.querySelector("#date").value;
  
          // Validate input
          if (!this.name || !this.phone || !this.selectedDate) {
            alert("Please fill all the details!");
            return;
          }
  
          // Proceed to load available slots for the selected date
          await this.loadSlots(this.selectedDate);
        });
  
        // Handle slot selection
        const slotsContainer = this.container.querySelector("#slots");
        slotsContainer.addEventListener("click", (e) => {
          if (
            e.target.classList.contains("slot") &&
            !e.target.classList.contains("booked")
          ) {
            this.selectedSlot = e.target.getAttribute("data-id");
  
            // Remove selected class from all slots
            Array.from(slotsContainer.children).forEach((child) =>
              child.classList.remove("selected")
            );
  
            // Add selected class to clicked slot
            e.target.classList.add("selected");
          }
        });
  
        // Handle booking confirmation
        const bookNowBtn = this.container.querySelector("#book-now-btn");
        bookNowBtn.addEventListener("click", async () => {
          if (!this.selectedSlot) {
            alert("Please select a slot!");
            return;
          }
  
          const response = await fetch(`${this.apiUrl}/bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: this.name,
              phone: this.phone,
              date: this.selectedDate,
              time: this.selectedSlot,
            }),
          });
  
          const result = await response.json();
  
          if (response.ok) {
            alert(result.message || "Booking successful!");
          } else {
            alert("Booking failed! Try again.");
          }
        });
  
        const backBtn = this.container.querySelector("#back-btn");
        backBtn.addEventListener("click", () => {
          // Go back to the user details step
          this.container.querySelector("#user-details").style.display = "block";
          this.container.querySelector("#slots-container").style.display = "none";
        });
      }
  
      // Get current date in YYYY-MM-DD format
      getCurrentDate() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
      }
  
      // Load available slots for the selected date
      async loadSlots(date) {
        if (!date) return;
  
        this.container.querySelector("#user-details").style.display = "none";
        this.container.querySelector("#slots-container").style.display = "block";
  
        try {
          const response = await fetch(`${this.apiUrl}/slots/${date}`);
          if (!response.ok) {
            console.error("Error fetching slots:", response.statusText);
            return;
          }
          const data = await response.json();
  
          const slotsContainer = this.container.querySelector("#slots");
          slotsContainer.innerHTML = data
            .map(
              (slot) => {
                // Get current time and disable past slots if the date is today
                const slotTime = new Date(`${date}T${slot.time}:00`);
                const now = new Date();
                const isPast = slotTime < now && date === this.getCurrentDate();
  
                return `
                      <div class="slot ${slot.isBooked ? "booked" : ""} ${isPast ? "disabled" : ""}" data-id="${slot.time}">
                          ${slot.time}
                      </div>
                  `;
              }
            )
            .join("");
  
          this.container.querySelector("#book-now-btn").style.display =
            "inline-block";
        } catch (error) {
          console.error("Error loading slots:", error);
        }
      }
    }
  
    window.BookingPlugin = BookingPlugin;
  })();
  