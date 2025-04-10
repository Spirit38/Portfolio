const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
const burgerIcon = document.getElementById('burger-icon');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('active');

  // Change icône entre burger et X
  if (navLinks.classList.contains('active')) {
    burgerIcon.classList.remove('fa-bars');
    burgerIcon.classList.add('fa-times');
  } else {
    burgerIcon.classList.remove('fa-times');
    burgerIcon.classList.add('fa-bars');
  }
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    burgerIcon.classList.remove('fa-times');
    burgerIcon.classList.add('fa-bars');
  });
});