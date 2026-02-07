const loginHero =
  document.queryselector(".hero.login");
const loginForm = 
  document.queryselector(".form.login");
const registerHero = 
  document.queryselector(".hero.register");
const registerForm = 
  document.queryselector(".form.register");
const cardBg = 
  document.queryselector(".card-bg");
  
const toggleView = () => {
  const loginActive =
  loginHero.classList.contains("active");
  
  cardBg.classList.togglr("login", !loginActive);

  [loginHero , loginForm]
    .forEach(el =>
      el
    .classList
    .toggle("active"));
  [registerHero, registerForm]
    .forEach(el =>
    el
    .classList
    .toggle("active"));
}  