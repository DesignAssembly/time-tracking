document.addEventListener("DOMContentLoaded", () => {
    const buttons = {
      daily: document.getElementById("daily"),
      weekly: document.getElementById("weekly"),
      monthly: document.getElementById("monthly"),
    };
    class TimeCard {
      constructor(el) {
        this.activity = el.dataset.activity;
        this.currentEl = el.querySelector(".time-label--current");
        this.previousEl = el.querySelector(".time-label--previous");
      }
      update(data, label) {
        this.currentEl.textContent = `${data.current}hrs`;
        this.previousEl.textContent = `${label} - ${data.previous}hrs`;
      }
    }
  
    const cards = {};
    document.querySelectorAll(".card").forEach((el) => {
        const activityRaw = el.dataset.activity;
        if (!activityRaw) return; // 🛑 Skip if not a time tracking card
        const activity = activityRaw.toLowerCase().replace(/\s+/g, "");
        cards[activity] = new TimeCard(el);
      });
  
    let timedata = [];
    async function fetchData() {
      try {
        const response = await fetch("data.json");
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        timedata = await response.json();
        updateDashboard("weekly");
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    }
    function updateDashboard(timeframe) {
      if (!timedata.length) return;
  
      Object.values(buttons).forEach((btn) => btn.classList.remove("active"));
      buttons[timeframe].classList.add("active");
  
      const label =
        timeframe === "daily"
          ? "Yesterday"
          : timeframe === "weekly"
          ? "Last Week"
          : "Last Month";
  
      timedata.forEach((entry) => {
        const key = entry.title.toLowerCase().replace(/\s+/g, "");
        if (cards[key]) {
          cards[key].update(entry.timeframes[timeframe], label);
        }
      });
    }
  
    Object.entries(buttons).forEach(([key, btn]) =>
      btn.addEventListener("click", () => updateDashboard(key))
    );
  
    fetchData();
  });
  