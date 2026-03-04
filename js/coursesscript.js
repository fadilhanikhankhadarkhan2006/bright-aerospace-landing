const courses = [
  {
    title: "Basics Of Space Flight",
    status: "Upcoming",
    duration: "4 weeks",
    level: "beginner",
    desc: "Understand the Fundamental physics behind launching rockets into orbits.",
    price: "Free",
    img: "card1.jpg"
  },
  {
    title: "Rocket Propulsion",
    status: "Upcoming",
    duration: "6 weeks",
    level: "intermediate",
    desc: "Deep dive into rocket engines, fuel types and thrust mechanics.",
    price: "Free",
    img: "card2.jpg"
  },
  {
    title: "Orbital Mechanics",
    status: "Live",
    duration: "5 weeks",
    level: "advanced",
    desc: "Learn how satellites maintain orbit and how transfers work.",
    price: "₹499",
    img: "card3.jpg"
  },
  {
    title: "Astronomy 101",
    status: "Upcoming",
    duration: "3 weeks",
    level: "beginner",
    desc: "Explore stars, galaxies and the universe from scratch.",
    price: "Free",
    img: "card4.jpg"
  },
  {
    title: "Space Navigation",
    status: "Live",
    duration: "4 weeks",
    level: "intermediate",
    desc: "How spacecraft find their way across millions of miles.",
    price: "₹299",
    img: "card5.jpg"
  },
  {
    title: "Satellite Technology",
    status: "Upcoming",
    duration: "5 weeks",
    level: "beginner",
    desc: "How satellites are built, launched and operated in orbit.",
    price: "Free",
    img: "card6.jpg"
  },
  {
    title: "Mars Exploration",
    status: "Upcoming",
    duration: "7 weeks",
    level: "intermediate",
    desc: "Study missions, rovers and the future of Mars colonization.",
    price: "₹199",
    img: "card7.jpg"
  },
  {
    title: "Space Suits & Life Support",
    status: "Live",
    duration: "3 weeks",
    level: "beginner",
    desc: "How astronauts survive the extreme conditions of outer space.",
    price: "Free",
    img: "card8.jpg"
  },
  {
    title: "Black Holes & Relativity",
    status: "Upcoming",
    duration: "8 weeks",
    level: "advanced",
    desc: "Understand spacetime, gravity and the physics of black holes.",
    price: "₹599",
    img: "card9.jpg"
  },
  {
    title: "Astrophysics Basics",
    status: "Upcoming",
    duration: "6 weeks",
    level: "intermediate",
    desc: "The physics that governs stars, nebulae and cosmic events.",
    price: "Free",
    img: "card10.jpg"
  },
  {
    title: "Moon Missions",
    status: "Live",
    duration: "4 weeks",
    level: "beginner",
    desc: "From Apollo to Artemis — the history and future of lunar exploration.",
    price: "Free",
    img: "card11.jpg"
  },
  {
    title: "Space Robotics",
    status: "Upcoming",
    duration: "5 weeks",
    level: "advanced",
    desc: "Robotic arms, rovers and autonomous systems used in space missions.",
    price: "₹399",
    img: "card12.jpg"
  }
];

function makeCard(course) {
  return `
    <div class="course-card">
      <div class="card-img-placeholder">
        <img src="${course.img}" style="width:100%;height:100%;object-fit:cover;display:block;">
      </div>
      <div class="card-body">
        <div class="card-title">${course.title}</div>
        <div class="badge-upcoming">${course.status}</div>
        <div class="card-meta">
          <span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            ${course.duration}
          </span>
          <span>${course.level}</span>
        </div>
        <div class="card-desc">${course.desc}</div>
        <div class="card-footer">
          <span class="price-free">${course.price}</span>
          <button class="btn-start">Start Now</button>
        </div>
      </div>
    </div>`;
}

document.getElementById('row1').innerHTML = courses.slice(0, 4).map(makeCard).join('');
document.getElementById('row2').innerHTML = courses.slice(4, 8).map(makeCard).join('');
document.getElementById('row3').innerHTML = courses.slice(8, 12).map(makeCard).join('');
