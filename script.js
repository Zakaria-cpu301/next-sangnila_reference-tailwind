const element = {
  defLink: document.querySelectorAll("#defLink"),
  endpoint: "https://lms.sangnilaindonesia.com/api/highlighted-portfolio",
};
element.defLink.forEach((el) =>
  el.setAttribute("src", `https://sangnila.com${el.getAttribute("src")}`)
);

async function applyData() {
  const r = await fetch(element.endpoint);
  const data = await r.json();

  const { portfolios } = data;
  portfolios.map(({ code, portfolios: students }) => {
    if (code === "DGDW") {
      students.map(({ path, student }) => {
        const dgwg = document.querySelector(".digital-drawing > div");
        dgwg.innerHTML += `
          <div class="flex flex-col w-96" style="margin-right: 40px;">
            <img src="https://lms.sangnilaindonesia.com/storage/${path}" class="rounded-lg">
            <h1 class="text white font-bold text-lg">Student Portofolio - Digital Drawing</h1>
            <h1 class="text white text-xl">${student.full_name}</h1>
          </div>
            `;
      });
    } else {
      students.map(({ path, student }) => {
        const dgwg = document.querySelector(".twoD-animation > div");
        setTimeout(() => {
          dgwg.innerHTML += `
          <div class="flex flex-col text-white">
          <video autoplay muted loop class="rounded-lg">
          <source src="https://lms.sangnilaindonesia.com/storage/${path}" type="video/mp4" />
          </video>
          <h1 class="text white font-semibold text-2xl">
          Student Portofolio - Digital Drawing
          </h1>
          <h1 class="text white text-xl">${student.full_name}</h1>
          </div>
          `;
        }, 0);
      });
    }
  });
}
applyData();

const carousel = document.getElementById("carousel");
let isDown = false;
let startX;
let scrollLeft;

carousel.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener("mouseleave", () => {
  isDown = false;
});

carousel.addEventListener("mouseup", () => {
  isDown = false;
  snapToClosest();
});

carousel.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 1.2;
  carousel.scrollLeft = scrollLeft - walk;
});

// Touch support
carousel.addEventListener("touchstart", (e) => {
  isDown = true;
  startX = e.touches[0].pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener("touchend", () => {
  isDown = false;
  snapToClosest();
});

carousel.addEventListener("touchmove", (e) => {
  if (!isDown) return;
  const x = e.touches[0].pageX - carousel.offsetLeft;
  const walk = (x - startX) * 1.2;
  carousel.scrollLeft = scrollLeft - walk;
});

// Snap to closest slide
function snapToClosest() {
  const slideWidth = carousel.querySelector("div").offsetWidth + 24; // 24px = gap-6
  const scroll = carousel.scrollLeft;
  const index = Math.round(scroll / slideWidth);
  carousel.scrollTo({
    left: index * slideWidth,
    behavior: "smooth",
  });
}

const slider = document.getElementById("sliderContainer");
const slideWidth = 1300;
let currentIndex = 1; // karena index 0 adalah clone terakhir
const totalSlides = 5; // cloneLast + 3 asli + cloneFirst

// Set posisi awal
slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

// Tombol Next (kanan)
document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentIndex >= totalSlides - 1) return;
  currentIndex++;
  slider.style.transition = "transform 0.5s ease-in-out";
  slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
});

// Tombol Prev (kiri)
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentIndex <= 0) return;
  currentIndex--;
  slider.style.transition = "transform 0.5s ease-in-out";
  slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
});

// Cek posisi jika masuk clone
slider.addEventListener("transitionend", () => {
  // Kalau kita sampai di clone paling kanan (clone pertama)
  if (currentIndex === totalSlides - 1) {
    slider.style.transition = "none";
    currentIndex = 1; // lompat ke slide asli ke-1
    slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  }

  // Kalau kita sampai di clone paling kiri (clone terakhir)
  if (currentIndex === 0) {
    slider.style.transition = "none";
    currentIndex = totalSlides - 2; // lompat ke slide asli terakhir
    slider.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
  }
});
