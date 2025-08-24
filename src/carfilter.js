const cars = [
  { name: 'Honda Amaze', price: 500000, availableAt: ['Delhi', 'Mumbai', 'Bangalore'] },
  { name: 'Hyundai i20', price: 650000, availableAt: ['Mumbai', 'Chennai'] },
  { name: 'Tata Nexon', price: 900000, availableAt: ['Delhi', 'Pune'] },
  { name: 'Maruti Alto', price: 350000, availableAt: ['Delhi', 'Jaipur'] },
  { name: 'Kia Seltos', price: 1000000, availableAt: ['Hyderabad'] }
];

document.getElementById('filterForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const location = document.getElementById('location').value.trim();
  const maxPrice = parseInt(document.getElementById('price').value.trim());

  const filtered = cars.filter(car =>
    car.availableAt.includes(location) && car.price <= maxPrice
  );

  const resultsContainer = document.getElementById('carResults');
  resultsContainer.innerHTML = '';

  if (filtered.length === 0) {
    resultsContainer.innerHTML = '<p>No cars available matching your criteria.</p>';
  } else {
    filtered.forEach(car => {
      const div = document.createElement('div');
      div.className = 'car-card';
      div.innerHTML = `<h3>${car.name}</h3><p>Price: ₹${car.price}</p>`;
      resultsContainer.appendChild(div);
    });
  }
});
